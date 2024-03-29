function githubpubApp (consts, prefs) { //10/22/18 by DW
	var userConsts = consts, userPrefs = prefs;
	
	var appConsts = { 
		blogDataPath: "data.json",
		blogPostsPath: "posts/",
		blogRssPath: "rss.xml",
		version: "0.4.3"
		};
	var appPrefs = { //saved in localStorage (or filesystem on server, tbd)
		accessToken: undefined,
		userInfo: undefined,
		commitMessage: "Update",
		flMarkdownPreview: true,
		flAutoSave: true,
		postStruct: undefined,
		urlTemplate: undefined,
		domains: undefined,
		userPrefs: undefined
		};
	
	var blogData = { //saved on server
		title: "The best blog ever",
		description: "The first blog hosted by English on GitHub.",
		generator: appConsts.productnameForDisplay + " v" + appConsts.version,
		lastPostTitle: undefined,
		maxFeedItems: 25, //10/11/18 by DW
		cloud: {
			domain: "rpc.rsscloud.io",
			port: "5337",
			path: "/pleaseNotify",
			protocol: "http-post"
			},
		language: "en-us",
		stats: {
			ctDataSaves: 0,
			whenLastDataSave: new Date (0),
			ctSecsLastDataSave: 0,
			ctRssBuilds: 0,
			whenLastRssBuild: new Date (0),
			ctSecsLastRssBuild: 0,
			urlFeed: undefined,
			},
		posts: {
			subs: [
				]
			}
		};
	
	var flBlogDataChanged = false;
	var flRssFeedChanged = false;
	var flPrefsChanged = false;
	var flRssFeedChanged = false;
	
	var me = this;
	
	function prefsChanged () {
		flPrefsChanged = true;
		}
	function getPrefsFromLocalStorage () {
		if (localStorage.gitHubData !== undefined) {
			var jstruct = JSON.parse (localStorage.gitHubData);
			for (var x in jstruct) {
				appPrefs [x] = jstruct [x];
				}
			}
		}
	function savePrefsToLocalStorage () {
		appPrefs.userPrefs = userPrefs;
		localStorage.gitHubData = jsonStringify (appPrefs);
		}
	function saveEditorStatus (editorData) {
		var flchanged = false;
		function setval (name, val) {
			if (appPrefs.postStruct [name] != val) {
				appPrefs.postStruct [name] = val;
				flchanged = true;
				}
			}
		setval ("title", editorData.title);
		setval ("description", editorData.description);
		setval ("text", editorData.text);
		if (flchanged) {
			savePrefsToLocalStorage ();
			}
		}
	
	function userIsSignedOn () {
		if (appPrefs.accessToken === undefined) {
			return (false);
			}
		else {
			return (appPrefs.userInfo.login !== undefined);
			}
		}
	function updateGitHubMenuItem () {
		var menustring = (userIsSignedOn ()) ? "Sign off GitHub" : "Sign on GitHub";
		if ($("#idGitHubConnectMenuItem").text () != menustring) {
			$("#idGitHubConnectMenuItem").text (menustring);
			}
		}
	function disconnectFromGitHub () {
		appPrefs.accessToken = undefined;
		appPrefs.userInfo = undefined;
		prefsChanged ();
		}
	function updateSignOnButton () {
		var flVisible = $("#idSignOnContainer").css ("display") == "block";
		var flNotSignedOn = !userIsSignedOn ();
		if (flVisible !== flNotSignedOn) {
			var val = (flNotSignedOn) ? "block" : "none";
			$("#idSignOnContainer").css ("display", val);
			}
		}
	function connectWithGitHub () {
		var url = "https://github.com/login/oauth/authorize?client_id=" + appConsts.idGitHubClient + "&scope=repo&redirect_url=" + encodeURIComponent (window.location.href);
		console.log ("connectWithGitHub: url == " + url);
		window.open (url);
		}
	function toggleGitHubConnection () {
		if (userIsSignedOn ()) {
			disconnectFromGitHub ();
			$("#idEditorContainer").css ("display", "none");
			updateSignOnButton ();
			prefsChanged ();
			}
		else {
			connectWithGitHub ();
			}
		}
	function serverCall (verb, params, callback, server, method, data) {
		const timeoutInMilliseconds = 30000;
		if (method === undefined) {
			method = "GET";
			}
		if (params === undefined) {
			params = new Object ();
			}
		if (params.accessToken === undefined) { //10/29/18 by DW
			params.accessToken = appPrefs.accessToken;
			}
		if (server === undefined) { //9/25/18 by DW
			server = appConsts.myServerAddress;
			}
		var apiUrl = server + verb;
		var paramString = buildParamList (params);
		if (paramString.length > 0) {
			apiUrl += "?" + paramString;
			}
		var ajaxResult = $.ajax ({ 
			url: apiUrl,
			type: method,
			data: data,
			dataType: "text", 
			headers: undefined,
			timeout: timeoutInMilliseconds 
			}) 
		.success (function (data, status) { 
			callback (undefined, data);
			}) 
		.error (function (status) { 
			console.log ("serverCall: url == " + apiUrl + ", error == " + jsonStringify (status));
			callback ({message: "Error reading the file."});
			});
		}
	function getServerDomains (callback) {
		serverCall ("getdomains", undefined, function (err, jsontext) {
			if (!err) {
				var jstruct = JSON.parse (jsontext);
				console.log ("getServerDomains: jstruct == " + jsonStringify (jstruct));
				appPrefs.domains = jstruct;
				prefsChanged ();
				if (callback !== undefined) {
					callback (jstruct);
					}
				}
			});
		}
	function getGitHubUserInfo (callback) {
		var whenstart = new Date ();
		var params = {
			accessToken: appPrefs.accessToken
			};
		serverCall ("getuserinfo", params, function (err, data) {
			var jstruct = JSON.parse (data);
			if (jstruct.flError) {
				console.log ("getGitHubUserInfo: error == " + jstruct.message);
				}
			else {
				appPrefs.userInfo = jstruct.info;
				console.log ("getGitHubUserInfo: " + secondsSince (whenstart) + " secs.");
				prefsChanged ();
				}
			if (callback !== undefined) {
				callback ();
				}
			else {
				console.log (jsonStringify (appPrefs.userInfo));
				}
			});
		}
	function getGitHubFileList (username, repo, callback) {
		var apiUrl = "https://api.github.com/repos/" + username + "/" + repo + "/git/trees/HEAD?recursive=true";
		readHttpFile (apiUrl, function (jsontext) {
			if (jsontext === undefined) {
				callback (undefined);
				}
			else {
				var jstruct = JSON.parse (jsontext);
				for (var i = 0; i < jstruct.tree.length; i++) {
					var item = jstruct.tree [i];
					if (item.type == "blob") {
						console.log (item.path);
						}
					}
				}
			});
		}
	function findDomain (name) {
		return (appPrefs.domains [name]);
		}
	function repoGet (username, repository, path, options, callback) {
		var params = {
			username: username,
			repository: repository,
			path: path
			};
		serverCall ("repoget", params, callback);
		}
	function repoSave (username, repository, path, data, options, callback) {
		var whenstart = new Date ();
		var params = {
			username: username,
			repository: repository,
			accessToken: appPrefs.accessToken,
			path: path,
			msg: appPrefs.commitMessage,
			name: appPrefs.userInfo.name,
			email: appPrefs.userInfo.email
			};
		serverCall ("reposave", params, callback, undefined, "POST", data);
		}
	function getGitHubFileContent (path, callback) {
		if (beginsWith (path, "/")) {
			path = utils.stringDelete (path, 1, 1);
			}
		var params = {
			domain: appConsts.myBlogDomain,
			path: path
			};
		serverCall ("get", params, callback);
		}
	function updateGitHubFile (path, data, callback) {
		var whenstart = new Date ();
		var params = {
			domain: appConsts.myBlogDomain,
			accessToken: appPrefs.accessToken,
			path: path,
			msg: appPrefs.commitMessage,
			name: appPrefs.userInfo.name,
			email: appPrefs.userInfo.email
			};
		serverCall ("save", params, function (err, jsontext) {
			if (!err) {
				console.log ("updateGitHubFile: path == " + path + ", " + data.length + " chars, " + secondsSince (whenstart) + " secs.");
				callback (JSON.parse (jsontext));
				}
			}, undefined, "POST", data);
		}
	function updateIconValues () { //10/20/18 by DW
		function setIcon (id, val) {
			if ($("#" + id).attr ("href") != val) {
				$("#" + id).attr ("href", val);
				}
			}
		setIcon ("idEyeIconAnchor", appPrefs.postStruct.urlPublic);
		setIcon ("idGitHubIconAnchor", appPrefs.postStruct.urlGitHub);
		}
	function getRepoLoc (path, callback) {
		var params = {
			domain: appConsts.myBlogDomain,
			path: path
			};
		serverCall ("getgithubdata", params, function (err, jsontext) {
			if (err) {
				callback (err);
				}
			else {
				var jstruct = JSON.parse (jsontext);
				console.log ("getRepoLoc: jstruct.links == " + jsonStringify (jstruct ["_links"]));
				if (callback !== undefined) {
					callback (undefined, jstruct ["_links"].html);
					}
				}
			});
		}
	function viewTemplateOnGitHub () {
		if (appPrefs.urlTemplate !== undefined) {
			window.open (appPrefs.urlTemplate);
			}
		}
	function getPostList () {
		var theList = [];
		for (var i = 0; i < blogData.posts.subs.length; i++) {
			var year = blogData.posts.subs [i];
			for (var j = 0; j < year.subs.length; j++) {
				var month = year.subs [j];
				for (var k = 0; k < month.subs.length; k++) {
					var day = month.subs [k];
					for (var l = 0; l < day.subs.length; l++) {
						var post = day.subs [l];
						theList.push (post);
						}
					}
				}
			return (theList);
			}
		}
	function blogDataChanged () {
		flBlogDataChanged = true;
		}
	function rssFeedChanged () {
		flRssFeedChanged = true;
		}
	function saveBlogData (callback) {
		var whenstart = new Date ();
		blogData.stats.ctDataSaves++;
		blogData.stats.whenLastDataSave = whenstart;
		updateGitHubFile (appConsts.blogDataPath, jsonStringify (blogData), function (jstruct) {
			blogData.stats.ctSecsLastDataSave = secondsSince (whenstart);
			});
		}
	function getBlogData (callback) {
		getGitHubFileContent (appConsts.blogDataPath, function (err, jsontext) {
			if (err) {
				blogDataChanged (); //cause the file to be written
				}
			else {
				var jstruct = JSON.parse (jsontext);
				for (var x in jstruct) {
					blogData [x] = jstruct [x];
					}
				if (blogData.stats.ctSecsLastDataSave === undefined) {
					blogData.stats.ctSecsLastDataSave = new Date (0);
					}
				if (blogData.stats.ctRssBuilds === undefined) {
					blogData.stats.ctRssBuilds = 0;
					}
				if (blogData.stats.whenLastRssBuild === undefined) {
					blogData.stats.whenLastRssBuild = new Date (0);
					}
				if (blogData.stats.ctSecsLastRssBuild === undefined) {
					blogData.stats.ctSecsLastRssBuild = new Date (0);
					}
				}
			if (callback !== undefined) {
				callback ();
				}
			});
		}
	function getBlogPostJson (path, callback) {
		var params = {
			domain: appConsts.myBlogDomain,
			path: path
			}
		serverCall ("getpost", params, function (err, jsontext) {
			if (err) {
				callback (new Object ());
				}
			else {
				callback (JSON.parse (jsontext));
				}
			});
		}
	function addPostToOutline (postStruct) {
		var nomad = blogData.posts, when = new Date (postStruct.created);
		var year = pad (when.getFullYear ()), month = monthToString (when.getMonth ()), day = pad (when.getDate ());
		function pad (num) {
			return (padWithZeros (num, 2));
			}
		function bumpnomad (namesub) {
			for (var i = 0; i < nomad.subs.length; i++) {
				var sub = nomad.subs [i];
				if (sub.text == namesub) {
					nomad = sub;
					return;
					}
				}
			nomad.subs.unshift ({ //insert at beginning of array
				text: namesub,
				subs: [
					]
				});
			nomad = nomad.subs [0];
			}
		bumpnomad (year);
		bumpnomad (month);
		bumpnomad (day);
		
		var outlineStruct = { //the data we store in the outline
			title: postStruct.title,
			description: postStruct.description, //10/1/18 by DW
			id: postStruct.id,
			created: postStruct.created,
			path: postStruct.path,
			urlPublic: postStruct.urlPublic, //10/11/18 by DW
			urlGitHub: postStruct.urlGitHub //10/11/18 by DW
			};
		
		for (var i = 0; i < nomad.subs.length; i++) {
			item = nomad.subs [i];
			if (item.id == postStruct.id) {
				nomad.subs [i] = outlineStruct;
				blogDataChanged ();
				return;
				}
			}
		nomad.subs.unshift (outlineStruct); //insert at beginning of array
		blogDataChanged ();
		}
	function pingPostUpdate (callback) {
		var params = {
			domain: appConsts.myBlogDomain,
			path: appPrefs.postStruct.path
			};
		serverCall ("eventfromeditor", params, function () {
			if (callback !== undefined) {
				callback ();
				}
			});
		}
	function updateBlogPost (postStruct, callback) {
		function pad (num) {
			return (padWithZeros (num, 2));
			}
		function getPermalinkString (when) { 
			var d = new Date (when);
			return (pad (d.getUTCHours ()) + pad (d.getUTCMinutes ()) + pad (d.getUTCSeconds ()));
			}
		var now = new Date ();
		if (postStruct.path === undefined) { //it's new
			var permalinkString = getPermalinkString (now);
			postStruct.path = appConsts.blogPostsPath + getDatePath (now) + permalinkString + ".md";
			postStruct.id = permalinkString;
			postStruct.ctUpdates = 0;
			}
		//stats
			if (postStruct.ctUpdates === undefined) {
				postStruct.ctUpdates = 0;
				}
			postStruct.ctUpdates++;
			postStruct.modified = now;
		var params = {
			domain: appConsts.myBlogDomain,
			accessToken: appPrefs.accessToken,
			path: postStruct.path,
			msg: appPrefs.commitMessage,
			name: appPrefs.userInfo.name,
			email: appPrefs.userInfo.email,
			};
		serverCall ("savepost", params, function (err, jsontext) {
			var jstruct = JSON.parse (jsontext);
			console.log ("updateBlogPost: jstruct == " + jsonStringify (jstruct));
			pingPostUpdate (); //9/25/18 by DW
			postStruct.domain = jstruct.domain; //9/30/18 by DW
			postStruct.urlPublic = jstruct.urlPublic; //10/6/18 by DW
			postStruct.urlGitHub = jstruct.urlGitHub; //10/6/18 by DW
			console.log ("updateBlogPost: postStruct == " + jsonStringify (postStruct));
			addPostToOutline (postStruct);
			me.callbacks.postUpdated (postStruct); //tell app that this post updated
			rssFeedChanged (); //10/11/18 by DW
			if (callback !== undefined) {
				callback (postStruct);
				}
			}, undefined, "POST", jsonStringify (postStruct));
		}
	function newBlogPost (title) {
		var postStruct = {
			title: title,
			description: "", 
			text: "",
			created: new Date ()
			}
		me.callbacks.startEditor (postStruct);
		updateBlogPost (postStruct, function (postStruct) {
			appPrefs.postStruct = postStruct; //pick up new info from server
			prefsChanged ();
			});
		}
	function newBlogPostCommand () {
		askDialog ("Title for new post?", blogData.lastPostTitle, "You can leave it empty if you like.", function (title, flcancel) {
			if (!flcancel) {
				blogData.lastPostTitle = title; 
				blogDataChanged ();
				newBlogPost (title);
				}
			});
		}
	function postButtonClick (callback) {
		updateBlogPost (appPrefs.postStruct, function (postStruct) {
			appPrefs.postStruct = postStruct;
			viewPostsBrowser ();
			flPostChanged = false;
			updateSaveStatus ();
			if (callback !== undefined) {
				callback ();
				}
			});
		}
	function editTitleButtonClick () {
		askDialog ("Title for this post?", appPrefs.postStruct.title, "You can leave it empty if you like.", function (title, flcancel) {
			if (!flcancel) {
				$("#idTitleViewer").text (title);
				appPrefs.postStruct.title = title; 
				blogDataChanged ();
				updateBlogPost (appPrefs.postStruct, function (postStruct) {
					appPrefs.postStruct = postStruct;
					viewPostsBrowser ();
					});
				}
			});
		}
	function editBlogPost (path, callback) {
		var params = {
			domain: appConsts.myBlogDomain,
			path: path
			}
		serverCall ("getpost", params, function (err, jsontext) {
			var jstruct = JSON.parse (jsontext);
			console.log ("editBlogPost: jsontext == " + jsontext);
			appPrefs.postStruct = jstruct;
			prefsChanged ();
			me.callbacks.startEditor (jstruct);
			if (callback !== undefined) {
				callback ();
				}
			});
		}
	function viewPostsBrowser (idOutlineViewer, clickCallback) { //feature turned off -- 10/1/18 by DW
		}
	function openPostOnGitHub () {
		window.open (appPrefs.postStruct.urlGitHub);
		}
	function buildRssOnServer () {
		var whenstart = new Date ();
		var params = {
			domain: appConsts.myBlogDomain,
			accessToken: appPrefs.accessToken,
			msg: appPrefs.commitMessage,
			name: appPrefs.userInfo.name,
			email: appPrefs.userInfo.email
			};
		serverCall ("buildrss", params, function (err, jsontext) {
			if (err) {
				console.log ("buildRssOnServer: err.message == " + err.message);
				}
			else {
				blogData.stats.ctRssBuilds++;
				blogData.stats.whenLastRssBuild = new Date ();
				blogData.stats.ctSecsLastRssBuild = secondsSince (whenstart);
				try {
					var jstruct = JSON.parse (jsontext);
					blogData.stats.urlFeed = jstruct.urlPublic;
					console.log ("buildRssOnServer: jstruct == " + jsonStringify (jstruct));
					blogDataChanged ();
					}
				catch (err) {
					console.log ("buildRssOnServer: jstruct == " + err.message);
					blogDataChanged ();
					}
				}
			});
		}
	function getPostListHtml (clickCallback, callback) {
		var flatPostList = getPostList ();
		const maxCharsFileTitle = 35;
		var htmltext = "", indentlevel = 0;
		function getLineText (item) {
			var script = clickCallback + " ('" + item.path + "')", addclass = "";
			var title = maxStringLength (item.title, maxCharsFileTitle);
			if (item.path == appPrefs.postStruct.path) {
				addclass = " aPostBeingEdited ";
				}
			var theLink = "<a class=\"aOpenGitHubDoc " + addclass + "\" onclick=\"" + script + "\">" + title + "</a>";
			return (theLink);
			
			
			
			var theIcon = "<i class=\"far fa-file-alt\"></i>";
			var theLinetext = "<div class=\"divOpenFileItem\">" + theIcon + "</div><div class=\"divOpenFileItem\">" + theLink + "</div>";
			return (theLinetext);
			}
		function add (s) {
			htmltext += s + "\n";
			}
		for (var i = 0; i < flatPostList.length; i++) {
			var item = flatPostList [i];
			add ("<li>" + getLineText (item) + "</li>");
			}
		callback (htmltext);
		}
	function buildPostList (idPostList, callback) {
		var postList = getPostList ();
		var unorderedList = $("#" + idPostList);
		unorderedList.empty ();
		for (var i = 0; i < postList.length; i++) {
			let item = postList [i];
			var listItem = $("<li></li>");
			var anchor = $("<a></a>");
			
			if (appPrefs.postStruct !== undefined) { //11/8/21 by DW
				if (item.path == appPrefs.postStruct.path) {
					anchor.addClass ("aPostBeingEdited");
					}
				}
			
			anchor.click (function (event) { 
				event.preventDefault ();
				if (callback !== undefined) {
					callback (item.path);
					}
				else {
					editBlogPost (item.path, function () {
						buildPostList (idPostList, callback); //highlighted post changed
						});
					}
				console.log ("buildPostList: item.path == " + item.path);
				});
			anchor.text (item.title);
			listItem.append (anchor);
			unorderedList.append (listItem);
			}
		}
	
	function everyMinute () {
		var now = new Date ();
		console.log ("\neveryMinute: " + now.toLocaleTimeString () + ", v" + appConsts.version);
		}
	function everyFiveSeconds () {
		if (flRssFeedChanged) {
			flRssFeedChanged = false;
			buildRssOnServer ();
			}
		}
	function everySecond () {
		var now = clockNow ();
		if (flPrefsChanged) {
			savePrefsToLocalStorage ();
			flPrefsChanged = false;
			}
		if (flBlogDataChanged) {
			saveBlogData ();
			flBlogDataChanged = false;
			}
		me.callbacks.everySecond ();
		}
	
	for (var x in userConsts) {
		appConsts [x] = userConsts [x];
		}
	
	this.userIsSignedOn = userIsSignedOn;
	this.connectWithGitHub = connectWithGitHub;
	this.disconnectFromGitHub = disconnectFromGitHub;
	this.getBlogData = function () {
		return (blogData);
		};
	this.setBlogDataElements = function (theElements) {
		console.log ("setBlogDataElements: theElements == " + jsonStringify (theElements));
		for (x in theElements) {
			blogData [x] = theElements [x];
			}
		blogDataChanged ();
		},
	this.prefsChanged = prefsChanged;
	this.getCurrentPost = function () {
		return (appPrefs.postStruct);
		};
	this.newBlogPost = newBlogPost;
	this.updateBlogPost = updateBlogPost;
	this.editBlogPost = editBlogPost;
	this.saveEditorStatus = saveEditorStatus;
	this.savePost = function (editorData, callback) {
		saveEditorStatus (editorData); 
		updateBlogPost (appPrefs.postStruct, callback);
		}
	this.getPostList = function (callback) {
		callback (getPostList ());
		}
	this.buildPostList = buildPostList;
	this.viewTemplateOnGitHub = viewTemplateOnGitHub;
	this.openPostOnGitHub = openPostOnGitHub;
	this.repoGet = repoGet;
	this.repoSave = repoSave;
	this.getGitHubUserInfo = function () {
		return (appPrefs.userInfo);
		};
	this.callbacks = {
		startEditor: function (postStruct) {
			},
		everySecond: function () {
			},
		postUpdated: function (postStruct) {
			}
		};
	
	this.start = function (callback) {
		function docallback (flConnected) {
			if (callback !== undefined) {
				callback (flConnected);
				}
			}
		
		getPrefsFromLocalStorage ();
		
		var accessToken = getURLParameter ("access_token");
		if (accessToken != "null") {
			appPrefs.accessToken = accessToken;
			savePrefsToLocalStorage ();
			window.location.replace (window.location.href.substr (0, window.location.href.search ("\\?"))); 
			return;
			}
		
		if (appPrefs.accessToken !== undefined) {
			getGitHubUserInfo (function () {
				if (userIsSignedOn ()) {
					getBlogData (function () {
						getServerDomains (function () {
							getRepoLoc ("/template/template.txt", function (err, url) {
								if (url !== undefined) {
									appPrefs.urlTemplate = url;
									prefsChanged ();
									}
								});
							if (appPrefs.postStruct !== undefined) {
								me.callbacks.startEditor (appPrefs.postStruct);
								}
							self.setInterval (everySecond, 1000); 
							self.setInterval (everyFiveSeconds, 5000); 
							runEveryMinute (everyMinute);
							docallback (true);
							});
						});
					}
				else {
					docallback (false);
					}
				});
			}
		else {
			docallback (false);
			}
		}
	};
