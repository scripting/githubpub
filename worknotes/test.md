notes.opml
	10/27/18; 10:32:32 AM by DW
		add this notes file to the GHP repo
		write docs for config.json for GHP
		send the accesstoken along with every call so the user can be ratelimited by GH, not GHP or the client.
		done
			create a separate app on github for the minimal editor
				this also has to be configured on GHP server, it has to know the URL of the editor, so it can redirect properly based on which editor is involved. 
			review interface out of githubpubApp, some routines aren't needed.
				some need to be added
					repoget and reposave
						read and write from locations defined by username/repository/path
						low-level routines, not part of blogging
	10/26/18; 9:55:44 AM by DW
		
		wire up View Template command in main menu in englishhome
			
		
		big idea --
			use GHP to document XML-RPC
		
		
		
		test insert html command in english editor
		"english" shouldn't be the name of the server
		look at includes in the editors
		add english editor to editors folder on ghp repo
		handle posts in JSON in addition to YAML
		
		done
			fill out settings
				blog title
				description
				lastPostTitle
				language
			need a way for user app to set blogData elements
			internal consts and app consts
				right now they're mixed in together
			urlHtml was a bad name -- replace with urlPublic
			englishHome delete major pieces of commented code
				the result of the factoring. 
			test log off, log on
				both apps -- minimal and english
			change github config to point to new location of english editor
				
	10/25/18; 10:25:29 AM by DW
		next up -- pull out all the unused code from english editor
			saved something fun! :-)
		refactor the medium editor and include it
			good works
		
		
		
		
		look at includes in the editors
		test log off, log on
		"english" shouldn't be the name of the server
		urlHtml was a bad name -- replace with urlPublic
		ghp cache elements expire after a certain period
			let's say 3 minutes by default
	10/24/18; 9:59:08 AM by DW
		Next up
			internal consts and app consts
				right now they're mixed in together
			save user prefs
				the code is in there, it might work but hasnt been tested
		Working on the api glue and Hello World for GHP
			review code, esp includes
			new post button
			file list
			icons linking to github and html rendering
	10/21/18; 11:14:22 AM by DW
		handle posts in JSON in addition to YAML
		second editor
			use same editor as GH uses
		document config
			add new elements to it?
			add elements in config to pagetable?
	10/20/18; 12:00:59 PM by DW
		changed icons on home page so the href attribute is set, so when you hover over the 
		documented templates
		new command to view the template
	10/16/18; 10:08:24 AM by DW
		Back to work. This stuff is done..
			send committer params along with calls to buildrss
			Render blog home page
	10/12/18; 10:15:53 AM by DW
		send committer params along with calls to buildrss
		Render blog home page
		Insert HTML command in menu
		Move icons into menu
		Find good place for SAVED
		Docs
			Template 
			setting up a server
			API
		urlEditorApp in config -- is this actually being used or is the one on github overriding it?
		server stuff
			empty out config in englishServer
			move most of the items into config in githubpub
			move some of them into config.json
			getting this error sometimes
				saveToGitHub: response == {
					"statusCode": 409,
					"body": "{\"message\":\"is at c9e17f82b72165f8f2ae57c6587e3eb0ad2fb934 but expected 113749995a25d6f45b77894c64d7008023234c91\",\"documentation_url\":\"https://developer.github.com/v3/repos/contents/#update-a-file\"}",
		
		
	10/8/18; 2:03:14 PM by DW
		Next up -- 
			document the api for english server with sample code
			settings linked into the system menu
			clean up command keys in main menu
				they overwrite the command names
				this is a style sheets item
	10/5/18; 10:47:57 AM by DW
		we still have "blog/" in the setup for englishHome
			the factoring job started there is not done
				I understand why. When we punted on changing the way EH works to use domains instead of username/repo/path, it made it impossible to hide the relative path of the things it's editing. That was never configured on the server. domain.path is irrelevant, as it's currently implemented.
				
				interfaces that take domain in place of username/repo/path
				
				/get
				/save
				/getpost
				/savepost
		templates should be merged with githubpup repository
			right now they're only being saved to the english blog
		merge githubpub with english server
			mostly done
			I still want to make GHP work without english server
				It has to 
					read config.json
					init davehttp
					replace it on rockaway
	10/4/18; 10:50:14 AM by DW
		paste-with-style into medium-editor
			okay we have the code in testPasteHTML () in englishHome. 
			however we strip the html before saving
			so we need to address that somehow
			probably shouldn't be doing it
	10/2/18; 10:27:52 AM by DW
		RSS feed next up
			Then home page 
			Day archive pages
		Think about comments
			I have an idea for this
			You have to have your own repo for it to work
		Okay good work session, next up...
			Use the same CSS file for both the editor and the rendering
			That pretty much guarantees WYSIWYG. ;-)
		big idea -- convert englishserver to use xml-rpc interface
			or add an xml-rpc interface and use it fron englishhome
		here's how the REST calls for GitHub server work now
			get/save -- work with absolute paths
			getblogdata/saveblogdata -- use the path
	10/1/18; 10:56:40 AM by DW
		nodeEditorSuite.gitHub.upload has a problem
			we call the save function on english server
			we changed what it returns. ooops, this code depends on the original functionality.
			I didn't see that coming ;-)
		UI work continues
			On a new post the Description placeholder is empty
			What about auto-save
				Clearly if present should be a preference
				Default on?
			CSS needs updating. H4 is wrong font/shape.
			The H2 and H4 items in the popup are broken.
				Probably has to do with the version of medium-editor we're using
			Change the look of the editor to be more like the pages
				I don't like the huge text. 
			Done
				get rid of the file list on the left
				steal the look from myword.io
				add description element for the sub-text
		Upheaval --
			the paths we use should have the "blog/" prefix removed.
				there's no need for the editor to have this, because it's not part of the url
				it should be hidden by the server, it's part of the configuration, it should be easily changed.
			notes
				appConsts.blogDataPath and appConsts.blogPostsPath should change to 
					posts/ and data.json
					the blog/ part should be added by the server
					
		Allow customization through the repository
			store code there??
	9/30/18; 11:52:28 AM by DW
		Let's work on UI
			Leave the server alone for a while. Whew. Too much rock and roll.
			Try getting the file list into a dialog, let's see what it looks like with more horizonal room.
		Cleanup
			Move englishblog1.scripting.com to point to rockaway.scripting.com. Tell pagepark to route it to english server (port 1402).
	9/29/18; 9:39:58 AM by DW
		More factoring
			move github api urls to config struct
			deYamlize can be factored
			extracting the content can also be factored
	9/28/18; 2:38:20 PM by DW
		More factoring
			There are two routines to get the contents of a file from GitHub, one in githubpub and the other in englishserver
				use the one in githubpub
				small difference in how it's called
		Things to look at next after integration of english server and githubpub
			there are two caches, only need one
			there seems to be an error handling webhook notifications from github
				handleRequest: tryError.message == Unexpected token u in JSON at position 0
	9/24/18; 3:45:22 PM by DW
		todo
			eye icon takes you to the rendering
				the englishHome server has to know the URL of the site its saving to?
				or the githubpub functionality has to be integrated into englishHome?
				thinking needed...
			good fallback when there is no template in the repository.
			provisioning new site
				favicon.ico
				template
					temlate.txt
					code.js
					styles.css
	9/23/18; 11:32:35 AM by DW
		githubpub
			get template from the repo
			deploy on server
			cache + webook support
	9/21/18; 10:38:47 AM by DW
		next up
			finish the title editor
			store posts in markdown, with atts encoded
				do it at the lowest level in the editor, so we can still use the json structure internally
			server app
			staging new posts, should be quicker
			error reporting, esp rate limit erros
	9/18/18; 10:59:25 AM by DW
		next up --
			show titles in the tree, not text
			open the file in the editor if you click on it in the tree
		when create new post or at login, activate the text editor
		new instance of githubpub locally 
			renders the blog repo in html
		store the posts in json
			the text is just one of the elements
			still keep a top-level list of posts in the blogdata struct
		merge appPrefs and blogdata
	9/17/18; 12:46:06 PM by DW
		Next things to do --
			get githubpub running locally
				next up -- pngs aren't being served correctly
			look at how GitHub handles websites
			add metadata at the head of the file using one of the formats others are using (see SN thread).
			allow for opening existing posts
			autosave
			eye icon implemented