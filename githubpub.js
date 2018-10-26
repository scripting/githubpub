const myProductName = "githubpub", myVersion = "0.5.50";   

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
const rss = require ("daverss");

var config = {
	port: 1402,
	flLogToConsole: true,
	flPostEnabled: true,
	flAllowAccessFromAnywhere: true,
	flDebugMessagesFromGitHub: true,
	flDebugObjectsFromGitHub: false,
	apiUrl: "https://api.github.com/repos/",
	indexFileName: "index",
	userAgent: myProductName + " v" + myVersion,
	urlEditorApp: "http://scripting.com/english/testing2/", //9/16/18 by DW
	templatePath: "template/template.txt",
	dataPath: "data.json", //10/11/18 by DW
	rssPath: "rss.xml",  //10/11/18 by DW
	maxCacheSecs: 180, //10/25/18 by DW -- remove cache element after this many secs
	defaultNameCommitter: "Bull Mancuso",
	defaultEmailCommitter: "bull@mancuso.com",
	defaultFilesLocation: {
		username: "scripting",
		repository: "githubpub",
		path: "defaultfiles"
		}
	};

var cache = {
	};

var stats = {
	ctGitHubPings: -0,
	whenLastGitHubPing: new Date (0),
	ctEditorPings: 0,
	whenLastEditorPing: new Date (0)
	};
const fnamestats = "stats.json";
var flStatsDirty = false;

const yamlDelimiterString = "---\n";

function readStats (callback) {
	fs.readFile (fnamestats, function (err, data) {
		if (!err) {
			var jstruct = JSON.parse (data.toString ());
			for (var x in jstruct) {
				stats [x] = jstruct [x];
				}
			}
		if (callback !== undefined) {
			callback ();
			}
		});
	}
function statsChanged () {
	flStatsDirty = true;
	}
function getFileExtension (url) {
	return (utils.stringLastField (url, ".").toLowerCase ());
	}
function urlToMime (url) {
	var ext = getFileExtension (url);
	return (utils.httpExt2MIME (ext));
	}
function yamlIze (jsontext) {
	var jstruct = JSON.parse (jsontext);
	var text = jstruct.text;
	delete jstruct.text;
	var s = yamlDelimiterString + yaml.safeDump (jstruct) + yamlDelimiterString + text;
	return (s);
	}
function deYamlIze (data) { 
	var filetext = data.toString ();
	if (utils.beginsWith (filetext, yamlDelimiterString)) {
		var frontmatter = utils.stringNthField (filetext, yamlDelimiterString, 2);
		var remainingtext = utils.stringDelete (filetext, 1, frontmatter.length + (2 * yamlDelimiterString.length));
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
function cacheDeleteParent (username, repository, pathChild) {
	if (pathChild !== undefined) {
		var pathParent = utils.stringPopLastField (pathChild, "/") + "/";
		cacheDelete (username, repository, pathParent);
		}
	}
function getCacheSize () {
	var ct = 0;
	cacheDump (function (s) {
		ct++;
		});
	return (ct);
	}
function timeoutCacheElements () { //delete cache elements that are too old
	for (var username in cache) {
		for (var repository in cache [username]) {
			for (var path in cache [username] [repository]) {
				if (utils.secondsSince (cache [username] [repository] [path].whenAdd) >= config.maxCacheSecs) {
					console.log ("timeoutCacheElements, ageing out: " + username + "/" + repository + "/" + path);
					delete cache [username] [repository] [path];
					}
				}
			}
		}
	}
function getFromGitHub (username, repository, path, callback) { //calls back with the JSON structure GitHub returns
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
function getUserObject (host, path, callback) { //get object from user repo, if not found, look in the default location for the system
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
	getUserObject (host, config.templatePath, function (err, jstruct) {
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
function saveToGitHub (options, callback) { //10/2/18 by DW
	if (options.domain !== undefined) {
		var lowerdomain = options.domain.toLowerCase ();
		var dstruct = config.domains [lowerdomain]
		if (dstruct === undefined) {
			var s = "The domain \"" + lowerdomain + "\" is not defined.";
			console.log ("saveToGitHub: s == " + s);
			callback ({message: s});
			return;
			}
		options.username = dstruct.username;
		options.repository = dstruct.repository;
		if (!utils.beginsWith (options.path, "/")) {
			options.path = "/" + options.path;
			}
		options.origpath = options.path;
		options.path = dstruct.path + options.path;
		options.lowerdomain = lowerdomain;
		}
	cacheDelete (options.username, options.repository, options.path); //make sure we don't use the cached version, if any
	getFromGitHub (options.username, options.repository, options.path, function (err, jstruct) {
		if (options.committer === undefined) {
			options.committer = {
				name: config.defaultNameCommitter,
				email: config.defaultEmailCommitter
				};
			}
		if (options.message === undefined) {
			options.message = ".";
			}
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
		var url = config.apiUrl + options.username + "/" + options.repository + "/contents/" + options.path;
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
		request (theRequest, function (err, response, body) { 
			if (err) {
				console.log ("saveToGitHub: err.message == " + err.message);
				callback (err);
				}
			else {
				var jstruct = {
					urlGitHub: "https://github.com/" + options.username + "/" + options.repository + "/blob/master/" + options.path
					};
				if (options.domain !== undefined) {
					jstruct.domain = options.lowerdomain; 
					jstruct.urlHtml = "http://" + options.lowerdomain + options.origpath;
					}
				callback (undefined, jstruct);
				}
			});
		});
	}
function saveGitHubFile (accessToken, host, path, data, callback) {
	var options = {
		domain: host,
		path: path,
		accessToken: accessToken,
		data: data,
		type: urlToMime (path),
		userAgent: config.userAgent
		};
	saveToGitHub (options, callback);
	}
function getFlatPostList (blogData) {
	var theList = [];
	for (var i = 0; i < blogData.posts.subs.length; i++) {
		var year = blogData.posts.subs [i];
		for (var j = 0; j < year.subs.length; j++) {
			var month = year.subs [j];
			for (var k = 0; k < month.subs.length; k++) {
				var day = month.subs [k];
				for (var l = 0; l < day.subs.length; l++) {
					var post = day.subs [l];
					theList.push (post);
					}
				}
			}
		return (theList);
		}
	}

function getBlogData (host, callback) {
	getUserObject (host, config.dataPath, function (err, jstruct) {
		if (err) {
			console.log ("getBlogData: err.message == " + err.message);
			callback (err);
			}
		else {
			var jsontext = getContent (jstruct);
			var blogData = JSON.parse (jsontext);
			callback (undefined, blogData);
			}
		});
	}

function buildBlogRss (options, callback) {
	var host = options.domain;
	options.path = config.rssPath;
	getUserObject (host, config.dataPath, function (err, jstruct) {
		if (err) {
			console.log ("buildBlogRss: err.message == " + err.message);
			callback (err);
			}
		else {
			var jsontext = getContent (jstruct);
			var blogData = JSON.parse (jsontext);
			var headElements = {
				title: blogData.title,
				link: "http://" + host + "/",
				description: blogData.description,
				language: blogData.language,
				generator: myProductName + " v" + myVersion,
				docs: "http://cyber.law.harvard.edu/rss/rss.html",
				maxFeedItems: blogData.maxFeedItems,
				appDomain: host,
				
				flRssCloudEnabled:  true,
				rssCloudDomain:  blogData.cloud.domain,
				rssCloudPort:  blogData.cloud.port,
				rssCloudPath: blogData.cloud.path,
				rssCloudRegisterProcedure:  "",
				rssCloudProtocol:  blogData.cloud.protocol
				}
			var flatPostList = getFlatPostList (blogData), rssHistory = new Array ();
			for (var i = 0; i < flatPostList.length; i++) {
				var item = flatPostList [i];
				if (item.urlHtml) {
					var obj = {
						title: item.title,
						text: item.description,
						when: item.created,
						link: item.urlHtml,
						guid: {
							flPermalink: true,
							value: item.urlHtml
							}
						};
					rssHistory.push (obj);
					}
				}
			var xmltext = rss.buildRssFeed (headElements, rssHistory);
			options.data = xmltext;
			saveToGitHub (options, function (err, jstruct) {
				if (!err) {
					var urlServer = "http://" + blogData.cloud.domain + ":" + blogData.cloud.port + blogData.cloud.path;
					rss.cloudPing (urlServer, jstruct.urlHtml);
					if (callback !== undefined) {
						callback (undefined, jstruct);
						}
					}
				});
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
function getContent (jstruct) {
	if (jstruct.encoding == "base64") {
		return (new Buffer (jstruct.content, "base64")); 
		}
	else {
		return (jstruct.content);
		}
	}
function handleHttpRequest (theRequest) {
	var params = theRequest.params, accessToken = params.accessToken, now = new Date ();
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
		function getHomePageText (host, callback) {
			getBlogData (host, function (err, blogData) {
				var htmltext = "", indentlevel = 0;
				function add (s) {
					htmltext +=  utils.filledString ("\t", indentlevel) + s + "\n";
					}
				if (err) {
					callback ("Can't build the home page because there was an error: " + err.message);
					}
				else {
					var flatPostList = getFlatPostList (blogData);
					add ("<ul class=\"ulHomePageItems\">"); indentlevel++;
					for (var i = 0; i < flatPostList.length; i++) {
						var item = flatPostList [i];
						if (item.urlHtml) {
							var whenstring = dateFormat (item.created, "dddd mmmm d, yyyy; h:MM TT Z");
							add ("<li>"); indentlevel++;
							add ("<div class=\"divItemTitle\"><a href=\"" + item.urlHtml + "\">" + item.title + "</a></div>");
							add ("<div class=\"divItemDescription\">" + item.description + "</div>");
							add ("<div class=\"divItemWhenPosted\">" + whenstring + "</div>");
							add ("</li>"); indentlevel--;
							}
						}
					add ("</ul>"); indentlevel--;
					callback (htmltext);
					}
				});
			}
		getUserObject (host, path, function (err, jstruct) {
			if (err) {
				notFound (err.message);
				}
			else {
				if (Array.isArray (jstruct)) { //it's a directory
					var flIndexFileServed = false;
					for (var i = 0; i < jstruct.length; i++) {
						var name = jstruct [i].name;
						if (utils.beginsWith (name, config.indexFileName)) {
							serveObject (host, path + name);
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
							var pagetable = deYamlIze (fileContent.toString ());
							function doRender (pagetable) {
								getBlogData (host, function (err, blogData) {
									if (!err) {
										pagetable.blogTitle = blogData.title;
										pagetable.blogDescription = blogData.description;
										pagetable.blogLanguage = blogData.language;
										}
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
									});
								}
							if (pagetable.description === undefined) {
								pagetable.description = "";
								}
							pagetable.gitHubPubVersion = myVersion;
							if (utils.getBoolean (pagetable.flHomePage)) {
								getHomePageText (host, function (hptext) {
									pagetable.bodytext = hptext;
									doRender (pagetable);
									});
								}
							else {
								pagetable.bodytext = marked (pagetable.text); //where deYamlIze stores the markdown text
								doRender (pagetable);
								}
							}
						switch (ext) {
							case "md":
								serveMarkdown ();
								break;
							default:
								theRequest.httpReturn (200, urlToMime (path), fileContent);
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
		if (path === undefined) { //10/19/18 by DW
			path = jstruct.commits [0].removed [0];
			}
		if (path !== undefined) { //something was modified, might be in the cache
			console.log ("ping from GitHub: owner == " + owner + ", repo == " + repo + ", path == " + path);
			cacheDelete (owner, repo, path);
			
			//check if parent needs to be removed from cache too -- 10/19/18 by DW
				cacheDeleteParent (owner, repo, jstruct.commits [0].removed [0]);
				cacheDeleteParent (owner, repo, jstruct.commits [0].added [0]);
			
			theRequest.httpReturn (200, "text/plain", "Thanks for the ping.");
			}
		stats.ctGitHubPings++;
		stats.whenLastGitHubPing = now;
		statsChanged ();
		}
	function handleEditorEvent (domain, path) {
		var dstruct = config.domains [domain.toLowerCase ()]
		if (dstruct !== undefined) {
			console.log ("\nping from editor: domain == " + domain + ", path == " + path);
			cacheDelete (dstruct.username, dstruct.repo, dstruct.path + path);
			theRequest.httpReturn (200, "text/plain", "Thanks for the ping.");
			}
		stats.ctEditorPings++;
		stats.whenLastEditorPing = now;
		statsChanged ();
		}
	function handleOauthCallback () {
		var params = {
			client_id: config.clientId,
			client_secret: config.clientSecret,
			code: theRequest.params.code
			};
		var apiUrl = "https://github.com/login/oauth/access_token?" + utils.buildParamList (params);
		var githubRequest = {
			method: "POST",
			url: apiUrl
			};
		request (githubRequest, function (err, response, body) {
			if (err) {
				console.log (err.message);
				theRequest.httpReturn (500, "text/plain", err.message);
				}
			else {
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
		case "/getcache": //10/19/18 by DW -- for debugging cache stuff
			var flatlist = new Array ();
			cacheDump (function (s) {
				flatlist.push (s);
				});
			returnData (flatlist);
			return;
		case "/getuserinfo":
			getUserInfo (accessToken, function (result) {
				returnData (result);
				});
			break;
		case "/get":
			var domain = theRequest.params.domain;
			var path = theRequest.params.path;
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
				domain: params.domain,
				path: params.path,
				accessToken: accessToken,
				data: params.text,
				type: "text/plain",
				committer: {
					name: params.name,
					email: params.email
					},
				message: params.msg,
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
			var options = {
				domain: theRequest.params.domain,
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
					returnStruct.domain = domain;
					returnData (returnStruct);
					}
				});
			break;
		case "/repoget": //instead of a domain, take a username/repository to identify the location -- 10/10/18 by DW
			getFromGitHub (params.username, params.repository, params.path, function (err, jstruct) {
				if (err) {
					returnError (err);
					}
				else {
					theRequest.httpReturn (200, urlToMime (params.path), getContent (jstruct));
					}
				});
			break;
		case "/reposave":
			var options = {
				username: theRequest.params.username,
				repository: theRequest.params.repo,
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
		case "/buildrss": 
			var options = {
				domain: params.domain,
				accessToken: accessToken,
				committer: {
					name: params.name,
					email: params.email
					},
				message: params.msg,
				userAgent: config.userAgent
				};
			buildBlogRss (options, function (err, data) {
				if (err) {
					returnError (err);
					}
				else {
					returnData (data);
					}
				});
			break;
		case "/getgithubdata":
			getUserObject (params.domain, params.path, function (err, jstruct) {
				if (err) {
					returnError (err);
					}
				else {
					returnData (jstruct);
					}
				});
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
		sysResponse: options.sysResponse,
		httpReturn: callback
		};
	handleHttpRequest (theRequest);
	}
function everyFiveSeconds () {
	timeoutCacheElements ();
	}
function everySecond () {
	if (flStatsDirty) {
		utils.sureFilePath (fnamestats, function () {
			fs.writeFile (fnamestats, utils.jsonStringify (stats), function (err) {
				});
			});
		flStatsDirty = false;
		}
	}
function init (userConfig, flHandleHttpHere) {
	console.log ("\n" + myProductName + " v" + myVersion + "\n");
	for (var x in userConfig) {
		config [x] = userConfig [x];
		}
	if (flHandleHttpHere === undefined) {
		flHandleHttpHere = true;
		}
	readStats ();
	if (flHandleHttpHere) {
		davehttp.start (config, function (theRequest) {
			handleHttpRequest (theRequest);
			});
		}
	setInterval (everySecond, 1000); 
	setInterval (everyFiveSeconds, 5000); 
	}
