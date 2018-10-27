10/27/18; 10:32:32 AM by DW
	add this notes file to the GHP repo
	write docs for config.json for GHP
	send the accesstoken along with every call so the user can be ratelimited by GH, not GHP or the client.
	done
		create a separate app on github for the minimal editor
		review interface out of githubpubApp, some routines aren't needed.
10/26/18; 9:55:44 AM by DW
	
	wire up View Template command in main menu in englishhome
	
	big idea --
	
	
	
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
		urlHtml was a bad name -- replace with urlPublic
		englishHome delete major pieces of commented code
		test log off, log on
		change github config to point to new location of english editor
10/25/18; 10:25:29 AM by DW
	next up -- pull out all the unused code from english editor
	refactor the medium editor and include it
	
	
	
	
	look at includes in the editors
	test log off, log on
	"english" shouldn't be the name of the server
	urlHtml was a bad name -- replace with urlPublic
	ghp cache elements expire after a certain period
10/24/18; 9:59:08 AM by DW
	Next up
		internal consts and app consts
		save user prefs
	Working on the api glue and Hello World for GHP
		review code, esp includes
		new post button
		file list
		icons linking to github and html rendering
10/21/18; 11:14:22 AM by DW
	handle posts in JSON in addition to YAML
	second editor
	document config
		add new elements to it?
		add elements in config to pagetable?
10/20/18; 12:00:59 PM by DW
	changed icons on home page so the href attribute is set, so when you hover over the 
	documented templates
	new command to view the template
10/16/18; 10:08:24 AM by DW
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
	
	
10/8/18; 2:03:14 PM by DW
10/5/18; 10:47:57 AM by DW
	we still have "blog/" in the setup for englishHome
	templates should be merged with githubpup repository
	merge githubpub with english server
		mostly done
		I still want to make GHP work without english server
10/4/18; 10:50:14 AM by DW
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
		Change the look of the editor to be more like the pages
		Done
			get rid of the file list on the left
			steal the look from myword.io
			add description element for the sub-text
	Upheaval --
		the paths we use should have the "blog/" prefix removed.
			there's no need for the editor to have this, because it's not part of the url
			it should be hidden by the server, it's part of the configuration, it should be easily changed.
		notes
	Allow customization through the repository
9/30/18; 11:52:28 AM by DW
	Let's work on UI
		Leave the server alone for a while. Whew. Too much rock and roll.
		Try getting the file list into a dialog, let's see what it looks like with more horizonal room.
	Cleanup
9/29/18; 9:39:58 AM by DW
9/28/18; 2:38:20 PM by DW
	More factoring
	Things to look at next after integration of english server and githubpub
		there are two caches, only need one
		there seems to be an error handling webhook notifications from github
9/24/18; 3:45:22 PM by DW
9/23/18; 11:32:35 AM by DW
9/21/18; 10:38:47 AM by DW
9/18/18; 10:59:25 AM by DW
	next up --
		show titles in the tree, not text
		open the file in the editor if you click on it in the tree
	when create new post or at login, activate the text editor
	new instance of githubpub locally 
	store the posts in json
		the text is just one of the elements
		still keep a top-level list of posts in the blogdata struct
	merge appPrefs and blogdata
9/17/18; 12:46:06 PM by DW
