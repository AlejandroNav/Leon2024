let inputText = document.querySelector('#character-input');
let fetchButton = document.querySelector('#fetch-button');
let divResults = document.querySelector('#results');
fetchButton.addEventListener('click', fetchCharacter);

function fetchCharacter() {
    let characterNumber = inputText.value;

    fetch(`https://swapi.dev/api/people/${characterNumber}`)
        .then(response => response.json())
        .then(character => {
            // Display basic character info
            divResults.innerHTML = `<h2>${character.name}</h2>
                <p>Height: ${character.height} centimeters</p>
                <p>Eye color: ${character.eye_color}</p>`;

            // Fetch and display films
            let films = character.films;
            let filmPromises = films.map(filmUrl => fetch(filmUrl).then(res => res.json()));

            Promise.all(filmPromises)
                .then(filmsData => {
                    let filmList = "<h3>Movies:</h3><ul>";
                    filmsData.forEach(film => {
                        filmList += `<li>${film.title}</li>`;
                    });
                    filmList += "</ul>";
                    divResults.innerHTML += filmList;
                })
                .catch(error => console.error("Error fetching films: " + error));
        })
        .catch(error => console.error("Error fetching character: " + error));
}


for (let i = 1; i <= 10; i++) {

    console.log(i);
    
}