# githubpub

A Node app that serves from GitHub repositories.

`npm install githubpub`

### Demo app

I'm running the app here: http://githubpub.scripting.com/.

It's set up to access this <a href="https://github.com/scripting/Scripting-News/tree/master/githubpub">directory</a> in the Scripting-News repository. 

It displays <a href="https://github.com/scripting/Scripting-News/blob/master/githubpub/index.md">index.md</a> when you access the top level of the site.

### Hello World app

~~~~

const githubpub = require ("githubpub");

var config = {
	port: 5376,
	domains: {
		"githubpub.scripting.com": {
			username: "scripting",
			repository: "Scripting-News",
			path: "githubpub"
			}
		}
	};

githubpub.init (config);


~~~~

### Why githubpub is cool

1. It can be configured to serve many sites from lots of locations on GitHub. Each location gets its own domain name. 

2. There's a template for markdown and plain text files. Makes it easy to change the appearance of these pages by editing a single file.

3. It's builds on the GitHub API, so if you've been looking for a foothold in extending GitHub, this is a good place to start. That's the primary reason I developed it.

4. It's got a cool name. Try saying it three times fast. :heart:

### Questions, problems?

Post an <a href="https://github.com/scripting/githubpub/issues">issue</a> here. 

