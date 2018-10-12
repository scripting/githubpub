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

Returns the data in the object without interpretation.

<code>http://english.scripting.com/get?domain=englishblog1.scripting.com&path=/posts/2018/10/10/132303.md</code>

### getpost

Converts from YAML to JSON.

<code>http://english.scripting.com/getpost?domain=englishblog1.scripting.com&path=/posts/2018/10/10/132303.md</code>

### repoget

Get the object without using the domain.

<code>http://english.scripting.com/repoget?username=scripting&repository=myEnglishBlog&path=/blog/posts/2018/10/10/132303.md</code>

### accessToken

The <i>get</i> calls are unauthenticated, but every <i>save</i> call must have an <i>accessToken</i> parameter, which is obtained via an OAuth login. The login "dance" is handled by githubpub.js. This is how it works. 

1. The editor redirects to https://github.com/login/oauth/authorize with parameters client_id, scope and redirect_url. 

2. If the user authorizes the app, it calls back to the URL specified in the configuration on GitHub with a <i>code</i> param. GHP implements this.

3. GHP calls GitHub with the clientId, clientSecret and the code from the previous step, to request an access token. 

4. It returns with the token to GHP. 

5. It redirects to the editor with an access_token param. The editor should save that in localStorage and send that to GHP along with every operation that saves dat or blog posts. 

I documented this clearly so it would be easy to replace the editor I provide with others.

