const gitpub = require ("./githubpub.js");
const utils = require ("daveutils");

var config = {
	port: 1402,
	domains: {
		"localhost": {
			username: "scripting",
			repository: "Scripting-News",
			path: "gitpub"
			}
		}
	};

gitpub.init (config);
