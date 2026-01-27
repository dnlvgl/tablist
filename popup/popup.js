// Main function: get tabs and groups, render UI
const init = async () => {
  try {
    const [tabs, groups] = await Promise.all([
      browser.tabs.query({}),
      browser.tabGroups ? browser.tabGroups.query({}) : Promise.resolve([]),
    ]);
    renderTabList(tabs, groups);
    tabListEvents();
  } catch (error) {
    onError(error);
  }
};

// Render tabs organized by groups
const renderTabList = (tabs, groups) => {
  const popupList = document.querySelector('.tablist-items');
  const groupMap = new Map(groups.map((g) => [g.id, g]));

  // Group tabs by groupId
  const groupedTabs = new Map();
  const ungroupedTabs = [];

  for (const tab of tabs) {
    if (tab.groupId && tab.groupId !== -1) {
      if (!groupedTabs.has(tab.groupId)) {
        groupedTabs.set(tab.groupId, []);
      }
      groupedTabs.get(tab.groupId).push(tab);
    } else {
      ungroupedTabs.push(tab);
    }
  }

  // Render grouped tabs first
  for (const [groupId, groupTabs] of groupedTabs) {
    const group = groupMap.get(groupId);
    if (group) {
      createGroupHeader(group, groupTabs.length, popupList);
      const groupContainer = createGroupContainer(groupId, popupList);
      for (const tab of groupTabs) {
        createTabItem(tab, groupContainer);
      }
    }
  }

  // Render ungrouped tabs
  if (ungroupedTabs.length > 0) {
    if (groupedTabs.size > 0) {
      createUngroupedHeader(ungroupedTabs.length, popupList);
    }
    for (const tab of ungroupedTabs) {
      createTabItem(tab, popupList);
    }
  }
};

// Create a group header with checkbox and collapse toggle
const createGroupHeader = (group, tabCount, container) => {
  const title = group.title || 'Unnamed group';
  const color = group.color || 'grey';
  const collapsed = group.collapsed || false;

  const markup = `
    <div class="tab-group-header" data-group-id="${group.id}" data-collapsed="${collapsed}">
      <button class="group-collapse-btn" aria-expanded="${!collapsed}" aria-label="Toggle group">
        <span class="collapse-icon">${collapsed ? '▶' : '▼'}</span>
      </button>
      <input type="checkbox" class="group-checkbox" id="group-${group.id}" data-group-id="${group.id}">
      <label for="group-${group.id}" class="group-label">
        <span class="group-color-indicator group-color-${color}"></span>
        <span class="group-title">${title}</span>
        <span class="group-tab-count">(${tabCount})</span>
      </label>
    </div>
  `;

  const parser = new DOMParser();
  const parsed = parser.parseFromString(markup, 'text/html');
  const header = parsed.querySelector('.tab-group-header');
  container.appendChild(header);
};

// Create a container for group tabs
const createGroupContainer = (groupId, container) => {
  const groupContainer = document.createElement('div');
  groupContainer.className = 'tab-group-container';
  groupContainer.dataset.groupId = groupId;
  container.appendChild(groupContainer);
  return groupContainer;
};

// Create ungrouped section header
const createUngroupedHeader = (tabCount, container) => {
  const markup = `
    <div class="ungrouped-header">
      <span class="ungrouped-label">Ungrouped</span>
      <span class="group-tab-count">(${tabCount})</span>
    </div>
  `;

  const parser = new DOMParser();
  const parsed = parser.parseFromString(markup, 'text/html');
  const header = parsed.querySelector('.ungrouped-header');
  container.appendChild(header);
};

// Create individual tab item
const createTabItem = (tab, container) => {
  const fallbackFavIcon = '../icons/globe-16.svg';
  const hasFavIcon = tab.favIconUrl;
  const faviconClass = hasFavIcon ? 'favicon' : 'favicon favicon-fallback';
  const escapedTitle = tab.title.replace(/"/g, '&quot;');
  const escapedUrl = tab.url.replace(/"/g, '&quot;');
  const groupId = tab.groupId && tab.groupId !== -1 ? tab.groupId : '';

  const markup = `
    <div class="panel-list-item tablist-checkbox-wrapper${groupId ? ' grouped-tab' : ''}">
      <div class="checkboxItem">
        <input type="checkbox" id="${tab.id}" data-title="${escapedTitle}" data-url="${escapedUrl}" data-group-id="${groupId}" title="${escapedTitle}" name="tab"/>
        <label for="${tab.id}" title="${escapedTitle}">
          <img class="${faviconClass}" src="${hasFavIcon ? tab.favIconUrl : fallbackFavIcon}">
          <span class="label-text">${tab.title}</span>
        </label>
      </div>
    </div>
  `;

  const parser = new DOMParser();
  const parsed = parser.parseFromString(markup, 'text/html');
  const item = parsed.querySelector('.panel-list-item');
  container.appendChild(item);
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

  // Update group checkbox state based on its tabs
  const updateGroupCheckbox = (groupId) => {
    const groupCheckbox = document.querySelector(`.group-checkbox[data-group-id="${groupId}"]`);
    if (!groupCheckbox) return;

    const groupTabs = Array.from(
      document.querySelectorAll(`input[name="tab"][data-group-id="${groupId}"]`),
    );
    const checkedCount = groupTabs.filter((cb) => cb.checked).length;

    if (checkedCount === 0) {
      groupCheckbox.checked = false;
      groupCheckbox.indeterminate = false;
    } else if (checkedCount === groupTabs.length) {
      groupCheckbox.checked = true;
      groupCheckbox.indeterminate = false;
    } else {
      groupCheckbox.checked = false;
      groupCheckbox.indeterminate = true;
    }
  };

  // Update select all checkbox state
  const updateSelectAllCheckbox = () => {
    const allTabs = Array.from(document.getElementsByName('tab'));
    const checkedCount = allTabs.filter((cb) => cb.checked).length;

    if (checkedCount === 0) {
      toggleSelect.checked = false;
      toggleSelect.indeterminate = false;
    } else if (checkedCount === allTabs.length) {
      toggleSelect.checked = true;
      toggleSelect.indeterminate = false;
    } else {
      toggleSelect.checked = false;
      toggleSelect.indeterminate = true;
    }
  };

  // check or uncheck all items in tablist
  toggleSelect.addEventListener('click', (event) => {
    const checkAllItems = event.target.checked;
    const checkboxes = Array.from(document.getElementsByName('tab'));
    checkboxes.forEach((checkbox) => {
      checkbox.checked = checkAllItems;
    });
    // Update all group checkboxes
    const groupCheckboxes = document.querySelectorAll('.group-checkbox');
    groupCheckboxes.forEach((gc) => {
      gc.checked = checkAllItems;
      gc.indeterminate = false;
    });
  });

  // Handle group checkbox clicks
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('group-checkbox')) {
      const groupId = event.target.dataset.groupId;
      const checked = event.target.checked;
      const groupTabs = document.querySelectorAll(`input[name="tab"][data-group-id="${groupId}"]`);
      groupTabs.forEach((tab) => {
        tab.checked = checked;
      });
      event.target.indeterminate = false;
      updateSelectAllCheckbox();
    }
  });

  // Handle individual tab checkbox changes
  document.addEventListener('change', (event) => {
    if (event.target.name === 'tab') {
      const groupId = event.target.dataset.groupId;
      if (groupId) {
        updateGroupCheckbox(groupId);
      }
      updateSelectAllCheckbox();
    }
  });

  // Handle collapse/expand button clicks
  document.addEventListener('click', (event) => {
    const collapseBtn = event.target.closest('.group-collapse-btn');
    if (!collapseBtn) return;

    const header = collapseBtn.closest('.tab-group-header');
    const groupId = header.dataset.groupId;
    const isCollapsed = header.dataset.collapsed === 'true';
    const newCollapsed = !isCollapsed;

    header.dataset.collapsed = newCollapsed;
    collapseBtn.setAttribute('aria-expanded', !newCollapsed);
    collapseBtn.querySelector('.collapse-icon').textContent = newCollapsed ? '▶' : '▼';

    const container = document.querySelector(`.tab-group-container[data-group-id="${groupId}"]`);
    if (container) {
      container.classList.toggle('collapsed', newCollapsed);
    }
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

init();
