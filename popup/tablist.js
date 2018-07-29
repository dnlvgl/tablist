/*
window.onload = function() {
    console.log('test');
};
*/

function logTabs(tabs) {
    const popupList = document.getElementById('tablist-container');
    let urlList = [];

    // get all tab URLs and push to array
    for (let tab of tabs) {
      // tab.url requires the `tabs` permission
      urlList.push(tab.url);
    }

    // append URLs as li items to popup
    urlList.forEach(function(url) {
	const listItem = document.createElement('li');
	listItem.appendChild(document.createTextNode(url));
	popupList.appendChild(listItem);
    });   
}

function onError(error) {
  console.log(`Error: ${error}`);
}

const querying = browser.tabs.query({});
querying.then(logTabs, onError);
