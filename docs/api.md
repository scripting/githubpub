## The API

It's a simple REST API that allows you to access a blog repostory at two levels. You can access any item in the repo, read and write; or blog posts. 

The difference is that blog posts have a common structure, are returned 

### domains

The server is configured around the concept of a domain. 

A domain is named by a DNS-compliant domain name like myblog.bullmancuso.com.

It has three properties:

1. username

2. repository

3. path

When a request comes into the GHP server for a given domain, it looks for the indicated repository in the user's account, and serves starting at the indicated path. So the website can be part of a repository, not the whole thing. 

And a single GHP server can serve multiple websites. 

### englishblog1.scripting.com

In all the examples I'll use this domain. The three properties for the domain are:

1. scripting

2. myEnglishBlog

3. blog/

<a href="https://github.com/scripting/myEnglishBlog/tree/master/blog">Here's</a> the actual location. 

### get

Here's an example:

<code></code>



