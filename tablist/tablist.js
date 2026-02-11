const createPage = (storage) => {
  updateTitle();
  createTabList(storage);
};

const updateTitle = () => {
  const now = new Date();
  const date = now.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const time = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  document.title = `Tablist Export ${date} ${time}`;
};

// get all links from storage an display in list
const createTabList = (storage) => {
  const listElement = document.querySelector('.urlist');
  storage.selectedTabs.links.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.appendChild(document.createTextNode(item));
    listElement.appendChild(listItem);
  });
};

const onError = (error) => {
  console.log(`Error: ${error}`);
};

browser.storage.local.get('selectedTabs').then(createPage, onError);
