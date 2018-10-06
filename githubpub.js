const myProductName = "githubpub", myVersion = "0.5.35";   

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
exports.getContentFromGitHub = getContentFromGitHub; //10/2/18 by DW
exports.getRepositoryDomain = getRepositoryDomain;
exports.saveToGitHub = saveToGitHub; //10/2/18 by DW
exports.getUserInfo = getUserInfo; //10/5/18 by DW

const fs = require ("fs");
const utils = require ("daveutils");
const davehttp = require ("davehttp"); 
const request = require ("request"); 
const marked = require ("marked");
const yaml = require ("js-yaml");
const dateFormat = require ("dateformat");
const qs = require ("querystring");

var config = {
	port: 80,
	flPostEnabled: true,
	flAllowAccessFromAnywhere: true,
	flDebugMessagesFromGitHub: false,
	flDebugObjectsFromGitHub: false,
	apiUrl: "https://api.github.com/repos/",
	//urlMarkdownTemplate: "http://fargo.io/code/shared/githubpub/template/template.txt", 
	flLogToConsole: true,
	indexFileName: "index",
	userAgent: myProductName + " v" + myVersion,
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
function urlToMime (url) {
	var ext = getFileExtension (url);
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
//function deYamlIze (data) {
	//const delimiter = "---\n";
	//var filetext = data.toString ();
	//function justText (s) {
		//var jstruct = {
			//text: s
			//}
		//return (utils.jsonStringify (jstruct));
		//}
	//if (utils.beginsWith (filetext, delimiter)) {
		//var frontmatter = utils.stringNthField (filetext, delimiter, 2);
		//var remainingtext = utils.stringDelete (filetext, 1, frontmatter.length + (2 * delimiter.length));
		//if (frontmatter.length > 0) {
			//var jstruct = yaml.safeLoad (frontmatter);
			//console.log ("\ndeYamlIze: frontmatter == \n" + frontmatter + "\n");
			//jstruct.text = remainingtext;
			//return (utils.jsonStringify (jstruct));
			//}
		//return (justText (filetext));
		//}
	//return (justText (filetext));
	//}
function deYamlIze (data) { //this version came from englishServer, and correctly returns a struct in all cases
	const delimiter = "---\n";
	var filetext = data.toString ();
	if (utils.beginsWith (filetext, delimiter)) {
		var frontmatter = utils.stringNthField (filetext, delimiter, 2);
		var remainingtext = utils.stringDelete (filetext, 1, frontmatter.length + (2 * delimiter.length));
		if (frontmatter.length > 0) {
			var jstruct = yaml.safeLoad (frontmatter);
			jstruct.text = remainingtext;
			return (jstruct);
			}
		return ({text: filetext});
		}
	return ({text: filetext});
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
function getRepositoryDomain (username, repository) { //9/30/18 by DW
	username = utils.stringLower (username);
	repository = utils.stringLower (repository);
	for (var domain in config.domains) {
		var item = config.domains [domain];
		if ((utils.stringLower (item.username) == username) && (utils.stringLower (item.repository) == repository)) {
			return (domain);
			}
		}
	return (undefined);
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
				//console.log ("cacheRef: serving from cache, username == " + username + ", repository == " + repository + ", path == " + path);
				return (item.data);
				}
			}
		}
	return (undefined);
	}
function cacheDelete (username, repository, path) {
	//
	if (!utils.beginsWith (path, "/")) {
		path = "/" + path;
		}
	//
	//console.log ("cacheDelete --- here's a dump of the cache.")
	//cacheDump ();
	//
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
function getFromGitHub (username, repository, path, callback) { //calls back with the JSON structure GitHub returns
	if (!utils.beginsWith (path, "/")) {
		path = "/" + path;
		}
	var data = cacheRef (username, repository, path);
	if (data !== undefined) {
		//console.log ("getFromGitHub: serving from cache, path == " + path);
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
					//console.log ("getFromGitHub: response.headers == " + utils.jsonStringify (response.headers))
					if (response.headers ["x-ratelimit-remaining"] == 0) {
						var theLimit = response.headers ["x-ratelimit-limit"];
						callback ({"message": "GitHub reported a rate limit error. You are limited to " + theLimit + " calls per hour."});
						}
					else {
						try {
							var jstruct = JSON.parse (jsontext);
							//console.log ("getFromGitHub: path == " + path + ", " + utils.secondsSince (whenstart) + " secs.");
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
function getContentFromGitHub (domain, path, callback) { //calls back with the content GitHub returned
	var dstruct = config.domains [domain.toLowerCase ()]
	if (dstruct === undefined) {
		var s = "The domain \"" + domain + "\" is not defined.";
		console.log ("getContentFromGitHub: s == " + s);
		callback ({message: s});
		}
	else {
		if (!utils.beginsWith (path, "/")) {
			path = "/" + path;
			}
		getFromGitHub (dstruct.username, dstruct.repository, dstruct.path + path, function (err, jstruct) {
			if (err) {
				callback (err);
				}
			else {
				var content = jstruct.content;
				if (jstruct.encoding == "base64") {
					content = new Buffer (content, "base64"); 
					}
				callback (undefined, content);
				}
			});
		}
	}
function getUserObject (host, path, callback) {
	if (!utils.beginsWith (path, "/")) {
		path = "/" + path;
		}
	var dstruct = config.domains [host.toLowerCase ()];
	if (dstruct === undefined) {
		callback ({message: "The domain \"" + host + "\" is not defined."});
		}
	else {
		getFromGitHub (dstruct.username, dstruct.repository, dstruct.path + path, function (err, jstruct) {
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
function saveToGitHub (options, callback) { //10/2/18 by DW
	var lowerdomain = options.domain.toLowerCase ();
	var dstruct = config.domains [lowerdomain]
	if (dstruct === undefined) {
		var s = "The domain \"" + lowerdomain + "\" is not defined.";
		console.log ("saveToGitHub: s == " + s);
		callback ({message: s});
		}
	else {
		if (!utils.beginsWith (options.path, "/")) {
			options.path = "/" + options.path;
			}
		var actualpath = dstruct.path + options.path;
		getFromGitHub (dstruct.username, dstruct.repository, actualpath, function (err, jstruct) {
			var bodyStruct = { 
				message: options.message,
				committer: {
					name: options.committer.name,
					email: options.committer.email
					},
				content: new Buffer (options.data).toString ("base64")
				};
			if (jstruct !== undefined) {
				bodyStruct.sha = jstruct.sha;
				}
			var url = "https://api.github.com/repos/" + dstruct.username + "/" + dstruct.repository + "/contents/" + actualpath;
			var theRequest = {
				method: "PUT",
				url: url,
				body: JSON.stringify (bodyStruct),
				headers: {
					"User-Agent": options.userAgent,
					"Authorization": "token " + options.accessToken,
					"Content-Type": options.type
					}
				};
			//console.log ("saveToGitHub: theRequest == " + utils.jsonStringify (theRequest));
			request (theRequest, function (err, response, body) { 
				if (err) {
					console.log ("saveToGitHub: err.message == " + err.message);
					callback (err);
					}
				else {
					var jstruct = {
						domain: lowerdomain,
						urlHtml: "http://" + lowerdomain + options.path,
						urlGitHub: "https://github.com/" + dstruct.username + "/" + dstruct.repository + "/blob/master/" + actualpath
						};
					callback (undefined, jstruct);
					}
				});
			});
		}
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
function getUserInfo (accessToken, callback) {
	var myRequest = {
		method: "GET",
		url: "https://api.github.com/user",
		headers: {
			"User-Agent": config.userAgent,
			"Authorization": "token " + accessToken
			}
		};
	request (myRequest, function (err, response, body) { 
		var myResponse = {
			flError: true,
			message: undefined
			};
		if (err) {
			myResponse.message = err.message;
			}
		else {
			try {
				myResponse.flError = false;
				myResponse.info = JSON.parse (body);
				}
			catch (err) {
				myResponse.message = err.message;
				}
			}
		callback (myResponse);
		});
	}
function handleHttpRequest (theRequest) {
	var accessToken = theRequest.params.accessToken, now = new Date ();
	function returnData (jstruct) {
		theRequest.httpReturn (200, "application/json", utils.jsonStringify (jstruct));
		}
	function returnError (jstruct) {
		theRequest.httpReturn (500, "application/json", utils.jsonStringify (jstruct));
		}
	function notFound (message) {
		theRequest.httpReturn (404, "text/plain", message);
		}
	function getFileContent (jstruct, callback) {
		//console.log ("getFileContent: jstruct == " + utils.jsonStringify (jstruct));
		//console.log ("getFileContent: jstruct.type == " + jstruct.type);
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
						//var ext = getFileExtension (jstruct.download_url);
						function serveMarkdown () {
							var pagetable = deYamlIze (fileContent.toString ());
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
							//case "txt":
								//theRequest.httpReturn (200, "text/plain", fileContent);
								//break;
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
			console.log ("\nhandleGitHubEvent: owner == " + owner + ", repo == " + repo + ", path == " + path + "\n");
			cacheDelete (owner, repo, path);
			theRequest.httpReturn (200, "text/plain", "Thanks for the ping.");
			}
		}
	function handleEditorEvent (domain, path) {
		var dstruct = config.domains [domain.toLowerCase ()]
		if (dstruct !== undefined) {
			console.log ("\nhandleEditorEvent: domain == " + domain + ", path == " + path + "\n");
			cacheDelete (dstruct.username, dstruct.repo, dstruct.path + path);
			theRequest.httpReturn (200, "text/plain", "Thanks for the ping.");
			}
		}
	function handleOauthCallback () {
		var params = {
			client_id: config.clientId,
			client_secret: config.clientSecret,
			code: theRequest.params.code
			};
		var apiUrl = "https://github.com/login/oauth/access_token?" + utils.buildParamList (params);
		//apiUrl += "?client_id=" + config.clientId;
		//apiUrl += "&client_secret=" + config.clientSecret;
		//apiUrl += "&code=" + theRequest.params.code;
		var githubRequest = {
			method: "POST",
			url: apiUrl
			//followRedirect: true, 
			//headers: {Accept: "application/json"}
			};
		console.log ("handleOauthCallback: githubRequest === " + utils.jsonStringify (githubRequest));
		request (githubRequest, function (err, response, body) {
			if (err) {
				console.log (err.message);
				theRequest.httpReturn (500, "text/plain", err.message);
				}
			else {
				//console.log (body);
				var postbody = qs.parse (body);
				var httpResponse = theRequest.sysResponse;
				var urlRedirect = config.urlEditorApp + "?access_token=" + postbody.access_token;
				httpResponse.writeHead (302, {"location": urlRedirect});
				httpResponse.end ("Redirect to this URL: " + urlRedirect);
				theRequest.httpReturn (200, "text/plain", "We got the callback bubba.");
				}
			});
		}
	switch (theRequest.lowerpath) {
		case "/now":
			theRequest.httpReturn (200, "text/plain", new Date ());
			return;
		case "/oauthcallback":
			handleOauthCallback ();
			//var apiUrl = "https://github.com/login/oauth/access_token";
			//apiUrl += "?client_id=" + config.clientId;
			//apiUrl += "&client_secret=" + config.clientSecret;
			//apiUrl += "&code=" + theRequest.params.code;g
			//var githubRequest = {
				//method: "POST",
				//url: apiUrl
				//followRedirect: true, 
				//headers: {Accept: "application/json"}
				//};
			//console.log ("/oauthcallback: githubRequest == " + utils.jsonStringify (githubRequest));
			//request (githubRequest, function (err, response, body) {
				//if (err) {
					//console.log (err.message);
					//theRequest.httpReturn (500, "text/plain", err.message);
					//}
				//else {
					//console.log (body);
					//var postbody = qs.parse (body);
					//var httpResponse = theRequest.sysResponse;
					//var urlRedirect = config.urlEnglishApp + "?access_token=" + postbody.access_token;
					//httpResponse.writeHead (302, {"location": urlRedirect});
					//httpResponse.end ("Redirect to this URL: " + urlRedirect);
					//theRequest.httpReturn (200, "text/plain", "We got the callback bubba.");
					//}
				//});
			break;
		case "/eventfromgithub": //webhook call
			handleGitHubEvent (theRequest.postBody);
			break;
		case "/eventfromeditor": //indicated object changed, remove from cache (ping)
			var params = theRequest.params;
			handleEditorEvent (params.domain, params.path);
			break;
		case "/getdomains":
			returnData (config.domains);
			break;
		case "/getuserinfo":
			getUserInfo (accessToken, function (result) {
				returnData (result);
				});
			break;
		case "/get":
			var domain = theRequest.params.domain;
			var path = theRequest.params.path;
			//var username = theRequest.params.username;
			//var repository = theRequest.params.repo;
			getContentFromGitHub (domain, path, function (err, content) {
				if (err) {
					returnError (err);
					}
				else {
					theRequest.httpReturn (200, urlToMime (path), content);
					}
				});
			break;
		case "/save":
			var options = {
				domain: theRequest.params.domain,
				//username: theRequest.params.username,
				//repository: theRequest.params.repo,
				path: theRequest.params.path,
				accessToken: accessToken,
				data: theRequest.params.text,
				type: "text/plain",
				committer: {
					name: theRequest.params.name,
					email: theRequest.params.email
					},
				message: theRequest.params.msg,
				userAgent: config.userAgent
				};
			saveToGitHub (options, function (err, result) {
				if (err) {
					returnError (err);
					}
				else {
					returnData (result);
					}
				});
			break;
		case "/savepost":
			//function yamlIze (jsontext) {
				//var jstruct = JSON.parse (jsontext);
				//const delimiter = "---\n";
				//var text = jstruct.text;
				//delete jstruct.text;
				//var s = delimiter + yaml.safeDump (jstruct) + delimiter + text;
				//return (s);
				//}
			var options = {
				domain: theRequest.params.domain,
				//username: theRequest.params.username,
				//repository: theRequest.params.repo,
				path: theRequest.params.path,
				accessToken: accessToken,
				data: yamlIze (theRequest.params.text), //this is the diff
				type: "text/plain",
				committer: {
					name: theRequest.params.name,
					email: theRequest.params.email
					},
				message: theRequest.params.msg,
				userAgent: config.userAgent
				};
			saveToGitHub (options, function (err, result) {
				if (err) {
					returnError (err);
					}
				else {
					returnData (result);
					}
				});
			break;
		case "/getpost":
			var domain = theRequest.params.domain;
			var path = theRequest.params.path;
			getContentFromGitHub (domain, path, function (err, content) {
				if (err) {
					returnError (err);
					}
				else {
					var returnStruct = deYamlIze (content);
					returnStruct.domain = gitpub.getRepositoryDomain (username, repository);
					returnData (returnStruct);
					}
				});
			break;
		default:
			serveObject (theRequest.lowerhost, theRequest.path);
			break;
		}
	}
function handleExternalRequest (options, callback) { //9/28/18 by DW -- an external caller is making a request
	//Changes
		//9/28/18; 11:24:09 AM by DW
			//Created.
	var theRequest = {
		lowerhost: options.host.toLowerCase (),
		lowerpath: options.path.toLowerCase (),
		path: options.path,
		postBody: options.postBody,
		params: options.params,
		sysResponse: options.sysResponse,
		httpReturn: callback
		};
	handleHttpRequest (theRequest);
	}
function init (userConfig, flHandleHttpHere) {
	//Changes
		//9/28/18; 11:30:36 AM by DW
			//New optional param, flHandleHttpHere. If true, we set up the HTTP server, otherwise we just accept the config params. 
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
