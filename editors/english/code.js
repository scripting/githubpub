var appConsts = {
	productnameForDisplay: "English",
	idGitHubClient: "475311614ae9d26e29e9",
	
	flLocalServer: false, //10/30/18 by DW
	
	myServerAddress: "http://english.scripting.com/",
	myBlogDomain: "englishblog1.scripting.com", //an index into the server's domains object
	
	
	defaultEditorButtons: ["bold", "italic", "anchor", "h3", "h4", "orderedlist", "unorderedlist", "quote"],
	
	blogDataPath: "data.json",
	blogPostsPath: "posts/",
	blogRssPath: "rss.xml",
	
	placeholders: {
		title: "",
		description: "",
		body: ""
		},
	
	version: "0.4.20"
	};
var appPrefs = {
	flAutoSave: true,
	lastPostTitle: ""
	}

var myGitHubPubApp = undefined;

var whenLastPostChange = new Date (), flPostChanged = false, whenLastAutoSave = new Date ();
var editorTitle, editorDescription, editorBody;
var editorValues = {
	title: undefined,
	description: undefined,
	text: undefined
	};
var flEditorValuesChanged = false;


function setServerConsts () { //10/30/18 by DW
	if (appConsts.flLocalServer) {
		appConsts.myServerAddress = "http://127.0.0.1:1402/";
		appConsts.myBlogDomain = "localhost";
		}
	else {
		appConsts.myServerAddress = "http://english.scripting.com/";
		appConsts.myBlogDomain = "englishblog1.scripting.com"; //an index into the server's domains object
		}
	}
function testRepoGetSave () { //testing repoget and reposave -- 10/26/18 by DW
	var username = "scripting";
	var repo = "test1";
	var path = "demodoc.md";
	myGitHubPubApp.repoGet (username, repo, path, undefined, function (err, data) {
		myGitHubPubApp.repoSave (username, repo, path, data.toUpperCase (), undefined, function (err, data) {
			console.log (data);
			});
		});
	}
function updateSaveStatus () {
	var s = "SAVED";
	if (flEditorValuesChanged) {
		s = "<div style=\"color: silver\">NOT " + s + "</div>";
		}
	else {
		s = "<div style=\"color: black\">" + s + "</div>";
		}
	if ($("#idSaveStatus").html () != s) {
		$("#idSaveStatus").html (s);
		$("#idSaveStatus").css ("display", "block");
		}
	}
function applyPrefs () {
	prefsChanged ();
	}
function markdownProcess (s) {
	var md = new Markdown.Converter ();
	return (md.makeHtml (s));
	}
function testPasteHTML () {
	var options = {
		forcePlainText: false,
		cleanPastedHTML: false,
		};
	editorBody.pasteHTML ("<iframe width=\"420\" height=\"315\" src=\"https://www.youtube.com/embed/nlaoR5m4L80\" frameborder=\"0\" allowfullscreen></iframe>", options);
	}
function updatePreviewVisibility () {
	var flVisible = $("#idPreviewContainer").css ("display") == "block";
	if (flVisible !== appPrefs.flMarkdownPreview) {
		var val = (appPrefs.flMarkdownPreview) ? "block" : "none";
		$("#idPreviewContainer").css ("display", val);
		}
	}
function updateIconValues () { //10/20/18 by DW
	var postStruct = myGitHubPubApp.getCurrentPost ();
	function setIcon (id, val) {
		if ($("#" + id).attr ("href") != val) {
			$("#" + id).attr ("href", val);
			}
		}
	setIcon ("idEyeIconAnchor", postStruct.urlPublic);
	setIcon ("idGitHubIconAnchor", postStruct.urlGitHub);
	
	var blogData = myGitHubPubApp.getBlogData ();
	setIcon ("idFeedIconAnchor", blogData.stats.urlFeed);
	}
function updatePostButton () {
	var flVisible = $("#idPostButton").css ("display") == "inline-block";
	if (flVisible == appPrefs.flAutoSave) {
		var val = (appPrefs.flAutoSave) ? "none" : "inline-block";
		$("#idPostButton").css ("display", val);
		}
	}
function enableInsertHtmlCommand () {
	}
function insertHtmlCommand () {
	var prompt = "Enter the HTML text you want to insert:";
	var placeholder = "Tags and text and other stuff that goes in web pages.";
	var replaceTable = {
		"<script": "&lt;script",
		"</script": "&lt;/script"
		};
	var pasteOptions = {
		forcePlainText: false,
		cleanPastedHTML: false,
		};
	askDialog (prompt, appPrefs.lastInsertedHtmltext, placeholder, function (htmltext, flcancel) {
		if (!flcancel) {
			htmltext = multipleReplaceAll (htmltext, replaceTable, false);
			$("#idBodyEditor").focus ();
			editorBody.pasteHTML (htmltext, pasteOptions);
			appPrefs.lastInsertedHtmltext = htmltext; 
			prefsChanged ();
			}
		});
	}
function newBlogPostCommand () {
	askDialog ("Title for new post?", appPrefs.lastPostTitle, "Enter title for post here.", function (title, flcancel) {
		if (!flcancel) {
			appPrefs.lastPostTitle = title; 
			myGitHubPubApp.prefsChanged ();
			myGitHubPubApp.newBlogPost (title)
			}
		});
	}
function buildHistoryMenu () {
	myGitHubPubApp.buildPostList ("idHistoryMenuList")
	}
function showHideEditor () {
	var flSignedOn = myGitHubPubApp.userIsSignedOn ();
	function makeVisible (id, flVisible) {
		var val = (flVisible) ? "block" : "none";
		if ($("#" + id).css ("display") != val) { //avoid flashing in debugger
			$("#" + id).css ("display", val);
			}
		}
	makeVisible ("idSignOnContainer", !flSignedOn);
	makeVisible ("idEditorContainer", flSignedOn);
	}
function connectButtonClick () {
	myGitHubPubApp.connectWithGitHub ();
	showHideEditor ();
	}
function toggleGitHubConnection () {
	if (myGitHubPubApp.userIsSignedOn ()) {
		confirmDialog ("Sign off GitHub?", function () {
			myGitHubPubApp.disconnectFromGitHub ();
			showHideEditor ();
			});
		}
	else {
		myGitHubPubApp.connectWithGitHub ();
		showHideEditor ();
		}
	}
function updateGitHubMenuItem () {
	var menustring = (myGitHubPubApp.userIsSignedOn ()) ? "Sign off GitHub..." : "Sign on GitHub...";
	if ($("#idGitHubConnectMenuItem").text () != menustring) {
		$("#idGitHubConnectMenuItem").text (menustring);
		}
	}
function updateGitHubUserName () {
	if (myGitHubPubApp.userIsSignedOn ()) {
		$("#idGitHubUserName").html ("<i class=\"fa fa-github\"></i>&nbsp;" + myGitHubPubApp.getGitHubUserInfo ().login);
		}
	}
function settingsCommand () {
	var blogData = myGitHubPubApp.getBlogData ();
	appPrefs.title = blogData.title;
	appPrefs.description = blogData.description;
	appPrefs.language = blogData.language;
	prefsDialogShow (function () {
		myGitHubPubApp.setBlogDataElements ({
			title: appPrefs.title,
			description: appPrefs.description,
			language: appPrefs.language
			});
		});
	}
function viewTemplateOnGitHub () {
	myGitHubPubApp.viewTemplateOnGitHub ();
	}
function openPostOnGitHub () {
	myGitHubPubApp.openPostOnGitHub ();
	}
function editorValuesChanged () {
	flEditorValuesChanged = true;
	whenLastPostChange = new Date ();
	updateSaveStatus ();
	}
function setEditorValue (name, val) {
	if (editorValues [name] != val) {
		editorValues [name] = val; 
		editorValuesChanged ();
		}
	}
function startEditor (postStruct) {
	editorValues.title = postStruct.title;
	editorValues.description = postStruct.description;
	editorValues.text = postStruct.text;
	
	$("#idTitleEditor").html (postStruct.title);
	editorTitle = new MediumEditor (".divTitleEditor", {
		placeholder: {
			text: appConsts.placeholders.title
			},
		toolbar: {
			buttons: appConsts.defaultEditorButtons,
			},
		buttonLabels: "fontawesome",
		imageDragging: false, 
		disableReturn: true,
		extensions: {
			markdown: new MeMarkdown (function (md) {
				setEditorValue ("title", stripMarkup (md));
				})
			}
		});
	
	$("#idDescriptionEditor").html (postStruct.description);
	editorDescription = new MediumEditor (".divDescriptionEditor", {
		placeholder: {
			text: appConsts.placeholders.description
			},
		toolbar: {
			buttons: appConsts.defaultEditorButtons,
			},
		buttonLabels: "fontawesome",
		imageDragging: false, 
		disableReturn: true,
		extensions: {
			markdown: new MeMarkdown (function (md) {
				setEditorValue ("description", stripMarkup (md));
				})
			}
		});
	
	$("#idBodyEditor").html (markdownProcess (postStruct.text));
	editorBody = new MediumEditor (".divBodyEditor", {
		placeholder: {
			text: appConsts.placeholders.body
			},
		toolbar: {
			buttons: appConsts.defaultEditorButtons,
			},
		buttonLabels: "fontawesome",
		imageDragging: false, 
		autoLink: true,
		extensions: {
			markdown: new MeMarkdown (function (md) {
				setEditorValue ("text", md);
				$("#idPreview").text (md);
				})
			}
		});
	
	updateIconValues (); //10/20/18 by DW
	
	}
function initMenus () {
	var cmdKeyPrefix = getCmdKeyPrefix (); //10/6/14 by DW
	$("#idMenuProductName").text (appConsts.productnameForDisplay);
	updateGitHubMenuItem ();
	$("#idVersionNumber").text ("v" + appConsts.version);
	$("#idMenubar .dropdown-menu li").each (function () {
		var li = $(this);
		var liContent = li.html ();
		liContent = liContent.replace ("Cmd-", cmdKeyPrefix);
		li.html (liContent);
		});
	}
function everySecond () {
	if (flEditorValuesChanged) {
		myGitHubPubApp.saveEditorStatus (editorValues); //save locally, not on the server
		if (appPrefs.flAutoSave) { 
			if (secondsSince (whenLastPostChange) >= 1) {
				flEditorValuesChanged = false;
				myGitHubPubApp.savePost (editorValues, function () {
					whenLastAutoSave = new Date ();
					updateSaveStatus ();
					});
				}
			}
		}
	updatePreviewVisibility ();
	updatePostButton ();
	updateIconValues ();
	updateGitHubMenuItem ();
	}
function startup () {
	console.log ("startup");
	setServerConsts (); //10/30/18 by DW
	myGitHubPubApp = new githubpubApp (appConsts, appPrefs);
	initMenus ();
	myGitHubPubApp.callbacks.everySecond = everySecond;
	myGitHubPubApp.callbacks.startEditor = startEditor;
	myGitHubPubApp.callbacks.postUpdated = function (postStruct) {
		console.log ("myGitHubPubApp.callbacks.postUpdated: postStruct == " + postStruct.title);
		buildHistoryMenu ();
		};
	myGitHubPubApp.start (function () {
		showHideEditor ();
		if (myGitHubPubApp.userIsSignedOn ()) {
			updateGitHubUserName ();
			buildHistoryMenu ();
			}
		initGoogleAnalytics (); 
		hitCounter (); 
		});
	}
