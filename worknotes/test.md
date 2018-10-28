<p><b>10/27/18; 10:32:32 AM by DW</b></p>
<blockquote>
    <p>add this notes file to the GHP repo</p>
    <p>write docs for config.json for GHP</p>
    <p>send the accesstoken along with every call so the user can be ratelimited by GH, not GHP or the client.</p>
    <p>done</p>
    <blockquote>
        <p>create a separate app on github for the minimal editor</p>
        <blockquote>
            <p>this also has to be configured on GHP server, it has to know the URL of the editor, so it can redirect properly based on which editor is involved. </p>
            </blockquote>
        <p>review interface out of githubpubApp, some routines aren't needed.</p>
        <blockquote>
            <p>some need to be added</p>
            <blockquote>
                <p>repoget and reposave</p>
                <blockquote>
                    <p>read and write from locations defined by username/repository/path</p>
                    <p>low-level routines, not part of blogging</p>
                    </blockquote>
                </blockquote>
            </blockquote>
        </blockquote>
    </blockquote>
<p><b>10/26/18; 9:55:44 AM by DW</b></p>
<blockquote>
    <p>&nbsp;</p>
    <p>wire up View Template command in main menu in englishhome</p>
    <blockquote>
        <p>&nbsp;</p>
        </blockquote>
    <p>&nbsp;</p>
    <p>big idea --</p>
    <blockquote>
        <p>use GHP to document XML-RPC</p>
        </blockquote>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>test insert html command in english editor</p>
    <p>"english" shouldn't be the name of the server</p>
    <p>look at includes in the editors</p>
    <p>add english editor to editors folder on ghp repo</p>
    <p>handle posts in JSON in addition to YAML</p>
    <p>&nbsp;</p>
    <p>done</p>
    <blockquote>
        <p>fill out settings</p>
        <blockquote>
            <p>blog title</p>
            <p>description</p>
            <p>lastPostTitle</p>
            <p>language</p>
            </blockquote>
        <p>need a way for user app to set blogData elements</p>
        <p>internal consts and app consts</p>
        <blockquote>
            <p>right now they're mixed in together</p>
            </blockquote>
        <p>urlHtml was a bad name -- replace with urlPublic</p>
        <p>englishHome delete major pieces of commented code</p>
        <blockquote>
            <p>the result of the factoring. </p>
            </blockquote>
        <p>test log off, log on</p>
        <blockquote>
            <p>both apps -- minimal and english</p>
            </blockquote>
        <p>change github config to point to new location of english editor</p>
        <blockquote>
            <p>&nbsp;</p>
            </blockquote>
        </blockquote>
    </blockquote>
<p><b>10/25/18; 10:25:29 AM by DW</b></p>
<blockquote>
    <p>next up -- pull out all the unused code from english editor</p>
    <blockquote>
        <p>saved something fun! :-)</p>
        </blockquote>
    <p>refactor the medium editor and include it</p>
    <blockquote>
        <p>good works</p>
        </blockquote>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>look at includes in the editors</p>
    <p>test log off, log on</p>
    <p>"english" shouldn't be the name of the server</p>
    <p>urlHtml was a bad name -- replace with urlPublic</p>
    <p>ghp cache elements expire after a certain period</p>
    <blockquote>
        <p>let's say 3 minutes by default</p>
        </blockquote>
    </blockquote>
<p><b>10/24/18; 9:59:08 AM by DW</b></p>
<blockquote>
    <p>Next up</p>
    <blockquote>
        <p>internal consts and app consts</p>
        <blockquote>
            <p>right now they're mixed in together</p>
            </blockquote>
        <p>save user prefs</p>
        <blockquote>
            <p>the code is in there, it might work but hasnt been tested</p>
            </blockquote>
        </blockquote>
    <p>Working on the api glue and Hello World for GHP</p>
    <blockquote>
        <p>review code, esp includes</p>
        <p>new post button</p>
        <p>file list</p>
        <p>icons linking to github and html rendering</p>
        </blockquote>
    </blockquote>
<p><b>10/21/18; 11:14:22 AM by DW</b></p>
<blockquote>
    <p>handle posts in JSON in addition to YAML</p>
    <p>second editor</p>
    <blockquote>
        <p>use same editor as GH uses</p>
        </blockquote>
    <p>document config</p>
    <blockquote>
        <p>add new elements to it?</p>
        <p>add elements in config to pagetable?</p>
        </blockquote>
    </blockquote>
<p><b>10/20/18; 12:00:59 PM by DW</b></p>
<blockquote>
    <p>changed icons on home page so the href attribute is set, so when you hover over the </p>
    <p>documented templates</p>
    <p>new command to view the template</p>
    </blockquote>
<p><b>10/16/18; 10:08:24 AM by DW</b></p>
<blockquote>
    <p>Back to work. This stuff is done..</p>
    <blockquote>
        <p>send committer params along with calls to buildrss</p>
        <p>Render blog home page</p>
        </blockquote>
    </blockquote>
<p><b>10/12/18; 10:15:53 AM by DW</b></p>
<blockquote>
    <p>send committer params along with calls to buildrss</p>
    <p>Render blog home page</p>
    <p>Insert HTML command in menu</p>
    <p>Move icons into menu</p>
    <p>Find good place for SAVED</p>
    <p>Docs</p>
    <blockquote>
        <p>Template </p>
        <p>setting up a server</p>
        <p>API</p>
        </blockquote>
    <p>urlEditorApp in config -- is this actually being used or is the one on github overriding it?</p>
    <p>server stuff</p>
    <blockquote>
        <p>empty out config in englishServer</p>
        <p>move most of the items into config in githubpub</p>
        <p>move some of them into config.json</p>
        <p>getting this error sometimes</p>
        <blockquote>
            <p>saveToGitHub: response == {</p>
            <blockquote>
                <p>"statusCode": 409,</p>
                <p>"body": "{\"message\":\"is at c9e17f82b72165f8f2ae57c6587e3eb0ad2fb934 but expected 113749995a25d6f45b77894c64d7008023234c91\",\"documentation_url\":\"https://developer.github.com/v3/repos/contents/#update-a-file\"}",</p>
                </blockquote>
            </blockquote>
        </blockquote>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    </blockquote>
<p><b>10/8/18; 2:03:14 PM by DW</b></p>
<blockquote>
    <p>Next up -- </p>
    <blockquote>
        <p>document the api for english server with sample code</p>
        <p>settings linked into the system menu</p>
        <p>clean up command keys in main menu</p>
        <blockquote>
            <p>they overwrite the command names</p>
            <p>this is a style sheets item</p>
            </blockquote>
        </blockquote>
    </blockquote>
<p><b>10/5/18; 10:47:57 AM by DW</b></p>
<blockquote>
    <p>we still have "blog/" in the setup for englishHome</p>
    <blockquote>
        <p>the factoring job started there is not done</p>
        <blockquote>
            <p>I understand why. When we punted on changing the way EH works to use domains instead of username/repo/path, it made it impossible to hide the relative path of the things it's editing. That was never configured on the server. domain.path is irrelevant, as it's currently implemented.</p>
            <p>&nbsp;</p>
            <p>interfaces that take domain in place of username/repo/path</p>
            <p>&nbsp;</p>
            <p>/get</p>
            <p>/save</p>
            <p>/getpost</p>
            <p>/savepost</p>
            </blockquote>
        </blockquote>
    <p>templates should be merged with githubpup repository</p>
    <blockquote>
        <p>right now they're only being saved to the english blog</p>
        </blockquote>
    <p>merge githubpub with english server</p>
    <blockquote>
        <p>mostly done</p>
        <p>I still want to make GHP work without english server</p>
        <blockquote>
            <p>It has to </p>
            <blockquote>
                <p>read config.json</p>
                <p>init davehttp</p>
                <p>replace it on rockaway</p>
                </blockquote>
            </blockquote>
        </blockquote>
    </blockquote>
<p><b>10/4/18; 10:50:14 AM by DW</b></p>
<blockquote>
    <p>paste-with-style into medium-editor</p>
    <blockquote>
        <p>okay we have the code in testPasteHTML () in englishHome. </p>
        <p>however we strip the html before saving</p>
        <p>so we need to address that somehow</p>
        <p>probably shouldn't be doing it</p>
        </blockquote>
    </blockquote>
<p><b>10/2/18; 10:27:52 AM by DW</b></p>
<blockquote>
    <p>RSS feed next up</p>
    <blockquote>
        <p>Then home page </p>
        <p>Day archive pages</p>
        </blockquote>
    <p>Think about comments</p>
    <blockquote>
        <p>I have an idea for this</p>
        <p>You have to have your own repo for it to work</p>
        </blockquote>
    <p>Okay good work session, next up...</p>
    <blockquote>
        <p>Use the same CSS file for both the editor and the rendering</p>
        <p>That pretty much guarantees WYSIWYG. ;-)</p>
        </blockquote>
    <p>big idea -- convert englishserver to use xml-rpc interface</p>
    <blockquote>
        <p>or add an xml-rpc interface and use it fron englishhome</p>
        </blockquote>
    <p>here's how the REST calls for GitHub server work now</p>
    <blockquote>
        <p>get/save -- work with absolute paths</p>
        <p>getblogdata/saveblogdata -- use the path</p>
        </blockquote>
    </blockquote>
<p><b>10/1/18; 10:56:40 AM by DW</b></p>
<blockquote>
    <p>nodeEditorSuite.gitHub.upload has a problem</p>
    <blockquote>
        <p>we call the save function on english server</p>
        <p>we changed what it returns. ooops, this code depends on the original functionality.</p>
        <p>I didn't see that coming ;-)</p>
        </blockquote>
    <p>UI work continues</p>
    <blockquote>
        <p>On a new post the Description placeholder is empty</p>
        <p>What about auto-save</p>
        <blockquote>
            <p>Clearly if present should be a preference</p>
            <p>Default on?</p>
            </blockquote>
        <p>CSS needs updating. H4 is wrong font/shape.</p>
        <p>The H2 and H4 items in the popup are broken.</p>
        <blockquote>
            <p>Probably has to do with the version of medium-editor we're using</p>
            </blockquote>
        <p>Change the look of the editor to be more like the pages</p>
        <blockquote>
            <p>I don't like the huge text. </p>
            </blockquote>
        <p>Done</p>
        <blockquote>
            <p>get rid of the file list on the left</p>
            <p>steal the look from myword.io</p>
            <p>add description element for the sub-text</p>
            </blockquote>
        </blockquote>
    <p>Upheaval --</p>
    <blockquote>
        <p>the paths we use should have the "blog/" prefix removed.</p>
        <blockquote>
            <p>there's no need for the editor to have this, because it's not part of the url</p>
            <p>it should be hidden by the server, it's part of the configuration, it should be easily changed.</p>
            </blockquote>
        <p>notes</p>
        <blockquote>
            <p>appConsts.blogDataPath and appConsts.blogPostsPath should change to </p>
            <blockquote>
                <p>posts/ and data.json</p>
                <p>the blog/ part should be added by the server</p>
                <p>&nbsp;</p>
                </blockquote>
            </blockquote>
        </blockquote>
    <p>Allow customization through the repository</p>
    <blockquote>
        <p>store code there??</p>
        </blockquote>
    </blockquote>
<p><b>9/30/18; 11:52:28 AM by DW</b></p>
<blockquote>
    <p>Let's work on UI</p>
    <blockquote>
        <p>Leave the server alone for a while. Whew. Too much rock and roll.</p>
        <p>Try getting the file list into a dialog, let's see what it looks like with more horizonal room.</p>
        </blockquote>
    <p>Cleanup</p>
    <blockquote>
        <p>Move englishblog1.scripting.com to point to rockaway.scripting.com. Tell pagepark to route it to english server (port 1402).</p>
        </blockquote>
    </blockquote>
<p><b>9/29/18; 9:39:58 AM by DW</b></p>
<blockquote>
    <p>More factoring</p>
    <blockquote>
        <p>move github api urls to config struct</p>
        <p>deYamlize can be factored</p>
        <p>extracting the content can also be factored</p>
        </blockquote>
    </blockquote>
<p><b>9/28/18; 2:38:20 PM by DW</b></p>
<blockquote>
    <p>More factoring</p>
    <blockquote>
        <p>There are two routines to get the contents of a file from GitHub, one in githubpub and the other in englishserver</p>
        <blockquote>
            <p>use the one in githubpub</p>
            <p>small difference in how it's called</p>
            </blockquote>
        </blockquote>
    <p>Things to look at next after integration of english server and githubpub</p>
    <blockquote>
        <p>there are two caches, only need one</p>
        <p>there seems to be an error handling webhook notifications from github</p>
        <blockquote>
            <p>handleRequest: tryError.message == Unexpected token u in JSON at position 0</p>
            </blockquote>
        </blockquote>
    </blockquote>
<p><b>9/24/18; 3:45:22 PM by DW</b></p>
<blockquote>
    <p>todo</p>
    <blockquote>
        <p>eye icon takes you to the rendering</p>
        <blockquote>
            <p>the englishHome server has to know the URL of the site its saving to?</p>
            <p>or the githubpub functionality has to be integrated into englishHome?</p>
            <p>thinking needed...</p>
            </blockquote>
        <p>good fallback when there is no template in the repository.</p>
        <p>provisioning new site</p>
        <blockquote>
            <p>favicon.ico</p>
            <p>template</p>
            <blockquote>
                <p>temlate.txt</p>
                <p>code.js</p>
                <p>styles.css</p>
                </blockquote>
            </blockquote>
        </blockquote>
    </blockquote>
<p><b>9/23/18; 11:32:35 AM by DW</b></p>
<blockquote>
    <p>githubpub</p>
    <blockquote>
        <p>get template from the repo</p>
        <p>deploy on server</p>
        <p>cache + webook support</p>
        </blockquote>
    </blockquote>
<p><b>9/21/18; 10:38:47 AM by DW</b></p>
<blockquote>
    <p>next up</p>
    <blockquote>
        <p>finish the title editor</p>
        <p>store posts in markdown, with atts encoded</p>
        <blockquote>
            <p>do it at the lowest level in the editor, so we can still use the json structure internally</p>
            </blockquote>
        <p>server app</p>
        <p>staging new posts, should be quicker</p>
        <p>error reporting, esp rate limit erros</p>
        </blockquote>
    </blockquote>
<p><b>9/18/18; 10:59:25 AM by DW</b></p>
<blockquote>
    <p>next up --</p>
    <blockquote>
        <p>show titles in the tree, not text</p>
        <p>open the file in the editor if you click on it in the tree</p>
        </blockquote>
    <p>when create new post or at login, activate the text editor</p>
    <p>new instance of githubpub locally </p>
    <blockquote>
        <p>renders the blog repo in html</p>
        </blockquote>
    <p>store the posts in json</p>
    <blockquote>
        <p>the text is just one of the elements</p>
        <p>still keep a top-level list of posts in the blogdata struct</p>
        </blockquote>
    <p>merge appPrefs and blogdata</p>
    </blockquote>
<p><b>9/17/18; 12:46:06 PM by DW</b></p>
<blockquote>
    <p>Next things to do --</p>
    <blockquote>
        <p>get githubpub running locally</p>
        <blockquote>
            <p>next up -- pngs aren't being served correctly</p>
            </blockquote>
        <p>look at how GitHub handles websites</p>
        <p>add metadata at the head of the file using one of the formats others are using (see SN thread).</p>
        <p>allow for opening existing posts</p>
        <p>autosave</p>
        <p>eye icon implemented</p>
        </blockquote>
    </blockquote>
