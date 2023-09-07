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
          
          const popupDiv = document.getElementById('focused-image');
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

            // Append element to results-display div
            const resultsDisplayDiv = document.getElementById('results-display');

            const images = result.visual_matches;
            for (let i = 0; i < 10; i++) {
              // Create a container div for each item
              const itemContainer = document.createElement('div');
              itemContainer.classList.add('flex', 'bg-white', 'rounded', 'p-4', 'mb-4'); // Add Tailwind classes for styling

              // Create a div for the left section (image)
              const leftSection = document.createElement('div');

              // Create an image element and set its attributes
              const imageElement = document.createElement('img');
              imageElement.src = images[i].thumbnail;
              imageElement.classList.add('w-32', 'h-auto', 'mr-40'); // Add Tailwind classes for styling
              leftSection.appendChild(imageElement);

              // Append the left section to the item container
              itemContainer.appendChild(leftSection);

              // Create a div for the right section (sourceIcon, price, and button)
              const rightSection = document.createElement('div');

              // Create an icon for the image source
              const sourceIcon = document.createElement('img');
              sourceIcon.src = images[i].source_icon;
              sourceIcon.classList.add('w-6', 'h-6', 'mb-2'); // Add Tailwind classes for styling
              rightSection.appendChild(sourceIcon);

              // Create a paragraph element for the price
              const priceElement = document.createElement('p');
              if (images[i].price && images[i].price.value) {
                priceElement.textContent = images[i].price.value;
              } else {
                priceElement.textContent = 'No price found';
              }
              priceElement.classList.add('text-blue-500', 'text-center', 'mb-2'); // Add Tailwind classes for styling
              rightSection.appendChild(priceElement);

              // Create a button element for the link
              const linkButton = document.createElement('button');
              linkButton.textContent = 'Open Link';
              linkButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'py-2', 'px-4', 'rounded', 'text-center', 'cursor-pointer');
              linkButton.addEventListener('click', () => {
                // Open the link in a new tab when the button is clicked
                window.open(images[i].link, '_blank');
              });
              rightSection.appendChild(linkButton);

              // Append the right section to the item container
              itemContainer.appendChild(rightSection);

              // Append the item container to the results display div
              resultsDisplayDiv.appendChild(itemContainer);
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



