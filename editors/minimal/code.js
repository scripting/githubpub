var appConsts = {
	productnameForDisplay: "English",
	idGitHubClient: "475311614ae9d26e29e9",
	
	myServerAddress: "http://english.scripting.com/",
	myBlogDomain: "englishblog1.scripting.com", //an index into the server's domains object
	
	blogDataPath: "data.json",
	blogPostsPath: "posts/",
	blogRssPath: "rss.xml",
	
	version: "0.4.0"
	};
var appPrefs = {
	lastPostTitle: undefined
	}

var whenLastPostChange = new Date (), whenLastSave = new Date (0);
var myGitHubPubApp;

function getPostData () {
	return ({
		title: $("#idTitleEditor").val (),
		description: $("#idDescriptionEditor").val (),
		text: $("#idBodyEditor").val ()
		});
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
function connectWithGitHub () {
	$("#idSignOnButton").blur ();
	myGitHubPubApp.connectWithGitHub ();
	showHideEditor ();
	}
function disconnectFromGitHub () {
	$("#idSignOffButton").blur ();
	myGitHubPubApp.disconnectFromGitHub ();
	showHideEditor ();
	}
function saveButtonClick () {
	$("#idSaveButton").blur ();
	myGitHubPubApp.savePost (getPostData (), function () {
		console.log ("myGitHubPubApp.savePost returned");
		whenLastSave = new Date ();
		});
	}
function updatePostList () {
	myGitHubPubApp.buildPostList ("idPostList")
	}
function newPostButtonClick () {
	askDialog ("Title for new post?", appPrefs.lastPostTitle, "You can leave it empty if you like.", function (title, flcancel) {
		if (!flcancel) {
			appPrefs.lastPostTitle = title; 
			myGitHubPubApp.prefsChanged ();
			myGitHubPubApp.newBlogPost (title)
			}
		});
	}
function updateIconValues () { 
	function setIcon (id, val) {
		if ($("#" + id).attr ("href") != val) {
			$("#" + id).attr ("href", val);
			}
		}
	var postStruct = myGitHubPubApp.getCurrentPost ();
	setIcon ("idEyeIconAnchor", postStruct.urlPublic);
	setIcon ("idGitHubIconAnchor", postStruct.urlGitHub);
	}
function everySecond () {
	myGitHubPubApp.saveEditorStatus (getPostData ()); //save locally, not on the server
	updateIconValues ();
	}
function startup () {
	console.log ("startup");
	myGitHubPubApp = new githubpubApp (appConsts, appPrefs);
	myGitHubPubApp.callbacks.everySecond = everySecond;
	myGitHubPubApp.callbacks.startEditor = function (postStruct) {
		console.log ("startEditor: postStruct == " + jsonStringify (postStruct));
		$("#idTitleEditor").val (postStruct.title);
		$("#idDescriptionEditor").val (postStruct.description);
		$("#idBodyEditor").val (postStruct.text);
		};
	myGitHubPubApp.callbacks.postUpdated = function (postStruct) {
		console.log ("myGitHubPubApp.callbacks.postUpdated: postStruct == " + jsonStringify (postStruct));
		updatePostList ();
		};
	myGitHubPubApp.start (function () {
		showHideEditor ();
		updatePostList ();
		initGoogleAnalytics (); 
		hitCounter (); 
		});
	}
