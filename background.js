/**
* Variables
*/
var tabList = Object(),
    urlList = Object(),
	mostRecentComment,
	clickFlag,
	requestFilter,
	requestOptions;


/**
* Listener Callbacks
*/

var pageActionListener = function(tab) {
	var commentURL,
		tabId,
		tabName;

	// retrieve comment from tabList
	tabId 	   = tab.id;
	tabName    = "tab_" + tabId;
	commentURL = tabList[ tabName ];

	// save comment URL to window object
	chrome.tabs.executeScript(tabId, {
		code: "window.postMessage( {commentURL: '" + commentURL + "'}, '*' );"
	}, null);
}

var messageListener = function(message, sender, sendResponse) {

    // Sets flag to show that HN link has been clicked but tab update
    // event hasn't yet occurred
    clickFlag = true;
    // gets URL sent from HN and saves it ready for tab update event
    mostRecentComment = message;
	
}

var tabUpdateListener = function(tabId, changeInfo, tab) {
	var isLoading,
		tabName,
        hasLoaded;

    // check that event is a load event.
	isLoading = changeInfo.status == "loading";
    hasLoaded = urlList[ tab.url ];

    // Check that this is the first tab to appear since HN post was clicked.
    if ( clickFlag && isLoading ) {

        // add comment url to tab object.
		tabName = "tab_" + tabId;
        tabList[ tabName ] = mostRecentComment;
        urlList[ tab.url ] = mostRecentComment;

        prepPostPage( tabId );

	} else if ( isLoading && hasLoaded ) {
        
        prepPostPage( tabId );

    }
}


/**
* Functions
*/
var stripHeaders = function( info ) {
    var headers = info.responseHeaders;
    for (var i=headers.length-1; i>=0; --i) {
        var header = headers[i].name.toLowerCase();
        if (header == 'x-frame-options' || header == 'frame-options') {
            headers.splice(i, 1); // Remove header
        }
    }
    return {responseHeaders: headers};
}

var prepPostPage = function( tabId ) {
    
    // inject.js
    chrome.tabs.executeScript(tabId, { 
      code: "document.head.appendChild(document.createElement('script')).src='" + 
        chrome.extension.getURL("inject.js") +"';"
    }, null);
    
    // show page action
    chrome.pageAction.show( tabId );

    // turn clickFlag off 
    clickFlag = false;
}


/**
* Listeners
*/
// Add listener for pageaction
chrome.pageAction.onClicked.addListener( pageActionListener );
// listens for messages passed when chrome storage is altered
chrome.runtime.onMessage.addListener( messageListener );
// tab change listener runs URL checking function
chrome.tabs.onUpdated.addListener( tabUpdateListener );


/**
* Strip headers
* allows HN comment pages to be loaded in a frame
*/
requestFilter = {
    urls: [ '*://*/*' ], // Pattern to match all http(s) pages
    types: [ 'sub_frame' ]
};
// make request blocking
requestOptions = ['blocking', 'responseHeaders'];
// webRequest listener strips out yt headers preventing iframe loading
chrome.webRequest.onHeadersReceived.addListener( stripHeaders, requestFilter, requestOptions );
