// get all slinks from storage an display in list
const showList = (storage) => {
    const listElement = document.querySelector('.urlist');
    storage.selectedTabUrls.urls.map(item => {
      const listItem = document.createElement('li');
      listItem.appendChild(document.createTextNode(item));
      listElement.appendChild(listItem);
    });   
};

const onError = (error) => {
  console.log(`Error: ${error}`);
};

browser.storage.local.get("selectedTabUrls")
  .then(showList, onError);
