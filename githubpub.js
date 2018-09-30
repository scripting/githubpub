const myProductName = "githubpub", myVersion = "0.5.20";  

/*  The MIT License (MIT)
	Copyright (c) 2014-2018 Dave Winer
	
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
exports.handleRequest = handleExternalRequest;
exports.addToCache = addToCache;
exports.cacheRef = cacheRef;
exports.cacheDelete = cacheDelete;
exports.cacheDump = cacheDump;
exports.getCacheSize = getCacheSize;
exports.getFromGitHub = getFromGitHub;

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
	flAllowAccessFromAnywhere: true,
	flDebugMessagesFromGitHub: false,
	flDebugObjectsFromGitHub: true,
	apiUrl: "https://api.github.com/repos/",
	urlMarkdownTemplate: "http://fargo.io/code/shared/githubpub/template/template.txt", 
	flLogToConsole: true,
	indexFileName: "index",
	defaultFilesLocation: {
		username: "scripting",
		repository: "githubpub",
		path: "defaultfiles"
		}
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

function cacheDump (callback) {
	if (callback === undefined) {
		callback = console.log;
		}
	for (var username in cache) {
		for (var repository in cache [username]) {
			for (var path in cache [username] [repository]) {
				callback (username + "." + repository + "." + path);
				}
			}
		}
	}
function addToCache (username, repository, path, data) {
	var now = new Date ();
	if (!utils.beginsWith (path, "/")) {
		path = "/" + path;
		}
	if (cache [username] === undefined) {
		cache [username] = {
			};
		}
	if (cache [username] [repository] === undefined) {
		cache [username] [repository] = {
			};
		}
	if (cache [username] [repository] [path] === undefined) {
		cache [username] [repository] [path] = {
			ctAdds: 0,
			whenRef: now
			};
		}
	cache [username] [repository] [path].ctAdds++;
	cache [username] [repository] [path].whenAdd = now;
	cache [username] [repository] [path].data = data;
	}
function cacheRef (username, repository, path) {
	var now = new Date ();
	if (cache [username] !== undefined) {
		if (cache [username] [repository] !== undefined) {
			if (cache [username] [repository] [path] !== undefined) {
				var item = cache [username] [repository] [path];
				item.ct++;
				item.whenRef = now;
				return (item.data);
				}
			}
		}
	return (undefined);
	}
function cacheDelete (username, repository, path) {
	if (!utils.beginsWith (path, "/")) {
		path = "/" + path;
		}
	if (cache [username] !== undefined) {
		if (cache [username] [repository] !== undefined) {
			if (cache [username] [repository] [path] !== undefined) {
				delete cache [username] [repository] [path];
				}
			}
		}
	}
function getCacheSize () {
	var ct = 0;
	cacheDump (function (s) {
		ct++;
		});
	return (ct);
	}

function getFromGitHub (username, repository, path, callback) {
	if (!utils.beginsWith (path, "/")) {
		path = "/" + path;
		}
	var data = cacheRef (username, repository, path);
	if (data !== undefined) {
		callback (undefined, data);
		}
	else {
		var whenstart = new Date ();
		var url = config.apiUrl + username + "/" + repository + "/contents/" + path;
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
							addToCache (username, repository, path, jstruct);
							if (config.flDebugObjectsFromGitHub) {
								var f = "debug/objects/" + Number (new Date ()) + ".json";
								utils.sureFilePath (f, function () {
									fs.writeFile (f, utils.jsonStringify (jstruct), function (err) {
										});
									});
								}
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
function getUserObject (host, path, callback) {
	if (!utils.beginsWith (path, "/")) {
		path = "/" + path;
		}
	var domain = config.domains [host.toLowerCase ()];
	if (domain === undefined) {
		callback ({message: "The domain \"" + host + "\" is not defined."});
		}
	else {
		getFromGitHub (domain.username, domain.repository, domain.path + path, function (err, jstruct) {
			if (err) {
				var loc = config.defaultFilesLocation;
				getFromGitHub (loc.username, loc.repository, loc.path + path, callback);
				}
			else {
				callback (undefined, jstruct);
				}
			})
		}
	}
function getTemplate (host, callback) {
	getUserObject (host, "template/template.txt", function (err, jstruct) {
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
		console.log ("getFileContent: jstruct == " + utils.jsonStringify (jstruct));
		console.log ("getFileContent: jstruct.type == " + jstruct.type);
		if (jstruct.type == "Buffer") { //9/28/18 by DW
			callback (Buffer.from (jstruct.data));
			}
		else {
			if (jstruct.message !== undefined) { //9/26/18 by DW -- I think this means it was an error, haven't found ref in GH docs
				notFound (jstruct.message);
				}
			else {
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
			}
		}
	function serveObject (host, path) {
		getUserObject (host, path, function (err, jstruct) {
			if (err) {
				notFound (err.message);
				}
			else {
				if (Array.isArray (jstruct)) { //it's a directory
					var flIndexFileServed = false;
					for (var i = 0; i < jstruct.length; i++) {
						if (utils.beginsWith (jstruct [i].name, config.indexFileName)) {
							serveObject (host, path + jstruct [i].name);
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
						var ext = getFileExtension (path); 
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
		if (config.flDebugMessagesFromGitHub) {
			var f = "debug/events/" + Number (new Date ()) + ".json";
			utils.sureFilePath (f, function () {
				fs.writeFile (f, utils.jsonStringify (jstruct), function (err) {
					});
				});
			}
		var owner = jstruct.repository.owner.name;
		var repo = jstruct.repository.name;
		var path = jstruct.commits [0].modified [0];
		if (path !== undefined) { //something was modified, might be in the cache
			console.log ("handleGitHubEvent: owner == " + owner + ", repo == " + repo + ", path == " + path);
			cacheDelete (owner, repo, path);
			theRequest.httpReturn (200, "text/plain", "Thanks for the message.");
			}
		}
	function handleEditorEvent (username, repo, path) {
		console.log ("handleEditorEvent: username == " + username + ", repo == " + repo + ", path == " + path);
		cacheDelete (username, repo, path);
		theRequest.httpReturn (200, "text/plain", "Thanks for the message.");
		}
	switch (theRequest.lowerpath) {
		case "/eventfromgithub":
			handleGitHubEvent (theRequest.postBody);
			break;
		case "/eventfromeditor":
			var params = theRequest.params;
			handleEditorEvent (params.username, params.repo, params.path);
			break;
		default:
			serveObject (theRequest.lowerhost, theRequest.path);
			break;
		}
	}

function handleExternalRequest (options, callback) { //9/28/18 by DW -- an external caller is making a request
	var theRequest = {
		lowerhost: options.host.toLowerCase (),
		lowerpath: options.path.toLowerCase (),
		path: options.path,
		postBody: options.postBody,
		params: options.params,
		httpReturn: callback
		};
	handleHttpRequest (theRequest);
	}

function init (userConfig, flHandleHttpHere) {
	if (flHandleHttpHere === undefined) {
		flHandleHttpHere = true;
		}
	console.log ("\n" + myProductName + " v" + myVersion + "\n");
	for (var x in userConfig) {
		config [x] = userConfig [x];
		}
	if (flHandleHttpHere) {
		davehttp.start (config, function (theRequest) {
			handleHttpRequest (theRequest);
			});
		}
	}
