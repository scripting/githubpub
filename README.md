# githubpub

A Node app that serves from GitHub repositories.

`npm install githubpub`

### Hello World app

Here's the <a href="https://gist.github.com/scripting/75e27f5227be29afe6f76cd55961d95d">Hello World</a> app.

I'm running the app here: http://githubpub.scripting.com/.

It's set up to access this <a href="https://github.com/scripting/Scripting-News/tree/master/githubpub">directory</a> in the Scripting-News repository. 

It displays <a href="https://raw.githubusercontent.com/scripting/Scripting-News/master/githubpub/index.md">index.md</a> when you access the top level of the site.

Here's <a href="https://www.npmjs.com/package/githubpub">githubpub</a> on NPM.

### Why githubpub is cool

1. It can be configured to serve many sites from lots of locations on GitHub. Each location gets its own domain name. 

2. There's a template for markdown and plain text files. Makes it easy to change the appearance of these pages by editing a single file.

3. It builds on the <a href="https://developer.github.com/v3/repos/">GitHub API</a>, so if you've been looking for a foothold in extending GitHub, this is a good place to start. That's the primary reason I developed it.

4. It has a cool name. Try saying it three times fast. :heart:

### Updates

#### v0.5.63 -- 10/11/21 by DW

In  package.json  we now require dateformat 4.5.1 because they updated the package to not work with older versions of Node. 

### Questions, problems?

Post an <a href="https://github.com/scripting/githubpub/issues">issue</a> here. 

