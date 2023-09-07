// popup.js


function performGetRequest(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Parse the JSON response
    })
    .then((data) => {
      return data; // Return the parsed data
    })
    .catch((error) => {
      throw new Error('Fetch error: ' + error);
    });
}






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
          
          
          const requestUrl = 'https://serpapi.com/search.json?engine=google_lens&url=' + imageUrl;
          // Call the performGetRequest function and store the result in a variable
          const resultPromise = performGetRequest(requestUrl);

          // Fetch the result from the promise and append it to the popup
          resultPromise.then((result) => {
            /*
            const resultElement = document.createElement('p');
            resultElement.textContent = JSON.stringify(result, null, 2);
            popupDiv.appendChild(resultElement);
            */
            const images = result.visual_matches;
            for (let i = 0; i < 15; i++) {
              const imageElement = document.createElement('img');
              imageElement.src = images[i].thumbnail;
              popupDiv.appendChild(imageElement);
              //Also add the source icon of the image
              const sourceIcon = document.createElement('img');
              sourceIcon.src = images[i].source_icon;
              popupDiv.appendChild(sourceIcon);

              // Also add the link of the source found in the link property
              const linkElement = document.createElement('a');
              linkElement.href = images[i].link;
              linkElement.textContent = images[i].link;
              popupDiv.appendChild(linkElement);
            }
          });
          


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



