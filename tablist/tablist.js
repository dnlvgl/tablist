// get all links from storage an display in list
const showList = (storage) => {
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

browser.storage.local.get('selectedTabs').then(showList, onError);
