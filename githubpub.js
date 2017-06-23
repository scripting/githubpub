const myProductName = "githubpub", myVersion = "0.4.9"; 

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

const utils = require ("daveutils");
const davehttp = require ("davehttp"); 
const request = require ("request"); 
const marked = require ("marked");
var mime = require ("mime"); 

var config = {
	port: 80,
	apiUrl: "https://api.github.com/repos/",
	urlMarkdownTemplate: "http://fargo.io/code/shared/githubpub/template/template.txt", 
	flLogToConsole: true,
	indexFileName: "index"
	};

function httpRequest (url, callback) {
	var options = {
		url: url,
		jar: true,
		maxRedirects: 5,
		headers: {
			"User-Agent": myProductName + " v" + myVersion
			}
		};
	request (options, callback);
	}
function getTemplate (callback) {
	httpRequest (config.urlMarkdownTemplate, function (err, response, templatetext) { 
		if (err || (response.statusCode !== 200)) {
			console.log ("Error getting the template.");
			callback (undefined);
			}
		else {
			callback (templatetext);
			}
		});
	}
function getFileExtension (url) {
	return (utils.stringLastField (url, ".").toLowerCase ());
	}
function fileExtensionToMime (ext) {
	mime.default_type = "text/plain";
	return (mime.lookup (ext));
	}
function init (userConfig) {
	console.log ("\n" + myProductName + " v" + myVersion + "\n");
	for (var x in userConfig) {
		config [x] = userConfig [x];
		}
	davehttp.start (config, function (theRequest) {
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
						theRequest.httpReturn (500, "text/plain", err.message);
						}
					else {
						callback (fileContent);
						}
					});
				}
			}
		function serveObject (path) {
			var domain = config.domains [theRequest.lowerhost], url;
			if (domain === undefined) {
				notFound ("The domain \"" + theRequest.lowerhost + "\" is not defined.");
				}
			url = config.apiUrl + domain.username + "/" + domain.repository + "/contents/" + domain.path + path;
			httpRequest (url, function (err, response, jsontext) {
				if (err || (response.statusCode !== 200)) {
					notFound ("There was an error reading the file, or we got a bad response code.");
					}
				else {
					var jstruct = JSON.parse (jsontext);
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
							notFound ("Couldn't serve the page because there was no \"index\" file in the directory.");
							}
						}
					else {
						getFileContent (jstruct, function (fileContent) {
							getTemplate (function (templatetext) { 
								var ext = getFileExtension (jstruct.download_url);
								function renderThroughTemplate (pagetitle) {
									if (pagetitle === undefined) {
										pagetitle = utils.stringLastField (jstruct.download_url, "/");
										}
									var pagetable = {
										bodytext: fileContent.toString (),
										title: pagetitle,
										pageproperties: utils.jsonStringify (jstruct)
										};
									var htmltext = utils.multipleReplaceAll (templatetext, pagetable, false, "[%", "%]");
									theRequest.httpReturn (200, "text/html", htmltext);
									}
								function serveMarkdown () {
									var s = fileContent.toString (), pagetitle = undefined;
									if (s [0] == "#") {
										var firstline = utils.stringNthField (s, "\n", 1);
										pagetitle = utils.trimWhitespace (utils.trimLeading (firstline, "#"));
										}
									fileContent = marked (fileContent.toString ());
									theRequest.httpReturn (200, "text/html", renderThroughTemplate (pagetitle));
									}
								switch (ext) {
									case "md":
										serveMarkdown ();
										break;
									case "txt":
										theRequest.httpReturn (200, "text/html", renderThroughTemplate ());
										break;
									default:
										theRequest.httpReturn (200, fileExtensionToMime (ext), fileContent);
										break;
									}
								});
							});
						}
					}
				});
			}
		serveObject (theRequest.path);
		});
	}
