//this test app is set up to be run locally. 
//you can access my test site through http://localhost:1402/

const gitpub = require ("./githubpub.js");

var config = {
	port: 1402,
	domains: {
		"localhost": {
			username: "scripting",
			repository: "Scripting-News",
			path: "githubpub"
			}
		}
	};

gitpub.init (config);
