/**
* Flags
*/
var blockLinks = 0, // block default link action
	devNotice = 1;  // show dev notice

if (devNotice) console.log("Do things that relate to hacker news.");

function addDataToStore( linkURL, discussionURL ) {
	// create object containing data to be saved
	var hnPageObject = {
		"linkURL": linkURL, 
		 "discussionURL": discussionURL
	};

	chrome.storage.local.set( hnPageObject );	
}

function getCommentURL( linkToPost ) {
	var postCell = linkToPost.parentNode,
		postRow = postCell.parentNode,
		commentRow = postRow.nextElementSibling,
		commentLink = commentRow.querySelector("a:last-child"),
		commentURL = commentLink.getAttribute("href");

	return commentURL;
}

function onLinkClick(e) {
	var linkURL,
		discussionURL;

	// prevent default action if flag active.
	if(blockLinks) e.preventDefault();

	// get url of post and discussion
	linkURL = this.getAttribute("href");
	discussionURL = getCommentURL(this);

	addDataToStore( linkURL, discussionURL );
}

function nodelistToArray( nodelist ) {
	var array = [];

	for (var i = 0; i < nodelist.length; i++ ) 
		array.push( nodelist[i] );

	return array;
}


var linkList,
	linkArray;

// grab all links including "more" link and convert to array.
linkList = document.querySelectorAll("td.title a");
linkArray = nodelistToArray(linkList);

// remove the last element ("more" link)
linkArray.splice(31, 1);

for ( var i = 0; i < linkArray.length; i++ ) {
	linkArray[i].addEventListener( "click", onLinkClick, false );
}