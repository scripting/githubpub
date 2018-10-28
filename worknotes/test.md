<li>10/27/18; 10:32:32 AM by DW</li>
<ul>
    <li><b>add this notes file to the GHP repo</b></li>
    <li><b>write docs for config.json for GHP</b></li>
    <li><b>send the accesstoken along with every call so the user can be ratelimited by GH, not GHP or the client.</b></li>
    <li><b>done</b></li>
    <ul>
        <li>create a separate app on github for the minimal editor</li>
        <ul>
            <li>this also has to be configured on GHP server, it has to know the URL of the editor, so it can redirect properly based on which editor is involved. </li>
            </ul>
        <li>review interface out of githubpubApp, some routines aren't needed.</li>
        <ul>
            <li>some need to be added</li>
            <ul>
                <li>repoget and reposave</li>
                <ul>
                    <li>read and write from locations defined by username/repository/path</li>
                    <li>low-level routines, not part of blogging</li>
                    </ul>
                </ul>
            </ul>
        </ul>
    </ul>
<li>10/26/18; 9:55:44 AM by DW</li>
<ul>
    <li><b>&nbsp;</b></li>
    <li><b>wire up View Template command in main menu in englishhome</b></li>
    <ul>
        <li>&nbsp;</li>
        </ul>
    <li><b>&nbsp;</b></li>
    <li><b>big idea --</b></li>
    <ul>
        <li>use GHP to document XML-RPC</li>
        </ul>
    <li><b>&nbsp;</b></li>
    <li><b>&nbsp;</b></li>
    <li><b>&nbsp;</b></li>
    <li><b>test insert html command in english editor</b></li>
    <li><b>"english" shouldn't be the name of the server</b></li>
    <li><b>look at includes in the editors</b></li>
    <li><b>add english editor to editors folder on ghp repo</b></li>
    <li><b>handle posts in JSON in addition to YAML</b></li>
    <li><b>&nbsp;</b></li>
    <li><b>done</b></li>
    <ul>
        <li>fill out settings</li>
        <ul>
            <li>blog title</li>
            <li>description</li>
            <li>lastPostTitle</li>
            <li>language</li>
            </ul>
        <li>need a way for user app to set blogData elements</li>
        <li>internal consts and app consts</li>
        <ul>
            <li>right now they're mixed in together</li>
            </ul>
        <li>urlHtml was a bad name -- replace with urlPublic</li>
        <li>englishHome delete major pieces of commented code</li>
        <ul>
            <li>the result of the factoring. </li>
            </ul>
        <li>test log off, log on</li>
        <ul>
            <li>both apps -- minimal and english</li>
            </ul>
        <li>change github config to point to new location of english editor</li>
        <ul>
            <li>&nbsp;</li>
            </ul>
        </ul>
    </ul>
<li>10/25/18; 10:25:29 AM by DW</li>
<ul>
    <li><b>next up -- pull out all the unused code from english editor</b></li>
    <ul>
        <li>saved something fun! :-)</li>
        </ul>
    <li><b>refactor the medium editor and include it</b></li>
    <ul>
        <li>good works</li>
        </ul>
    <li><b>&nbsp;</b></li>
    <li><b>&nbsp;</b></li>
    <li><b>&nbsp;</b></li>
    <li><b>&nbsp;</b></li>
    <li><b>look at includes in the editors</b></li>
    <li><b>test log off, log on</b></li>
    <li><b>"english" shouldn't be the name of the server</b></li>
    <li><b>urlHtml was a bad name -- replace with urlPublic</b></li>
    <li><b>ghp cache elements expire after a certain period</b></li>
    <ul>
        <li>let's say 3 minutes by default</li>
        </ul>
    </ul>
<li>10/24/18; 9:59:08 AM by DW</li>
<ul>
    <li><b>Next up</b></li>
    <ul>
        <li>internal consts and app consts</li>
        <ul>
            <li>right now they're mixed in together</li>
            </ul>
        <li>save user prefs</li>
        <ul>
            <li>the code is in there, it might work but hasnt been tested</li>
            </ul>
        </ul>
    <li><b>Working on the api glue and Hello World for GHP</b></li>
    <ul>
        <li>review code, esp includes</li>
        <li>new post button</li>
        <li>file list</li>
        <li>icons linking to github and html rendering</li>
        </ul>
    </ul>
<li>10/21/18; 11:14:22 AM by DW</li>
<ul>
    <li><b>handle posts in JSON in addition to YAML</b></li>
    <li><b>second editor</b></li>
    <ul>
        <li>use same editor as GH uses</li>
        </ul>
    <li><b>document config</b></li>
    <ul>
        <li>add new elements to it?</li>
        <li>add elements in config to pagetable?</li>
        </ul>
    </ul>
<li>10/20/18; 12:00:59 PM by DW</li>
<ul>
    <li><b>changed icons on home page so the href attribute is set, so when you hover over the </b></li>
    <li><b>documented templates</b></li>
    <li><b>new command to view the template</b></li>
    </ul>
<li>10/16/18; 10:08:24 AM by DW</li>
<ul>
    <li><b>Back to work. This stuff is done..</b></li>
    <ul>
        <li>send committer params along with calls to buildrss</li>
        <li>Render blog home page</li>
        </ul>
    </ul>
<li>10/12/18; 10:15:53 AM by DW</li>
<ul>
    <li><b>send committer params along with calls to buildrss</b></li>
    <li><b>Render blog home page</b></li>
    <li><b>Insert HTML command in menu</b></li>
    <li><b>Move icons into menu</b></li>
    <li><b>Find good place for SAVED</b></li>
    <li><b>Docs</b></li>
    <ul>
        <li>Template </li>
        <li>setting up a server</li>
        <li>API</li>
        </ul>
    <li><b>urlEditorApp in config -- is this actually being used or is the one on github overriding it?</b></li>
    <li><b>server stuff</b></li>
    <ul>
        <li>empty out config in englishServer</li>
        <li>move most of the items into config in githubpub</li>
        <li>move some of them into config.json</li>
        <li>getting this error sometimes</li>
        <ul>
            <li>saveToGitHub: response == {</li>
            <ul>
                <li>"statusCode": 409,</li>
                <li>"body": "{\"message\":\"is at c9e17f82b72165f8f2ae57c6587e3eb0ad2fb934 but expected 113749995a25d6f45b77894c64d7008023234c91\",\"documentation_url\":\"https://developer.github.com/v3/repos/contents/#update-a-file\"}",</li>
                </ul>
            </ul>
        </ul>
    <li><b>&nbsp;</b></li>
    <li><b>&nbsp;</b></li>
    </ul>
<li>10/8/18; 2:03:14 PM by DW</li>
<ul>
    <li><b>Next up -- </b></li>
    <ul>
        <li>document the api for english server with sample code</li>
        <li>settings linked into the system menu</li>
        <li>clean up command keys in main menu</li>
        <ul>
            <li>they overwrite the command names</li>
            <li>this is a style sheets item</li>
            </ul>
        </ul>
    </ul>
<li>10/5/18; 10:47:57 AM by DW</li>
<ul>
    <li><b>we still have "blog/" in the setup for englishHome</b></li>
    <ul>
        <li>the factoring job started there is not done</li>
        <ul>
            <li>I understand why. When we punted on changing the way EH works to use domains instead of username/repo/path, it made it impossible to hide the relative path of the things it's editing. That was never configured on the server. domain.path is irrelevant, as it's currently implemented.</li>
            <li>&nbsp;</li>
            <li>interfaces that take domain in place of username/repo/path</li>
            <li>&nbsp;</li>
            <li>/get</li>
            <li>/save</li>
            <li>/getpost</li>
            <li>/savepost</li>
            </ul>
        </ul>
    <li><b>templates should be merged with githubpup repository</b></li>
    <ul>
        <li>right now they're only being saved to the english blog</li>
        </ul>
    <li><b>merge githubpub with english server</b></li>
    <ul>
        <li>mostly done</li>
        <li>I still want to make GHP work without english server</li>
        <ul>
            <li>It has to </li>
            <ul>
                <li>read config.json</li>
                <li>init davehttp</li>
                <li>replace it on rockaway</li>
                </ul>
            </ul>
        </ul>
    </ul>
<li>10/4/18; 10:50:14 AM by DW</li>
<ul>
    <li><b>paste-with-style into medium-editor</b></li>
    <ul>
        <li>okay we have the code in testPasteHTML () in englishHome. </li>
        <li>however we strip the html before saving</li>
        <li>so we need to address that somehow</li>
        <li>probably shouldn't be doing it</li>
        </ul>
    </ul>
<li>10/2/18; 10:27:52 AM by DW</li>
<ul>
    <li><b>RSS feed next up</b></li>
    <ul>
        <li>Then home page </li>
        <li>Day archive pages</li>
        </ul>
    <li><b>Think about comments</b></li>
    <ul>
        <li>I have an idea for this</li>
        <li>You have to have your own repo for it to work</li>
        </ul>
    <li><b>Okay good work session, next up...</b></li>
    <ul>
        <li>Use the same CSS file for both the editor and the rendering</li>
        <li>That pretty much guarantees WYSIWYG. ;-)</li>
        </ul>
    <li><b>big idea -- convert englishserver to use xml-rpc interface</b></li>
    <ul>
        <li>or add an xml-rpc interface and use it fron englishhome</li>
        </ul>
    <li><b>here's how the REST calls for GitHub server work now</b></li>
    <ul>
        <li>get/save -- work with absolute paths</li>
        <li>getblogdata/saveblogdata -- use the path</li>
        </ul>
    </ul>
<li>10/1/18; 10:56:40 AM by DW</li>
<ul>
    <li><b>nodeEditorSuite.gitHub.upload has a problem</b></li>
    <ul>
        <li>we call the save function on english server</li>
        <li>we changed what it returns. ooops, this code depends on the original functionality.</li>
        <li>I didn't see that coming ;-)</li>
        </ul>
    <li><b>UI work continues</b></li>
    <ul>
        <li>On a new post the Description placeholder is empty</li>
        <li>What about auto-save</li>
        <ul>
            <li>Clearly if present should be a preference</li>
            <li>Default on?</li>
            </ul>
        <li>CSS needs updating. H4 is wrong font/shape.</li>
        <li>The H2 and H4 items in the popup are broken.</li>
        <ul>
            <li>Probably has to do with the version of medium-editor we're using</li>
            </ul>
        <li>Change the look of the editor to be more like the pages</li>
        <ul>
            <li>I don't like the huge text. </li>
            </ul>
        <li>Done</li>
        <ul>
            <li>get rid of the file list on the left</li>
            <li>steal the look from myword.io</li>
            <li>add description element for the sub-text</li>
            </ul>
        </ul>
    <li><b>Upheaval --</b></li>
    <ul>
        <li>the paths we use should have the "blog/" prefix removed.</li>
        <ul>
            <li>there's no need for the editor to have this, because it's not part of the url</li>
            <li>it should be hidden by the server, it's part of the configuration, it should be easily changed.</li>
            </ul>
        <li>notes</li>
        <ul>
            <li>appConsts.blogDataPath and appConsts.blogPostsPath should change to </li>
            <ul>
                <li>posts/ and data.json</li>
                <li>the blog/ part should be added by the server</li>
                <li>&nbsp;</li>
                </ul>
            </ul>
        </ul>
    <li><b>Allow customization through the repository</b></li>
    <ul>
        <li>store code there??</li>
        </ul>
    </ul>
<li>9/30/18; 11:52:28 AM by DW</li>
<ul>
    <li><b>Let's work on UI</b></li>
    <ul>
        <li>Leave the server alone for a while. Whew. Too much rock and roll.</li>
        <li>Try getting the file list into a dialog, let's see what it looks like with more horizonal room.</li>
        </ul>
    <li><b>Cleanup</b></li>
    <ul>
        <li>Move englishblog1.scripting.com to point to rockaway.scripting.com. Tell pagepark to route it to english server (port 1402).</li>
        </ul>
    </ul>
<li>9/29/18; 9:39:58 AM by DW</li>
<ul>
    <li><b>More factoring</b></li>
    <ul>
        <li>move github api urls to config struct</li>
        <li>deYamlize can be factored</li>
        <li>extracting the content can also be factored</li>
        </ul>
    </ul>
<li>9/28/18; 2:38:20 PM by DW</li>
<ul>
    <li><b>More factoring</b></li>
    <ul>
        <li>There are two routines to get the contents of a file from GitHub, one in githubpub and the other in englishserver</li>
        <ul>
            <li>use the one in githubpub</li>
            <li>small difference in how it's called</li>
            </ul>
        </ul>
    <li><b>Things to look at next after integration of english server and githubpub</b></li>
    <ul>
        <li>there are two caches, only need one</li>
        <li>there seems to be an error handling webhook notifications from github</li>
        <ul>
            <li>handleRequest: tryError.message == Unexpected token u in JSON at position 0</li>
            </ul>
        </ul>
    </ul>
<li>9/24/18; 3:45:22 PM by DW</li>
<ul>
    <li><b>todo</b></li>
    <ul>
        <li>eye icon takes you to the rendering</li>
        <ul>
            <li>the englishHome server has to know the URL of the site its saving to?</li>
            <li>or the githubpub functionality has to be integrated into englishHome?</li>
            <li>thinking needed...</li>
            </ul>
        <li>good fallback when there is no template in the repository.</li>
        <li>provisioning new site</li>
        <ul>
            <li>favicon.ico</li>
            <li>template</li>
            <ul>
                <li>temlate.txt</li>
                <li>code.js</li>
                <li>styles.css</li>
                </ul>
            </ul>
        </ul>
    </ul>
<li>9/23/18; 11:32:35 AM by DW</li>
<ul>
    <li><b>githubpub</b></li>
    <ul>
        <li>get template from the repo</li>
        <li>deploy on server</li>
        <li>cache + webook support</li>
        </ul>
    </ul>
<li>9/21/18; 10:38:47 AM by DW</li>
<ul>
    <li><b>next up</b></li>
    <ul>
        <li>finish the title editor</li>
        <li>store posts in markdown, with atts encoded</li>
        <ul>
            <li>do it at the lowest level in the editor, so we can still use the json structure internally</li>
            </ul>
        <li>server app</li>
        <li>staging new posts, should be quicker</li>
        <li>error reporting, esp rate limit erros</li>
        </ul>
    </ul>
<li>9/18/18; 10:59:25 AM by DW</li>
<ul>
    <li><b>next up --</b></li>
    <ul>
        <li>show titles in the tree, not text</li>
        <li>open the file in the editor if you click on it in the tree</li>
        </ul>
    <li><b>when create new post or at login, activate the text editor</b></li>
    <li><b>new instance of githubpub locally </b></li>
    <ul>
        <li>renders the blog repo in html</li>
        </ul>
    <li><b>store the posts in json</b></li>
    <ul>
        <li>the text is just one of the elements</li>
        <li>still keep a top-level list of posts in the blogdata struct</li>
        </ul>
    <li><b>merge appPrefs and blogdata</b></li>
    </ul>
<li>9/17/18; 12:46:06 PM by DW</li>
<ul>
    <li><b>Next things to do --</b></li>
    <ul>
        <li>get githubpub running locally</li>
        <ul>
            <li>next up -- pngs aren't being served correctly</li>
            </ul>
        <li>look at how GitHub handles websites</li>
        <li>add metadata at the head of the file using one of the formats others are using (see SN thread).</li>
        <li>allow for opening existing posts</li>
        <li>autosave</li>
        <li>eye icon implemented</li>
        </ul>
    </ul>
