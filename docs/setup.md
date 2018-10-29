## Setting up a GitHubPub server

Assuming you're going to run a clone of the Minimal Editor on your own server.

### Things to decide before setting up

Your GitHubPub setup needs a couple of domain names:

1. The domain you and your co-editors will use to talk to the GHP server for authoring and administration. Suppose this is admin.myghp.com.

2. The domain the public will use to access your website. Suppose this is blog.bullmancuso.com.

You will need to know these names for the next steps.

The URL of the editor you're using.

### Configuring your server

All configuration is through a config.json file in the same folder as the githubpub.js app.

Here's an <a href="https://gist.github.com/scripting/842eed0670f643a51dfa2e3972f220da">example</a> of a config.json file. It contains the items that every configuration should define for itself. 

1. port -- the port that the HTTP server runs on. The default is 1402

2. clients -- each client has a name, id, secret and URL for the editor app. The id and secret come from the setup with GitHub in the next section. The name you choose here will be needed in the next section. In the example I used the name michigan.

3. domains -- an object containing sub-objects configuring each blog that's hosted by GHP. Each specifies a username, repository and path, where all the data for the blog is maintained. The domain here is the public domain you chose in the previous step.

Any value in the config object in githubpub.js can be overridden in config.json. 

### The GitHub side of the setup

Go to the <a href="https://github.com/settings/developers">Developer settings</a> page and click on the <i>New OAuth App</i> button. 

Choose anything for Application name, Homepage URL and Application description. 

For Authorization callback URL, enter:

<code>http://admin.myghp.com/oauthcallback?client=michigan</code>

Copy <i>Client ID</i> and <i>Client Secret</i> from the settings page for the app. You'll need these in the config.json file for the Node app, in the previous step.

### WebHooks setup (optional)

GHP is set up to respond to WebHook calls from GitHub that say that an object in a given repository has changed. When we receive such a message, we remove that object from our cache, if it was there, so the next time it's referenced, we reload it from the repository, instead of serving it from the cache. This is how you set it up.

1. Go to the <i>Settings</i> page for the repository you are using to host your a blog.

2. Click on <i>Webhooks</i> in the menu in the left margin of the page.

3. Click the <i>Add webhook</i> button. 

4. For Payload URL, enter http://admin.myghp.com/eventfromgithub -- where admin.myghp.com is the domain name of your GHP server. See above for an explanation.

5. For <i>Content type,</i> choose application/json.

6. Leave <i>Secret</i> empty.

7. Under events that trigger this webhook, select "Just the push event."

8. Check <i>Active</i> and then click <i>Add webhook.</i>

