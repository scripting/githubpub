var appConsts = {
	productnameForDisplay: "English",
	idGitHubClient: "475311614ae9d26e29e9",
	
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
	
	version: "0.4.15"
	};
var appPrefs = {
	lastInsertedHtmltext: undefined
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
function postListButtonClick () {
	$("#idPostListButton").blur ();
	myGitHubPubApp.getPostListHtml ("myGitHubPubApp.editBlogPost", function (htmltext) {
		$("#idPostList").html (htmltext);
		});
	}
function everySecond () {
	myGitHubPubApp.saveEditorStatus (getPostData ()); //save locally, not on the server
	}
function startup () {
	console.log ("startup");
	myGitHubPubApp = new githubpubApp (appConsts, appPrefs);
	myGitHubPubApp.everySecond = everySecond;
	myGitHubPubApp.startEditor = function (postStruct) {
		console.log ("startEditor: postStruct == " + jsonStringify (postStruct));
		$("#idTitleEditor").val (postStruct.title);
		$("#idDescriptionEditor").val (postStruct.description);
		$("#idBodyEditor").val (postStruct.text);
		}
	myGitHubPubApp.start (function () {
		showHideEditor ();
		initGoogleAnalytics (); 
		hitCounter (); 
		});
	}
