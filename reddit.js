(function(window, document){
	/**
	* Variables
	*/
	var linkList,
		linkArray,
		commentLinkArray;

	/**
	* Functions
	*/

	// convert nodeList to array
	var nodelistToArray = function( nodelist ) {
		var array = [];

		for (var i = 0; i < nodelist.length; i++ ) {
			var currentPost = nodelist[i];  // the node for the current post
			
			// Add node to array
			array.push( currentPost );
		}

		return array;
	}

	// send comment url
	var messenger = function( message ) {
		chrome.runtime.sendMessage( message );
	}

	// gets comment link for single post link.
	var addCommentListener = function ( linkToPost ) {
		var postRow,
			commentRow,
			commentLink,
			commentURL;


		postRow = linkToPost.parentNode.parentNode;
		commentLink = postRow.querySelector(".flat-list.buttons li.first a");  // go to next row (containing comment)
		commentURL = commentLink.getAttribute("href");	// get the href attribute of comment link

		linkToPost.addEventListener( "click", messenger.bind( null, commentURL ), false);
	}


	/**
	* Events
	*/
	// grab all links including "more" link and convert to array of objects
	linkList = document.querySelectorAll( ".thing .title a.title" );
	linkArray = nodelistToArray( linkList );

	// loop over all post links, get their comments and
	// add event listener.
	linkArray.forEach( addCommentListener );
})(window, document);