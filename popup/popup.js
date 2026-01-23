// get array of tabs, call event listeners (aka main function)
const logTabs = (tabs) => {
  const popupList = document.querySelector('.tablist-items');

  // get all tab URLs and render list
  for (const tab of tabs) {
    createTabList(tab, popupList);
  }

  // create eventListeners
  tabListEvents();
};

// create list item and append it to popup
const createTabList = (tab, popupList) => {
  const fallbackFavIcon = '../icons/globe-16.svg';
  const hasFavIcon = tab.favIconUrl;
  const faviconClass = hasFavIcon ? 'favicon' : 'favicon favicon-fallback';
  const escapedTitle = tab.title.replace(/"/g, '&quot;');
  const escapedUrl = tab.url.replace(/"/g, '&quot;');
  const markup = `
        <div class="panel-list-item tablist-checkbox-wrapper">
           <div class="checkboxItem">
               <input type="checkbox" id="${tab.id}" data-title="${escapedTitle}" data-url="${escapedUrl}" title="${escapedTitle}" name="tab"/>
               <label for="${tab.id}" title="${escapedTitle}">
                  <img class="${faviconClass}" src="${hasFavIcon ? tab.favIconUrl : fallbackFavIcon}">
                  <span class="label-text"> ${tab.title}</span>
               </label>
            </div>
        </div>
    `;

  // use DOMParser to append nodes
  const parser = new DOMParser();
  const parsed = parser.parseFromString(markup, 'text/html');
  // get outer div
  const listItems = parsed.getElementsByTagName('div');
  for (const item of listItems) {
    popupList.appendChild(item);
  }
};

// format link based on selected format
const formatLink = (title, url, format) => {
  switch (format) {
    case 'orgmode':
      return `[[${url}][${title}]]`;
    case 'plain':
      return url;
    default:
      return `[${title}](${url})`;
  }
};

// create all needed event listeners
const tabListEvents = () => {
  // add event listener on wrapper and check for class?
  const toggleSelect = document.getElementById('selectAll'),
    deleteBtn = document.querySelector('.tablist-delete-btn'),
    exportBtn = document.querySelector('.tablist-export-btn'),
    buttonsFooter = document.querySelector('.tablist-buttons'),
    confirmFooter = document.querySelector('.tablist-confirm'),
    cancelBtn = document.querySelector('.tablist-cancel-btn'),
    confirmBtn = document.querySelector('.tablist-confirm-btn'),
    tabCountSpan = document.querySelector('.tab-count'),
    formatSelect = document.getElementById('exportFormat');

  // load saved format preference
  browser.storage.local.get('exportFormat').then((result) => {
    if (result.exportFormat) {
      formatSelect.value = result.exportFormat;
    }
  }, onError);

  // save format preference when changed
  formatSelect.addEventListener('change', () => {
    browser.storage.local.set({ exportFormat: formatSelect.value });
  });

  let selectedTabIds = [];

  const getSelectedTabIds = () => {
    const checkboxes = Array.from(document.getElementsByName('tab'));
    return checkboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => parseInt(checkbox.id, 10));
  };

  const showConfirmation = () => {
    buttonsFooter.classList.add('hidden');
    confirmFooter.classList.remove('hidden');
  };

  const hideConfirmation = () => {
    confirmFooter.classList.add('hidden');
    buttonsFooter.classList.remove('hidden');
  };

  // check or uncheck all items in tablist
  toggleSelect.addEventListener('click', (event) => {
    const checkAllItems = event.target.checked;
    const checkboxes = Array.from(document.getElementsByName('tab'));
    checkboxes.forEach((checkbox) => {
      checkbox.checked = checkAllItems;
    });
  });

  // show confirmation before deleting
  deleteBtn.addEventListener('click', () => {
    selectedTabIds = getSelectedTabIds();
    if (selectedTabIds.length === 0) return;

    tabCountSpan.textContent = selectedTabIds.length;
    showConfirmation();
  });

  // cancel confirmation
  cancelBtn.addEventListener('click', hideConfirmation);

  // confirm and delete tabs
  confirmBtn.addEventListener('click', () => {
    if (selectedTabIds.length > 0) {
      browser.tabs.remove(selectedTabIds).then(closePopup, onError);
    }
  });

  // export all checked items as links in new tab
  exportBtn.addEventListener('click', () => {
    const checkboxes = Array.from(document.getElementsByName('tab'));
    const format = formatSelect.value;
    const selectedTabs = {
      links: [],
    };

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const title = checkbox.dataset.title;
        const url = checkbox.dataset.url;
        selectedTabs.links.push(formatLink(title, url, format));
      }
    });

    if (selectedTabs.links.length === 0) return;

    // save urls in storage to retrieve in new tab
    browser.storage.local.set({ selectedTabs }).then(createNewTab, onError);
  });
};

// open new tab with extension page as target
const createNewTab = () => {
  browser.tabs
    .create({
      url: '../tablist/tablist.html',
    })
    .then(closePopup, onError);
};

const closePopup = () => {
  window.close();
};

const onError = (error) => {
  console.log(`Error: ${error}`);
};

browser.tabs.query({}).then(logTabs, onError);
