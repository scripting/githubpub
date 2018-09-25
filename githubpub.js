const myProductName = "githubpub", myVersion = "0.5.8";  

/*  The MIT License (MIT)
	Copyright (c) 2014-2017 Dave Winer
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	*/

exports.init = init;

const fs = require ("fs");
const utils = require ("daveutils");
const davehttp = require ("davehttp"); 
const request = require ("request"); 
const marked = require ("marked");
const yaml = require ("js-yaml");
const dateFormat = require ("dateformat");

var config = {
	port: 80,
	flPostEnabled: true,
	apiUrl: "https://api.github.com/repos/",
	urlMarkdownTemplate: "http://fargo.io/code/shared/githubpub/template/template.txt", 
	flLogToConsole: true,
	indexFileName: "index"
	};

var cache = {
	};

function getFileExtension (url) {
	return (utils.stringLastField (url, ".").toLowerCase ());
	}
function fileExtensionToMime (ext) {
	return (utils.httpExt2MIME (ext));
	}
function yamlIze (jsontext) {
	var jstruct = JSON.parse (jsontext);
	const delimiter = "---\n";
	var text = jstruct.text;
	delete jstruct.text;
	var s = delimiter + yaml.safeDump (jstruct) + delimiter + text;
	return (s);
	}
function deYamlIze (data) {
	const delimiter = "---\n";
	var filetext = data.toString ();
	function justText (s) {
		var jstruct = {
			text: s
			}
		return (utils.jsonStringify (jstruct));
		}
	if (utils.beginsWith (filetext, delimiter)) {
		var frontmatter = utils.stringNthField (filetext, delimiter, 2);
		var remainingtext = utils.stringDelete (filetext, 1, frontmatter.length + (2 * delimiter.length));
		if (frontmatter.length > 0) {
			var jstruct = yaml.safeLoad (frontmatter);
			jstruct.text = remainingtext;
			return (utils.jsonStringify (jstruct));
			}
		return (justText (filetext));
		}
	return (justText (filetext));
	}
function longTimeFormat (when) { 
	return (dateFormat (when, "dddd mmmm d, yyyy; h:MM TT Z"));
	}
function httpRequest (url, callback) {
	var options = {
		url: url,
		jar: true, //"remember cookies for future use"
		maxRedirects: 5,
		headers: {
			"User-Agent": myProductName + " v" + myVersion
			}
		};
	request (options, callback);
	}

function addToCache (host, path, jstruct) {
	var now = new Date ();
	if (cache [host] === undefined) {
		cache [host] = {
			};
		}
	if (cache [host] [path] === undefined) {
		cache [host] [path] = {
			ctAdds: 0,
			whenRef: now
			};
		}
	cache [host] [path].ctAdds++;
	cache [host] [path].whenAdd = now;
	cache [host] [path].jstruct = jstruct;
	}
function cacheRef (host, path) {
	var now = new Date ();
	if (cache [host] !== undefined) {
		if (cache [host] [path] !== undefined) {
			cache [host] [path].ct++;
			cache [host] [path].whenRef = now;
			return (cache [host] [path].jstruct);
			}
		}
	return (undefined);
	}
function cacheDelete (username, repository, path) {
	username = username.toLowerCase ();
	repository = repository.toLowerCase ();
	path = path.toLowerCase ();
	for (x in config.domains) {
		var domain = config.domains [x];
		if (domain.username.toLowerCase () == username) {
			if (domain.repository.toLowerCase () == repository) {
				var cachepath = utils.stringDelete (path, 1, domain.path.length);
				if (cache [x] !== undefined) {
					if (cache [x] [cachepath] !== undefined) {
						delete cache [x] [cachepath];
						return (true);
						}
					}
				}
			}
		}
	return (false); //it wasn't there, nothing deleted
	}

function getGitHubObject (host, path, callback) {
	if (!utils.beginsWith (path, "/")) {
		path = "/" + path;
		}
	var domain = config.domains [host.toLowerCase ()];
	if (domain === undefined) {
		callback ({message: "The domain \"" + host + "\" is not defined."});
		}
	else {
		var jstruct = cacheRef (host, path);
		if (jstruct !== undefined) {
			callback (undefined, jstruct);
			}
		else {
			var whenstart = new Date ();
			var url = config.apiUrl + domain.username + "/" + domain.repository + "/contents/" + domain.path + path;
			if ((config.clientId !== undefined) && (config.clientSecret !== undefined)) {
				url += "?client_id=" + config.clientId + "&client_secret=" + config.clientSecret;
				}
			httpRequest (url, function (err, response, jsontext) {
				if (err) {
					callback (err);
					}
				else {
					if (response.statusCode == 404) {
						callback ({message: "The file \"" + path + "\" was not found."});
						}
					else {
						if (response.headers ["x-ratelimit-remaining"] == 0) {
							var theLimit = response.headers ["x-ratelimit-limit"];
							callback ({"message": "GitHub reported a rate limit error. You are limited to " + theLimit + " calls per hour."});
							}
						else {
							try {
								var jstruct = JSON.parse (jsontext);
								addToCache (host, path, jstruct);
								callback (undefined, jstruct);
								}
							catch (err) {
								callback (err);
								}
							}
						}
					}
				});
			}
		}
	}
function getTemplate (host, callback) {
	getGitHubObject (host, "template/template.txt", function (err, jstruct) {
		if (err) {
			console.log ("getTemplate: err.message == " + err.message);
			callback (err);
			}
		else {
			var buffer = new Buffer (jstruct.content, "base64"); 
			callback (undefined, buffer.toString ());
			}
		});
	}
function renderThroughTemplate (pagetable, callback) {
	getTemplate (pagetable.host, function (err, templatetext) { 
		if (err) {
			callback (err);
			}
		else {
			function setPagePropertiesJson () {
				var myprops = new Object ();
				utils.copyScalars (pagetable, myprops);
				delete myprops.bodytext;
				pagetable.pageproperties = utils.jsonStringify (myprops);
				}
			if (pagetable.title === undefined) {
				pagetable.title = utils.stringLastField (pagetable.path, "/");
				}
			pagetable.createdstring = longTimeFormat (pagetable.created);
			pagetable.modifiedstring = longTimeFormat (pagetable.modified);
			pagetable.now = new Date ();
			setPagePropertiesJson ();
			var htmltext = utils.multipleReplaceAll (templatetext, pagetable, false, "[%", "%]");
			callback (undefined, htmltext);
			}
		});
	}
function handleHttpRequest (theRequest) {
	var now = new Date ();
	function notFound (message) {
		theRequest.httpReturn (404, "text/plain", message);
		}
	function getFileContent (jstruct, callback) {
		if (jstruct.encoding == "base64") {
			var buffer = new Buffer (jstruct.content, "base64"); 
			callback (buffer);
			}
		else {
			httpRequest (jstruct.download_url, function (err, response, fileContent) {
				if (err || (response.statusCode !== 200)) {
					notFound ("Error getting the content of the file \"" + jstruct.name + ".\"");
					}
				else {
					callback (fileContent);
					}
				});
			}
		}
	function serveObject (path) {
		getGitHubObject (theRequest.lowerhost, path, function (err, jstruct) {
			if (err) {
				notFound (err.message);
				}
			else {
				if (Array.isArray (jstruct)) { //it's a directory
					var flIndexFileServed = false;
					for (var i = 0; i < jstruct.length; i++) {
						if (utils.beginsWith (jstruct [i].name, config.indexFileName)) {
							serveObject (path + jstruct [i].name);
							flIndexFileServed = true;
							break;
							}
						}
					if (!flIndexFileServed) {
						notFound ("Couldn't serve the page because there was no \"" + config.indexFileName + "\" file in the directory.");
						}
					}
				else {
					getFileContent (jstruct, function (fileContent) {
						var ext = getFileExtension (jstruct.download_url);
						function serveMarkdown () {
							var pagetable = JSON.parse (deYamlIze (fileContent.toString ()));
							pagetable.bodytext = marked (pagetable.text); //where deYamlIze stores the markdown text
							pagetable.host = theRequest.lowerhost;
							pagetable.path = theRequest.lowerpath;
							pagetable.ext = ext;
							delete pagetable.text;
							renderThroughTemplate (pagetable, function (err, htmltext) {
								if (err) {
									notFound (err.message);
									}
								else {
									theRequest.httpReturn (200, "text/html", htmltext);
									}
								});
							}
						switch (ext) {
							case "md":
								serveMarkdown ();
								break;
							default:
								theRequest.httpReturn (200, fileExtensionToMime (ext), fileContent);
								break;
							}
						});
					}
				}
			});
		}
	function handleGitHubEvent (jsontext) {
		var jstruct = JSON.parse (theRequest.postBody);
		var owner = jstruct.repository.owner.name;
		var repo = jstruct.repository.name;
		var path = jstruct.commits [0].modified [0];
		console.log ("handleGitHubEvent: owner == " + owner + ", repo == " + repo + ", path == " + path);
		cacheDelete (owner, repo, path);
		if (path != "blog/data.json") {
			fs.writeFile ("eventInfo.json", utils.jsonStringify (jstruct), function (err) {
				});
			}
		theRequest.httpReturn (200, "text/plain", "Thanks for the message.");
		}
	switch (theRequest.lowerpath) {
		case "/eventfromgithub":
			handleGitHubEvent (theRequest.postBody);
			break;
		default:
			serveObject (theRequest.path);
			break;
		}
	}
function init (userConfig) {
	console.log ("\n" + myProductName + " v" + myVersion + "\n");
	for (var x in userConfig) {
		config [x] = userConfig [x];
		}
	davehttp.start (config, function (theRequest) {
		handleHttpRequest (theRequest);
		});
	}
