// get array of tabs, call event listeners (aka main function)
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
    const fallbackFavIcon = '../icons/globe.svg';
    const markup = `
        <div class="panel-list-item tablist-checkbox-wrapper">
          <div class="icon">
          </div>
          <div class="text">
              <div class="checkboxItem">
                  <input type="checkbox" id="${tab.id}" value="${tab.url}" title="${tab.title}" name="tab"/>
                  <label for="${tab.id}" title="${tab.title}">
                     <img class="favicon" src="${tab.favIconUrl ? tab.favIconUrl : fallbackFavIcon}">
                  ${tab.title}</label>
              </div>
          </div>
          <div class="text-shortcut"></div>
        </div>
    `;

    // use DomParser to append nodes
    const parser = new DOMParser();
    const parsed = parser.parseFromString(markup, 'text/html');
    // get outer div
    const listItems = parsed.getElementsByTagName('div');
    for (const item of listItems) {
        popupList.appendChild(item);
    };
};

// create all needed event listeners
const tabListEvents = () => {
    // add event listener on wrapper and check for class?
    const toggleSelect = document.getElementById('selectAll'),
        deleteBtn = document.querySelector('.tablist-delete-btn'),
        exportBtn = document.querySelector('.tablist-export-btn')

    // check or uncheck all items in tablist
    toggleSelect.addEventListener('click', (event) => {
        const checkAllItems = event.target.checked;
        const checkboxes = Array.from(document.getElementsByName('tab'));
        checkboxes.map(checkbox => {
            if (checkAllItems) {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }
        });
    });

    // collect and delete all checked items
    deleteBtn.addEventListener('click', () => {
        const checkboxes = Array.from(document.getElementsByName('tab'));
        let selectedTabIds = [];
        checkboxes.map(checkbox => {
            if (checkbox.checked) {
                console.log(checkbox);
                selectedTabIds.push(parseInt(checkbox.id));
            }
        });
        browser.tabs.remove(selectedTabIds)
            .then(closePopup, onError);
    });

    // export all checked items as links in new tab
    exportBtn.addEventListener('click', () => {
        const checkboxes = Array.from(document.getElementsByName('tab'));
        let selectedTabUrls = {
            urls: []
        };

        checkboxes.map(checkbox => {
            if (checkbox.checked) {
                selectedTabUrls.urls.push(checkbox.value);
            }
        });

        // save urls in storage to retrieve in new tab
        browser.storage.local.set({ selectedTabUrls })
            .then(createNewTab, onError);
    });
};

// open new tab with extension page as target
const createNewTab = () => {
    browser.tabs.create({
        url: '../tablist/tablist.html'
    })
        .then(closePopup, onError);
};

const closePopup = () => {
    window.close();
};

const onError = (error) => {
    console.log(`Error: ${error}`);
};

browser.tabs.query({})
    .then(logTabs, onError);
