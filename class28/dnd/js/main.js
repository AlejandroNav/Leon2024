// Add an event listener to the button with the ID 'fetch-button'
document.querySelector('#fetch-button').addEventListener('click', fetchCharacters);

function fetchClassDetails(classUrl, li) {
    // Check if the details section already exists
    let detailsSection = li.querySelector('.details-section');
    if (detailsSection) {
        // If it exists, toggle its visibility
        detailsSection.classList.toggle('hidden');
    } else {
        // Create a new details section and fetch data only once
        detailsSection = document.createElement('div');
        detailsSection.classList.add('details-section');

        // Append the details section to the list item, but hidden initially
        li.appendChild(detailsSection);

        const fullUrl = `https://www.dnd5eapi.co${classUrl}`;
        console.log(`Fetching class details for: ${fullUrl}`);

        fetch(fullUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                // Add Hit Die information
                const hitDie = document.createElement('p');
                hitDie.textContent = `Hit Die: ${data.hit_die}`;
                detailsSection.appendChild(hitDie);

                // Add more class details here
                const proficiencies = document.createElement('p');
                proficiencies.textContent = `Proficiencies: ${data.proficiencies.map(p => p.name).join(', ')}`;
                detailsSection.appendChild(proficiencies);

                const savingThrows = document.createElement('p');
                savingThrows.textContent = `Saving Throws: ${data.saving_throws.map(st => st.name).join(', ')}`;
                detailsSection.appendChild(savingThrows);

                // Now that the details are loaded, make the section visible
                detailsSection.classList.remove('hidden');
            })
            .catch(err => {
                console.error(`Error fetching class details: ${err}`);
            });
    }
}


function fetchCharacters() {
    const name = document.querySelector('#name-input').value;
    const url = `https://www.dnd5eapi.co/api/classes/${name}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.results && Array.isArray(data.results)) {
                const characterClasses = data.results;
                const resultsContainer = document.querySelector('#results');
                resultsContainer.innerHTML = '';

                characterClasses.forEach(characterClass => {
                    console.log(characterClass.name);

                    const li = document.createElement('li');
                    li.classList.add('character-class-item');
                    li.textContent = characterClass.name;

                    // Add click listener to toggle details without fetching again
                    li.addEventListener('click', () => fetchClassDetails(characterClass.url, li));

                    resultsContainer.appendChild(li);
                });
            } else {
                console.log('No classes found');
            }
        })
        .catch(err => {
            console.error(`Error: ${err}`);
        });
}