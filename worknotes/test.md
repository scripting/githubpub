<li ><b>10/27/18; 10:32:32 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li>add this notes file to the GHP repo</li>
    <li>write docs for config.json for GHP</li>
    <li>send the accesstoken along with every call so the user can be ratelimited by GH, not GHP or the client.</li>
    <li >done</li>
    <ul style=" list-style-type: none;    " >
        <li >create a separate app on github for the minimal editor</li>
        <ul style=" list-style-type: none;    " >
            <li>this also has to be configured on GHP server, it has to know the URL of the editor, so it can redirect properly based on which editor is involved. </li>
            </ul>
        <li >review interface out of githubpubApp, some routines aren't needed.</li>
        <ul style=" list-style-type: none;    " >
            <li >some need to be added</li>
            <ul style=" list-style-type: none;    " >
                <li >repoget and reposave</li>
                <ul style=" list-style-type: none;    " >
                    <li>read and write from locations defined by username/repository/path</li>
                    <li>low-level routines, not part of blogging</li>
                    </ul>
                </ul>
            </ul>
        </ul>
    </ul>
<li ><b>10/26/18; 9:55:44 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li>&nbsp;</li>
    <li >wire up View Template command in main menu in englishhome</li>
    <ul style=" list-style-type: none;    " >
        <li>&nbsp;</li>
        </ul>
    <li>&nbsp;</li>
    <li >big idea --</li>
    <ul style=" list-style-type: none;    " >
        <li>use GHP to document XML-RPC</li>
        </ul>
    <li>&nbsp;</li>
    <li>&nbsp;</li>
    <li>&nbsp;</li>
    <li>test insert html command in english editor</li>
    <li>"english" shouldn't be the name of the server</li>
    <li>look at includes in the editors</li>
    <li>add english editor to editors folder on ghp repo</li>
    <li>handle posts in JSON in addition to YAML</li>
    <li>&nbsp;</li>
    <li >done</li>
    <ul style=" list-style-type: none;    " >
        <li >fill out settings</li>
        <ul style=" list-style-type: none;    " >
            <li>blog title</li>
            <li>description</li>
            <li>lastPostTitle</li>
            <li>language</li>
            </ul>
        <li>need a way for user app to set blogData elements</li>
        <li >internal consts and app consts</li>
        <ul style=" list-style-type: none;    " >
            <li>right now they're mixed in together</li>
            </ul>
        <li>urlHtml was a bad name -- replace with urlPublic</li>
        <li >englishHome delete major pieces of commented code</li>
        <ul style=" list-style-type: none;    " >
            <li>the result of the factoring. </li>
            </ul>
        <li >test log off, log on</li>
        <ul style=" list-style-type: none;    " >
            <li>both apps -- minimal and english</li>
            </ul>
        <li >change github config to point to new location of english editor</li>
        <ul style=" list-style-type: none;    " >
            <li>&nbsp;</li>
            </ul>
        </ul>
    </ul>
<li ><b>10/25/18; 10:25:29 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >next up -- pull out all the unused code from english editor</li>
    <ul style=" list-style-type: none;    " >
        <li>saved something fun! :-)</li>
        </ul>
    <li >refactor the medium editor and include it</li>
    <ul style=" list-style-type: none;    " >
        <li>good works</li>
        </ul>
    <li>&nbsp;</li>
    <li>&nbsp;</li>
    <li>&nbsp;</li>
    <li>&nbsp;</li>
    <li>look at includes in the editors</li>
    <li>test log off, log on</li>
    <li>"english" shouldn't be the name of the server</li>
    <li>urlHtml was a bad name -- replace with urlPublic</li>
    <li >ghp cache elements expire after a certain period</li>
    <ul style=" list-style-type: none;    " >
        <li>let's say 3 minutes by default</li>
        </ul>
    </ul>
<li ><b>10/24/18; 9:59:08 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >Next up</li>
    <ul style=" list-style-type: none;    " >
        <li >internal consts and app consts</li>
        <ul style=" list-style-type: none;    " >
            <li>right now they're mixed in together</li>
            </ul>
        <li >save user prefs</li>
        <ul style=" list-style-type: none;    " >
            <li>the code is in there, it might work but hasnt been tested</li>
            </ul>
        </ul>
    <li >Working on the api glue and Hello World for GHP</li>
    <ul style=" list-style-type: none;    " >
        <li>review code, esp includes</li>
        <li>new post button</li>
        <li>file list</li>
        <li>icons linking to github and html rendering</li>
        </ul>
    </ul>
<li ><b>10/21/18; 11:14:22 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li>handle posts in JSON in addition to YAML</li>
    <li >second editor</li>
    <ul style=" list-style-type: none;    " >
        <li>use same editor as GH uses</li>
        </ul>
    <li >document config</li>
    <ul style=" list-style-type: none;    " >
        <li>add new elements to it?</li>
        <li>add elements in config to pagetable?</li>
        </ul>
    </ul>
<li ><b>10/20/18; 12:00:59 PM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li>changed icons on home page so the href attribute is set, so when you hover over the </li>
    <li>documented templates</li>
    <li>new command to view the template</li>
    </ul>
<li ><b>10/16/18; 10:08:24 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >Back to work. This stuff is done..</li>
    <ul style=" list-style-type: none;    " >
        <li>send committer params along with calls to buildrss</li>
        <li>Render blog home page</li>
        </ul>
    </ul>
<li ><b>10/12/18; 10:15:53 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li>send committer params along with calls to buildrss</li>
    <li>Render blog home page</li>
    <li>Insert HTML command in menu</li>
    <li>Move icons into menu</li>
    <li>Find good place for SAVED</li>
    <li >Docs</li>
    <ul style=" list-style-type: none;    " >
        <li>Template </li>
        <li>setting up a server</li>
        <li>API</li>
        </ul>
    <li>urlEditorApp in config -- is this actually being used or is the one on github overriding it?</li>
    <li >server stuff</li>
    <ul style=" list-style-type: none;    " >
        <li>empty out config in englishServer</li>
        <li>move most of the items into config in githubpub</li>
        <li>move some of them into config.json</li>
        <li >getting this error sometimes</li>
        <ul style=" list-style-type: none;    " >
            <li >saveToGitHub: response == {</li>
            <ul style=" list-style-type: none;    " >
                <li>"statusCode": 409,</li>
                <li>"body": "{\"message\":\"is at c9e17f82b72165f8f2ae57c6587e3eb0ad2fb934 but expected 113749995a25d6f45b77894c64d7008023234c91\",\"documentation_url\":\"https://developer.github.com/v3/repos/contents/#update-a-file\"}",</li>
                </ul>
            </ul>
        </ul>
    <li>&nbsp;</li>
    <li>&nbsp;</li>
    </ul>
<li ><b>10/8/18; 2:03:14 PM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >Next up -- </li>
    <ul style=" list-style-type: none;    " >
        <li>document the api for english server with sample code</li>
        <li>settings linked into the system menu</li>
        <li >clean up command keys in main menu</li>
        <ul style=" list-style-type: none;    " >
            <li>they overwrite the command names</li>
            <li>this is a style sheets item</li>
            </ul>
        </ul>
    </ul>
<li ><b>10/5/18; 10:47:57 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >we still have "blog/" in the setup for englishHome</li>
    <ul style=" list-style-type: none;    " >
        <li >the factoring job started there is not done</li>
        <ul style=" list-style-type: none;    " >
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
    <li >templates should be merged with githubpup repository</li>
    <ul style=" list-style-type: none;    " >
        <li>right now they're only being saved to the english blog</li>
        </ul>
    <li >merge githubpub with english server</li>
    <ul style=" list-style-type: none;    " >
        <li>mostly done</li>
        <li >I still want to make GHP work without english server</li>
        <ul style=" list-style-type: none;    " >
            <li >It has to </li>
            <ul style=" list-style-type: none;    " >
                <li>read config.json</li>
                <li>init davehttp</li>
                <li>replace it on rockaway</li>
                </ul>
            </ul>
        </ul>
    </ul>
<li ><b>10/4/18; 10:50:14 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >paste-with-style into medium-editor</li>
    <ul style=" list-style-type: none;    " >
        <li>okay we have the code in testPasteHTML () in englishHome. </li>
        <li>however we strip the html before saving</li>
        <li>so we need to address that somehow</li>
        <li>probably shouldn't be doing it</li>
        </ul>
    </ul>
<li ><b>10/2/18; 10:27:52 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >RSS feed next up</li>
    <ul style=" list-style-type: none;    " >
        <li>Then home page </li>
        <li>Day archive pages</li>
        </ul>
    <li >Think about comments</li>
    <ul style=" list-style-type: none;    " >
        <li>I have an idea for this</li>
        <li>You have to have your own repo for it to work</li>
        </ul>
    <li >Okay good work session, next up...</li>
    <ul style=" list-style-type: none;    " >
        <li>Use the same CSS file for both the editor and the rendering</li>
        <li>That pretty much guarantees WYSIWYG. ;-)</li>
        </ul>
    <li >big idea -- convert englishserver to use xml-rpc interface</li>
    <ul style=" list-style-type: none;    " >
        <li>or add an xml-rpc interface and use it fron englishhome</li>
        </ul>
    <li >here's how the REST calls for GitHub server work now</li>
    <ul style=" list-style-type: none;    " >
        <li>get/save -- work with absolute paths</li>
        <li>getblogdata/saveblogdata -- use the path</li>
        </ul>
    </ul>
<li ><b>10/1/18; 10:56:40 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >nodeEditorSuite.gitHub.upload has a problem</li>
    <ul style=" list-style-type: none;    " >
        <li>we call the save function on english server</li>
        <li>we changed what it returns. ooops, this code depends on the original functionality.</li>
        <li>I didn't see that coming ;-)</li>
        </ul>
    <li >UI work continues</li>
    <ul style=" list-style-type: none;    " >
        <li>On a new post the Description placeholder is empty</li>
        <li >What about auto-save</li>
        <ul style=" list-style-type: none;    " >
            <li>Clearly if present should be a preference</li>
            <li>Default on?</li>
            </ul>
        <li>CSS needs updating. H4 is wrong font/shape.</li>
        <li >The H2 and H4 items in the popup are broken.</li>
        <ul style=" list-style-type: none;    " >
            <li>Probably has to do with the version of medium-editor we're using</li>
            </ul>
        <li >Change the look of the editor to be more like the pages</li>
        <ul style=" list-style-type: none;    " >
            <li>I don't like the huge text. </li>
            </ul>
        <li >Done</li>
        <ul style=" list-style-type: none;    " >
            <li>get rid of the file list on the left</li>
            <li>steal the look from myword.io</li>
            <li>add description element for the sub-text</li>
            </ul>
        </ul>
    <li >Upheaval --</li>
    <ul style=" list-style-type: none;    " >
        <li >the paths we use should have the "blog/" prefix removed.</li>
        <ul style=" list-style-type: none;    " >
            <li>there's no need for the editor to have this, because it's not part of the url</li>
            <li>it should be hidden by the server, it's part of the configuration, it should be easily changed.</li>
            </ul>
        <li >notes</li>
        <ul style=" list-style-type: none;    " >
            <li >appConsts.blogDataPath and appConsts.blogPostsPath should change to </li>
            <ul style=" list-style-type: none;    " >
                <li>posts/ and data.json</li>
                <li>the blog/ part should be added by the server</li>
                <li>&nbsp;</li>
                </ul>
            </ul>
        </ul>
    <li >Allow customization through the repository</li>
    <ul style=" list-style-type: none;    " >
        <li>store code there??</li>
        </ul>
    </ul>
<li ><b>9/30/18; 11:52:28 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >Let's work on UI</li>
    <ul style=" list-style-type: none;    " >
        <li>Leave the server alone for a while. Whew. Too much rock and roll.</li>
        <li>Try getting the file list into a dialog, let's see what it looks like with more horizonal room.</li>
        </ul>
    <li >Cleanup</li>
    <ul style=" list-style-type: none;    " >
        <li>Move englishblog1.scripting.com to point to rockaway.scripting.com. Tell pagepark to route it to english server (port 1402).</li>
        </ul>
    </ul>
<li ><b>9/29/18; 9:39:58 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >More factoring</li>
    <ul style=" list-style-type: none;    " >
        <li>move github api urls to config struct</li>
        <li>deYamlize can be factored</li>
        <li>extracting the content can also be factored</li>
        </ul>
    </ul>
<li ><b>9/28/18; 2:38:20 PM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >More factoring</li>
    <ul style=" list-style-type: none;    " >
        <li >There are two routines to get the contents of a file from GitHub, one in githubpub and the other in englishserver</li>
        <ul style=" list-style-type: none;    " >
            <li>use the one in githubpub</li>
            <li>small difference in how it's called</li>
            </ul>
        </ul>
    <li >Things to look at next after integration of english server and githubpub</li>
    <ul style=" list-style-type: none;    " >
        <li>there are two caches, only need one</li>
        <li >there seems to be an error handling webhook notifications from github</li>
        <ul style=" list-style-type: none;    " >
            <li>handleRequest: tryError.message == Unexpected token u in JSON at position 0</li>
            </ul>
        </ul>
    </ul>
<li ><b>9/24/18; 3:45:22 PM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >todo</li>
    <ul style=" list-style-type: none;    " >
        <li >eye icon takes you to the rendering</li>
        <ul style=" list-style-type: none;    " >
            <li>the englishHome server has to know the URL of the site its saving to?</li>
            <li>or the githubpub functionality has to be integrated into englishHome?</li>
            <li>thinking needed...</li>
            </ul>
        <li>good fallback when there is no template in the repository.</li>
        <li >provisioning new site</li>
        <ul style=" list-style-type: none;    " >
            <li>favicon.ico</li>
            <li >template</li>
            <ul style=" list-style-type: none;    " >
                <li>temlate.txt</li>
                <li>code.js</li>
                <li>styles.css</li>
                </ul>
            </ul>
        </ul>
    </ul>
<li ><b>9/23/18; 11:32:35 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >githubpub</li>
    <ul style=" list-style-type: none;    " >
        <li>get template from the repo</li>
        <li>deploy on server</li>
        <li>cache + webook support</li>
        </ul>
    </ul>
<li ><b>9/21/18; 10:38:47 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >next up</li>
    <ul style=" list-style-type: none;    " >
        <li>finish the title editor</li>
        <li >store posts in markdown, with atts encoded</li>
        <ul style=" list-style-type: none;    " >
            <li>do it at the lowest level in the editor, so we can still use the json structure internally</li>
            </ul>
        <li>server app</li>
        <li>staging new posts, should be quicker</li>
        <li>error reporting, esp rate limit erros</li>
        </ul>
    </ul>
<li ><b>9/18/18; 10:59:25 AM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >next up --</li>
    <ul style=" list-style-type: none;    " >
        <li>show titles in the tree, not text</li>
        <li>open the file in the editor if you click on it in the tree</li>
        </ul>
    <li>when create new post or at login, activate the text editor</li>
    <li >new instance of githubpub locally </li>
    <ul style=" list-style-type: none;    " >
        <li>renders the blog repo in html</li>
        </ul>
    <li >store the posts in json</li>
    <ul style=" list-style-type: none;    " >
        <li>the text is just one of the elements</li>
        <li>still keep a top-level list of posts in the blogdata struct</li>
        </ul>
    <li>merge appPrefs and blogdata</li>
    </ul>
<li ><b>9/17/18; 12:46:06 PM by DW</b></li>
<ul style=" list-style-type: none;    " >
    <li >Next things to do --</li>
    <ul style=" list-style-type: none;    " >
        <li >get githubpub running locally</li>
        <ul style=" list-style-type: none;    " >
            <li>next up -- pngs aren't being served correctly</li>
            </ul>
        <li>look at how GitHub handles websites</li>
        <li>add metadata at the head of the file using one of the formats others are using (see SN thread).</li>
        <li>allow for opening existing posts</li>
        <li>autosave</li>
        <li>eye icon implemented</li>
        </ul>
    </ul>
