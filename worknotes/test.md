<blockquote>
    <li>add this notes file to the GHP repo</li>
    <li>write docs for config.json for GHP</li>
    <li>send the accesstoken along with every call so the user can be ratelimited by GH, not GHP or the client.</li>
    <li>done</li>
    <blockquote>
        <li>create a separate app on github for the minimal editor</li>
        <blockquote>
            <li>this also has to be configured on GHP server, it has to know the URL of the editor, so it can redirect properly based on which editor is involved. </li>
            </blockquote>
        <li>review interface out of githubpubApp, some routines aren't needed.</li>
        <blockquote>
            <li>some need to be added</li>
            <blockquote>
                <li>repoget and reposave</li>
                <blockquote>
                    <li>read and write from locations defined by username/repository/path</li>
                    <li>low-level routines, not part of blogging</li>
                    </blockquote>
                </blockquote>
            </blockquote>
        </blockquote>
    </blockquote>
<blockquote>
    <li>&nbsp;</li>
    <li>wire up View Template command in main menu in englishhome</li>
    <blockquote>
        <li>&nbsp;</li>
        </blockquote>
    <li>&nbsp;</li>
    <li>big idea --</li>
    <blockquote>
        <li>use GHP to document XML-RPC</li>
        </blockquote>
    <li>&nbsp;</li>
    <li>&nbsp;</li>
    <li>&nbsp;</li>
    <li>test insert html command in english editor</li>
    <li>"english" shouldn't be the name of the server</li>
    <li>look at includes in the editors</li>
    <li>add english editor to editors folder on ghp repo</li>
    <li>handle posts in JSON in addition to YAML</li>
    <li>&nbsp;</li>
    <li>done</li>
    <blockquote>
        <li>fill out settings</li>
        <blockquote>
            <li>blog title</li>
            <li>description</li>
            <li>lastPostTitle</li>
            <li>language</li>
            </blockquote>
        <li>need a way for user app to set blogData elements</li>
        <li>internal consts and app consts</li>
        <blockquote>
            <li>right now they're mixed in together</li>
            </blockquote>
        <li>urlHtml was a bad name -- replace with urlPublic</li>
        <li>englishHome delete major pieces of commented code</li>
        <blockquote>
            <li>the result of the factoring. </li>
            </blockquote>
        <li>test log off, log on</li>
        <blockquote>
            <li>both apps -- minimal and english</li>
            </blockquote>
        <li>change github config to point to new location of english editor</li>
        <blockquote>
            <li>&nbsp;</li>
            </blockquote>
        </blockquote>
    </blockquote>
<blockquote>
    <li>next up -- pull out all the unused code from english editor</li>
    <blockquote>
        <li>saved something fun! :-)</li>
        </blockquote>
    <li>refactor the medium editor and include it</li>
    <blockquote>
        <li>good works</li>
        </blockquote>
    <li>&nbsp;</li>
    <li>&nbsp;</li>
    <li>&nbsp;</li>
    <li>&nbsp;</li>
    <li>look at includes in the editors</li>
    <li>test log off, log on</li>
    <li>"english" shouldn't be the name of the server</li>
    <li>urlHtml was a bad name -- replace with urlPublic</li>
    <li>ghp cache elements expire after a certain period</li>
    <blockquote>
        <li>let's say 3 minutes by default</li>
        </blockquote>
    </blockquote>
<blockquote>
    <li>Next up</li>
    <blockquote>
        <li>internal consts and app consts</li>
        <blockquote>
            <li>right now they're mixed in together</li>
            </blockquote>
        <li>save user prefs</li>
        <blockquote>
            <li>the code is in there, it might work but hasnt been tested</li>
            </blockquote>
        </blockquote>
    <li>Working on the api glue and Hello World for GHP</li>
    <blockquote>
        <li>review code, esp includes</li>
        <li>new post button</li>
        <li>file list</li>
        <li>icons linking to github and html rendering</li>
        </blockquote>
    </blockquote>
<blockquote>
    <li>handle posts in JSON in addition to YAML</li>
    <li>second editor</li>
    <blockquote>
        <li>use same editor as GH uses</li>
        </blockquote>
    <li>document config</li>
    <blockquote>
        <li>add new elements to it?</li>
        <li>add elements in config to pagetable?</li>
        </blockquote>
    </blockquote>
<blockquote>
    <li>changed icons on home page so the href attribute is set, so when you hover over the </li>
    <li>documented templates</li>
    <li>new command to view the template</li>
    </blockquote>
<blockquote>
    <li>Back to work. This stuff is done..</li>
    <blockquote>
        <li>send committer params along with calls to buildrss</li>
        <li>Render blog home page</li>
        </blockquote>
    </blockquote>
<blockquote>
    <li>send committer params along with calls to buildrss</li>
    <li>Render blog home page</li>
    <li>Insert HTML command in menu</li>
    <li>Move icons into menu</li>
    <li>Find good place for SAVED</li>
    <li>Docs</li>
    <blockquote>
        <li>Template </li>
        <li>setting up a server</li>
        <li>API</li>
        </blockquote>
    <li>urlEditorApp in config -- is this actually being used or is the one on github overriding it?</li>
    <li>server stuff</li>
    <blockquote>
        <li>empty out config in englishServer</li>
        <li>move most of the items into config in githubpub</li>
        <li>move some of them into config.json</li>
        <li>getting this error sometimes</li>
        <blockquote>
            <li>saveToGitHub: response == {</li>
            <blockquote>
                <li>"statusCode": 409,</li>
                <li>"body": "{\"message\":\"is at c9e17f82b72165f8f2ae57c6587e3eb0ad2fb934 but expected 113749995a25d6f45b77894c64d7008023234c91\",\"documentation_url\":\"https://developer.github.com/v3/repos/contents/#update-a-file\"}",</li>
                </blockquote>
            </blockquote>
        </blockquote>
    <li>&nbsp;</li>
    <li>&nbsp;</li>
    </blockquote>
<blockquote>
    <li>Next up -- </li>
    <blockquote>
        <li>document the api for english server with sample code</li>
        <li>settings linked into the system menu</li>
        <li>clean up command keys in main menu</li>
        <blockquote>
            <li>they overwrite the command names</li>
            <li>this is a style sheets item</li>
            </blockquote>
        </blockquote>
    </blockquote>
<blockquote>
    <li>we still have "blog/" in the setup for englishHome</li>
    <blockquote>
        <li>the factoring job started there is not done</li>
        <blockquote>
            <li>I understand why. When we punted on changing the way EH works to use domains instead of username/repo/path, it made it impossible to hide the relative path of the things it's editing. That was never configured on the server. domain.path is irrelevant, as it's currently implemented.</li>
            <li>&nbsp;</li>
            <li>interfaces that take domain in place of username/repo/path</li>
            <li>&nbsp;</li>
            <li>/get</li>
            <li>/save</li>
            <li>/getpost</li>
            <li>/savepost</li>
            </blockquote>
        </blockquote>
    <li>templates should be merged with githubpup repository</li>
    <blockquote>
        <li>right now they're only being saved to the english blog</li>
        </blockquote>
    <li>merge githubpub with english server</li>
    <blockquote>
        <li>mostly done</li>
        <li>I still want to make GHP work without english server</li>
        <blockquote>
            <li>It has to </li>
            <blockquote>
                <li>read config.json</li>
                <li>init davehttp</li>
                <li>replace it on rockaway</li>
                </blockquote>
            </blockquote>
        </blockquote>
    </blockquote>
<blockquote>
    <li>paste-with-style into medium-editor</li>
    <blockquote>
        <li>okay we have the code in testPasteHTML () in englishHome. </li>
        <li>however we strip the html before saving</li>
        <li>so we need to address that somehow</li>
        <li>probably shouldn't be doing it</li>
        </blockquote>
    </blockquote>
<blockquote>
    <li>RSS feed next up</li>
    <blockquote>
        <li>Then home page </li>
        <li>Day archive pages</li>
        </blockquote>
    <li>Think about comments</li>
    <blockquote>
        <li>I have an idea for this</li>
        <li>You have to have your own repo for it to work</li>
        </blockquote>
    <li>Okay good work session, next up...</li>
    <blockquote>
        <li>Use the same CSS file for both the editor and the rendering</li>
        <li>That pretty much guarantees WYSIWYG. ;-)</li>
        </blockquote>
    <li>big idea -- convert englishserver to use xml-rpc interface</li>
    <blockquote>
        <li>or add an xml-rpc interface and use it fron englishhome</li>
        </blockquote>
    <li>here's how the REST calls for GitHub server work now</li>
    <blockquote>
        <li>get/save -- work with absolute paths</li>
        <li>getblogdata/saveblogdata -- use the path</li>
        </blockquote>
    </blockquote>
<blockquote>
    <li>nodeEditorSuite.gitHub.upload has a problem</li>
    <blockquote>
        <li>we call the save function on english server</li>
        <li>we changed what it returns. ooops, this code depends on the original functionality.</li>
        <li>I didn't see that coming ;-)</li>
        </blockquote>
    <li>UI work continues</li>
    <blockquote>
        <li>On a new post the Description placeholder is empty</li>
        <li>What about auto-save</li>
        <blockquote>
            <li>Clearly if present should be a preference</li>
            <li>Default on?</li>
            </blockquote>
        <li>CSS needs updating. H4 is wrong font/shape.</li>
        <li>The H2 and H4 items in the popup are broken.</li>
        <blockquote>
            <li>Probably has to do with the version of medium-editor we're using</li>
            </blockquote>
        <li>Change the look of the editor to be more like the pages</li>
        <blockquote>
            <li>I don't like the huge text. </li>
            </blockquote>
        <li>Done</li>
        <blockquote>
            <li>get rid of the file list on the left</li>
            <li>steal the look from myword.io</li>
            <li>add description element for the sub-text</li>
            </blockquote>
        </blockquote>
    <li>Upheaval --</li>
    <blockquote>
        <li>the paths we use should have the "blog/" prefix removed.</li>
        <blockquote>
            <li>there's no need for the editor to have this, because it's not part of the url</li>
            <li>it should be hidden by the server, it's part of the configuration, it should be easily changed.</li>
            </blockquote>
        <li>notes</li>
        <blockquote>
            <li>appConsts.blogDataPath and appConsts.blogPostsPath should change to </li>
            <blockquote>
                <li>posts/ and data.json</li>
                <li>the blog/ part should be added by the server</li>
                <li>&nbsp;</li>
                </blockquote>
            </blockquote>
        </blockquote>
    <li>Allow customization through the repository</li>
    <blockquote>
        <li>store code there??</li>
        </blockquote>
    </blockquote>
<blockquote>
    <li>Let's work on UI</li>
    <blockquote>
        <li>Leave the server alone for a while. Whew. Too much rock and roll.</li>
        <li>Try getting the file list into a dialog, let's see what it looks like with more horizonal room.</li>
        </blockquote>
    <li>Cleanup</li>
    <blockquote>
        <li>Move englishblog1.scripting.com to point to rockaway.scripting.com. Tell pagepark to route it to english server (port 1402).</li>
        </blockquote>
    </blockquote>
<blockquote>
    <li>More factoring</li>
    <blockquote>
        <li>move github api urls to config struct</li>
        <li>deYamlize can be factored</li>
        <li>extracting the content can also be factored</li>
        </blockquote>
    </blockquote>
<blockquote>
    <li>More factoring</li>
    <blockquote>
        <li>There are two routines to get the contents of a file from GitHub, one in githubpub and the other in englishserver</li>
        <blockquote>
            <li>use the one in githubpub</li>
            <li>small difference in how it's called</li>
            </blockquote>
        </blockquote>
    <li>Things to look at next after integration of english server and githubpub</li>
    <blockquote>
        <li>there are two caches, only need one</li>
        <li>there seems to be an error handling webhook notifications from github</li>
        <blockquote>
            <li>handleRequest: tryError.message == Unexpected token u in JSON at position 0</li>
            </blockquote>
        </blockquote>
    </blockquote>
<blockquote>
    <li>todo</li>
    <blockquote>
        <li>eye icon takes you to the rendering</li>
        <blockquote>
            <li>the englishHome server has to know the URL of the site its saving to?</li>
            <li>or the githubpub functionality has to be integrated into englishHome?</li>
            <li>thinking needed...</li>
            </blockquote>
        <li>good fallback when there is no template in the repository.</li>
        <li>provisioning new site</li>
        <blockquote>
            <li>favicon.ico</li>
            <li>template</li>
            <blockquote>
                <li>temlate.txt</li>
                <li>code.js</li>
                <li>styles.css</li>
                </blockquote>
            </blockquote>
        </blockquote>
    </blockquote>
<blockquote>
    <li>githubpub</li>
    <blockquote>
        <li>get template from the repo</li>
        <li>deploy on server</li>
        <li>cache + webook support</li>
        </blockquote>
    </blockquote>
<blockquote>
    <li>next up</li>
    <blockquote>
        <li>finish the title editor</li>
        <li>store posts in markdown, with atts encoded</li>
        <blockquote>
            <li>do it at the lowest level in the editor, so we can still use the json structure internally</li>
            </blockquote>
        <li>server app</li>
        <li>staging new posts, should be quicker</li>
        <li>error reporting, esp rate limit erros</li>
        </blockquote>
    </blockquote>
<blockquote>
    <li>next up --</li>
    <blockquote>
        <li>show titles in the tree, not text</li>
        <li>open the file in the editor if you click on it in the tree</li>
        </blockquote>
    <li>when create new post or at login, activate the text editor</li>
    <li>new instance of githubpub locally </li>
    <blockquote>
        <li>renders the blog repo in html</li>
        </blockquote>
    <li>store the posts in json</li>
    <blockquote>
        <li>the text is just one of the elements</li>
        <li>still keep a top-level list of posts in the blogdata struct</li>
        </blockquote>
    <li>merge appPrefs and blogdata</li>
    </blockquote>
<blockquote>
    <li>Next things to do --</li>
    <blockquote>
        <li>get githubpub running locally</li>
        <blockquote>
            <li>next up -- pngs aren't being served correctly</li>
            </blockquote>
        <li>look at how GitHub handles websites</li>
        <li>add metadata at the head of the file using one of the formats others are using (see SN thread).</li>
        <li>allow for opening existing posts</li>
        <li>autosave</li>
        <li>eye icon implemented</li>
        </blockquote>
    </blockquote>
