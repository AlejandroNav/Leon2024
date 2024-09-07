// Event listener for searching a book by ISBN
let searchButton = document.querySelector('#search-button');
searchButton.addEventListener('click', fetchBook);

// Event listener for saving the book to localStorage
let saveButton = document.querySelector('#fetch-button');
saveButton.addEventListener('click', saveBook);

let currentBook = null; // To store the current book being fetched

function fetchBook() {
    console.log('fetching...');
    const isbn = document.querySelector('#isbn-input').value.trim(); // Get ISBN input and trim spaces;
    if (!isbn) {
        alert('Please enter a valid ISBN');
        return;
    }

    url = `https://openlibrary.org/isbn/${isbn}.json`;
    console.log(url);

    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error('Book not found');
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            currentBook = data; // Save the current book data for saving later
            displayBookInfo(data);
        })
        .catch(err => {
            console.error(`Error: ${err}`);
            alert('Could not find the book. Please check the ISBN.');
        });
}

function displayBookInfo(book) {
    const resultsContainer = document.querySelector('#results');
    resultsContainer.innerHTML = ''; // Clear previous results

    const li = document.createElement('li');
    li.classList.add('book-item');

    // Format book information to display
    li.innerHTML = `
        <strong>Title:</strong> ${book.full_title || book.title} <br>
        <strong>Version:</strong> ${book.physical_format || 'Unknown'} <br>
        <strong>Publisher:</strong> ${book.publishers ? book.publishers[0] : 'Unknown'} <br>
        <strong>Number of Pages:</strong> ${book.number_of_pages || 'N/A'}
    `;

    resultsContainer.appendChild(li);
}
// Save the current book to local storage
function saveBook() {
    if (!currentBook) {
        alert('No book to save! Please search for a book first.');
        return;
    }

    // Get the existing saved books from local storage
    let savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || [];

    // Add the current book to the saved books list
    savedBooks.push({
        title: currentBook.full_title || currentBook.title,
        version: currentBook.physical_format || 'Unknown',
        publisher: currentBook.publishers ? currentBook.publishers[0] : 'Unknown',
        pages: currentBook.number_of_pages || 'N/A',
        isbn: currentBook.isbn_10 ? currentBook.isbn_10[0] : currentBook.isbn_13 ? currentBook.isbn_13[0] : 'Unknown'
    });

    // Save the updated list back to local storage
    localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
    console.log(savedBooks);
    alert('Book saved successfully!');
}

// Optional: Function to view saved books from local storage
function viewSavedBooks() {
    const savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || [];
    
    const resultsContainer = document.querySelector('#results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (savedBooks.length === 0) {
        resultsContainer.textContent = 'No books saved.';
        return;
    }

    savedBooks.forEach(book => {
        const li = document.createElement('li');
        li.classList.add('book-item');
        li.innerHTML = `
            <strong>Title:</strong> ${book.title} <br>
            <strong>Version:</strong> ${book.version} <br>
            <strong>Publisher:</strong> ${book.publisher} <br>
            <strong>Pages:</strong> ${book.pages} <br>
            <strong>ISBN:</strong> ${book.isbn}
        `;
        resultsContainer.appendChild(li);
    });
}