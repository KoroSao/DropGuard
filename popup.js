
// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     const activeTab = tabs[0];
//     const tabUrl = activeTab.url;
//     const urlElement = document.getElementById('tab-url');
//     urlElement.textContent = tabUrl;
// });


// popup.js
// popup.js
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: () => {
        const mainProductImage = document.querySelector('[class="wt-max-width-full wt-horizontal-center wt-vertical-center carousel-image wt-rounded"]');
        if (mainProductImage) {
          return mainProductImage.getAttribute('src');
        } else {
          return null; // Return null if the element is not found
        }
      },
    },
    (result) => {
      if (!chrome.runtime.lastError) {
        const imageUrl = result[0].result;
        if (imageUrl) {
          // Create an image element and set its src attribute
          const imgElement = document.createElement('img');
          imgElement.src = imageUrl;

          // Append the image element to the popup
          const popupDiv = document.getElementById('popup');
          popupDiv.appendChild(imgElement);
        } else {
          // Create a "No product found" message
          const noProductMessage = document.createElement('p');
          noProductMessage.textContent = 'No product found';

          // Append the message to the popup
          const popupDiv = document.getElementById('popup');
          popupDiv.appendChild(noProductMessage);
        }
      } else {
        console.error('Error executing script:', chrome.runtime.lastError);
      }
    }
  );
});


