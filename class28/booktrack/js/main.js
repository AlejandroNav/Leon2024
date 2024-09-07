// Event listener for fetching all classes
document.querySelector('#fetch-button').addEventListener('click', fetchCharacters);

// Event listener for searching a single class
document.querySelector('#search-button').addEventListener('click', searchClass);

function fetchClassDetails(classUrl, li) {
    let detailsSection = li.querySelector('.details-section');
    if (detailsSection) {
        detailsSection.classList.toggle('hidden');
    } else {
        detailsSection = document.createElement('div');
        detailsSection.classList.add('details-section');
        li.appendChild(detailsSection);

        const fullUrl = `https://www.dnd5eapi.co${classUrl}`;
        console.log(`Fetching class details for: ${fullUrl}`);

        fetch(fullUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                const hitDie = document.createElement('p');
                hitDie.textContent = `Hit Die: ${data.hit_die}`;
                detailsSection.appendChild(hitDie);

                const proficiencies = document.createElement('p');
                proficiencies.textContent = `Proficiencies: ${data.proficiencies.map(p => p.name).join(', ')}`;
                detailsSection.appendChild(proficiencies);

                const savingThrows = document.createElement('p');
                savingThrows.textContent = `Saving Throws: ${data.saving_throws.map(st => st.name).join(', ')}`;
                detailsSection.appendChild(savingThrows);

                detailsSection.classList.remove('hidden');
            })
            .catch(err => {
                console.error(`Error fetching class details: ${err}`);
            });
    }
}

// Fetch all characters
function fetchCharacters() {
    const url = `https://www.dnd5eapi.co/api/classes`;
    console.log(url);

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

// Search for a specific class by name
function searchClass() {
    const name = document.querySelector('#name-input').value.toLowerCase().trim();  // Ensure it's lowercased and trimmed
    const url = `https://www.dnd5eapi.co/api/classes/${name}`;
    console.log(`Searching for class: ${url}`);

    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error('Class not found');
            }
            return res.json();
        })
        .then(data => {
            console.log(data);

            const resultsContainer = document.querySelector('#results');
            resultsContainer.innerHTML = '';  // Clear previous results

            const li = document.createElement('li');
            li.classList.add('character-class-item');
            li.textContent = data.name;

            li.addEventListener('click', () => fetchClassDetails(data.url, li));

            resultsContainer.appendChild(li);
        })
        .catch(err => {
            console.error(`Error: ${err}`);
            alert('Class not found. Please check the name and try again.');
        });
}
