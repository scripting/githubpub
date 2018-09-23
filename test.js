//this test app is set up to be run locally. 
//you can access my test site through http://localhost:1402/

const gitpub = require ("./githubpub.js");
const fs = require ("fs");

var config = {
	};
fs.readFile ("config.json", function (err, jsontext) {
	if (!err) {
		var jstruct = JSON.parse (jsontext);
		for (var x in jstruct) {
			config [x] = jstruct [x];
			}
		}
	gitpub.init (config);
	});
