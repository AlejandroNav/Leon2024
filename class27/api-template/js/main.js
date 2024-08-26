document.getElementById('fetch-button').addEventListener('click', getFetch);

function getFetch() {
  const choice = document.getElementById('date-input').value;
  let startDate = choice || "2024-08-22";
  let key = 'fafIAHKPMQT32ikafH14POfHG5eUVTKkw3aE8Ecj';
  const url = `https://api.nasa.gov/planetary/apod?start_date=${startDate}&api_key=${key}`;
  console.log(url);
  
  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data);
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = ''; // Clear previous results

        if (Array.isArray(data)) {
          data.forEach((item) => {
            displayMedia(item, resultsContainer);
          });
        } else {
          displayMedia(data, resultsContainer);
        }
      })
      .catch(err => {
          console.log(`error ${err}`);
      });
}

function displayMedia(item, container) {
  const resultItem = document.createElement('div');
  resultItem.classList.add('result-item');

  const title = document.createElement('h2');
  title.innerText = item.title;
  title.classList.add('result-title');
  
  resultItem.appendChild(title);

  if (item.media_type === 'image') {
    const img = document.createElement('img');
    img.src = item.url;
    img.alt = item.title;
    img.classList.add('result-image');
    resultItem.appendChild(img);
  } else if (item.media_type === 'video') {
    const iframe = document.createElement('iframe');
    iframe.src = item.url;
    iframe.classList.add('result-video');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', true);
    resultItem.appendChild(iframe);
  }

  container.appendChild(resultItem);
}
