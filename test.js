//this test app is set up to be run locally. 
//you can access my test site through http://localhost:1402/

const gitpub = require ("./src/githubpub.js");
const fs = require ("fs");
const davehttp = require ("davehttp"); 

var config = {
	flPostEnabled: true,
	flAllowAccessFromAnywhere: true,
	flLogToConsole: true
	};
fs.readFile ("config.json", function (err, jsontext) {
	if (!err) {
		var jstruct = JSON.parse (jsontext);
		for (var x in jstruct) {
			config [x] = jstruct [x];
			}
		}
	gitpub.init (config, false);
	davehttp.start (config, function (theRequest) {
		gitpub.handleRequest (theRequest, theRequest.httpReturn);
		});
	});
