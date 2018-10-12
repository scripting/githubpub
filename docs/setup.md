## Setting up a GitHubPub server

Assuming you're going to use English Editor as your editor for GitHub blog posts. 

### Things to decide before setting up

Your GitHubPub setup needs a couple of domain names:

1. The domain you will use to talk to the GHP server for authoring and administration. Suppose this is admin.myghp.com.

2. The domain you will use to access your website. Suppose this is blog.bullmancuso.com.

You will need to know these names for the next steps.

The URL of the editor you're using

If you're using the English editor, and you're welcome to, enter the URL of the editor here. This is where GitHub will redirect to after the user has finished logging in. 

### The GitHub side of the setup

Go to the <a href="https://github.com/settings/developers">Developer settings</a> page and click on the New OAuth App button. 

Choose anything for Application name, Homepage URL and Application description. 

For Homepage URL, enter, If you're using the English editor.

<code>http://scripting.com/english/testing/</code>

For Authorization callback URL, enter:

<code>http://admin.myghp.com/oauthcallback</code>

Copy <i>Client ID</i> and <i>Client Secret</i> from the settings page for the app. You'll need these in the config.json file for the Node app.

### Configuring your server

All configuration is through a config.json file in the same folder as the githubpub.js app.

Here's an <a href="https://gist.github.com/scripting/842eed0670f643a51dfa2e3972f220da">example</a> of a config.json file. It contains the items that every configuration should define for itself. 

1. port -- the port that the HTTP server runs on. The default is 1402

2. clientId and clientSecret -- the values from the GitHub setup.

3. domains -- an object containing sub-objects configuring each blog that's hosted by GHP. Each specifies a username, repository and path, where all the data for the blog is maintained. 

Any value in the config object in githubpub.js can be overridden in config.json. 



### WebHooks setup (optional)



