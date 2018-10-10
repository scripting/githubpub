## githubpub's API

It's a simple REST API that allows you to access a blog repostory at two levels. 

1. Just data. 

2. Markdown files with YAML-encoded metadata, returned as a JSON struct. 

### domains

The server is configured around the concept of a domain. 

A domain is named by a DNS-compliant domain name like myblog.bullmancuso.com.

It has three properties:

1. username

2. repository

3. path

When a request comes into the GHP server for a given domain, it looks for the indicated repository in the user's account, and serves starting at the indicated path. So the website can be part of a repository, not the whole thing. 

And a single GHP server can serve multiple websites. 

There is also a way to get around the domain and access an item directly, using username, repository and path.

### englishblog1.scripting.com

In all the examples I'll use this domain. The three properties:

1. scripting

2. myEnglishBlog

3. blog/

<a href="https://github.com/scripting/myEnglishBlog/tree/master/blog">Here's</a> the actual location. 

### get

Here's an example:

<code>http://english.scripting.com/getpost?domain=englishblog1.scripting.com&path=data.json</code>



