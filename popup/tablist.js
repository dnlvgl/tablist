/*
window.onload = function() {
    console.log('test');
};
*/

// get array of tabs call event listeners (aka main function)
const logTabs = (tabs) => {
    const popupList = document.querySelector('.tablist-items');

    // get all tab URLs and render list
    for (let tab of tabs) {
        createTabList(tab, popupList);  
    }

    // creat eventListeners
    tabListEvents();
};

// create list item and append it to popup
const createTabList = (tab, popupList) => {
    const listItemInput = document.createElement('input');
    listItemInput.setAttribute('type', 'checkbox');
    listItemInput.setAttribute('id', tab.id);
    listItemInput.setAttribute('name', 'tab');
    listItemInput.setAttribute('value', tab.url);

    const listItemLabel = document.createElement('label');
    listItemLabel.setAttribute('for', tab.id);
    listItemLabel.appendChild(document.createTextNode(tab.title));

    const listItem = document.createElement('li');
    listItem.setAttribute('class', 'tablist-checkbox-wrapper');
    listItem.appendChild(listItemInput);
    listItem.appendChild(listItemLabel);

    popupList.appendChild(listItem);
};

// create all needed event listeners
const tabListEvents = () => {
    // add event listener on wrapper and check for class?
    const toggleSelect = document.getElementById('selectAll'),
          deleteBtn = document.querySelector('.tablist-delete-btn'),
          exportBtn = document.querySelector('.tablist-export-btn'),
          listBtn = document.querySelector('.tablist-list-btn');

    // check or uncheck all items in tablist
    toggleSelect.addEventListener('click', (event) => {
        // TODO: save all previosly checked?
        const checkAllItems = event.target.checked;
        const checkboxes = Array.from(document.getElementsByName('tab'));
        checkboxes.map(checkbox => {
            if(checkAllItems) {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }
        });
    });

    // collect and delete all checked items
    deleteBtn.addEventListener('click', () => {
        console.log('click delete');
        const checkboxes = Array.from(document.getElementsByName('tab'));
        let selectedTabIds = [];
        checkboxes.map(checkbox => {
            if(checkbox.checked) {
                console.log(checkbox);
                selectedTabIds.push(parseInt(checkbox.id));
            }
        });
        const removing = browser.tabs.remove(selectedTabIds);
        removing.then(closePopup, onError);
    });

    exportBtn.addEventListener('click', () => {
        console.log('click export');
        const checkboxes = Array.from(document.getElementsByName('tab'));
        let selectedTabUrls = [];
        checkboxes.map(checkbox => {
            if(checkbox.checked) {
                selectedTabUrls.push(checkbox.value);
            }
        });
        const creating = browser.tabs.create({
            // data urls not possible: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/create
            // add array to storage and retrieve it on new site:
            // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage
            // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Extension_pages
            //url:'data:text/plain;charset=utf-8;base64,' + btoa(selectedTabUrls.join(''))
        });
        //creating.then(closePopup, onError);
    });
};

const closePopup = () => {
    console.log('done, closing');
    window.close();  
};

const onError = (error) => {
  console.log(`Error: ${error}`);
};

const querying = browser.tabs.query({});
querying.then(logTabs, onError);
