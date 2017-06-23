# githubpub

A Node app that serves from GitHub repositories.

`npm install githubpub`

## Hello World app

~~~~

const githubpub = require ("githubpub");

const utils = require ("daveutils");



var config = {

port: 5376,

domains: {

"githubpub.scripting.com": {

username: "scripting",

repository: "Scripting-News",

path: "gitpub"

}

}

};



githubpub.init (config);

~~~~

