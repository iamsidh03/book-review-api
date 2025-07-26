// =================================================================
// CONFIGURATION
// =================================================================
const API_URL = 'http://localhost:5001'; // Make sure this port matches your backend server

// =================================================================
// HELPER FUNCTIONS
// =================================================================

function showNotification(message) {
    // A simple alert, but you could build a custom modal for a better UX
    alert(message);
}

function showBooksView() {
    document.getElementById('books-section').style.display = 'block';
    document.getElementById('book-details-section').style.display = 'none';
}

function showDetailsView() {
    document.getElementById('books-section').style.display = 'none';
    document.getElementById('book-details-section').style.display = 'block';
}


// =================================================================
// API CALLS & RENDER FUNCTIONS
// =================================================================

// Function to register a new user
async function registerUser() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        showNotification(data.message);
    } catch (error) {
        console.error('Error registering user:', error);
        showNotification('Error: Could not connect to the server.');
    }
}

// Function to log in a user
async function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            showNotification('Login successful!');
        } else {
            showNotification(data.message);
        }
    } catch (error) {
        console.error('Error logging in:', error);
        showNotification('Error: Could not connect to the server.');
    }
}

// Function to fetch all books
async function fetchAllBooks() {
    try {
        const response = await fetch(`${API_URL}/books`);
        // ✅ ADDED CHECK: Ensure the request was successful before parsing
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const booksObject = await response.json();
        const booksList = document.getElementById('books-list');
        booksList.innerHTML = '';

        const booksArray = Object.keys(booksObject).map(isbn => {
            return {
                isbn: isbn,
                title: booksObject[isbn].title,
                author: booksObject[isbn].author,
                reviews: booksObject[isbn].reviews
            };
        });

        booksArray.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            bookItem.innerHTML = `
                <p><strong>${book.title}</strong> by ${book.author}</p>
                <button onclick="fetchBookDetails('${book.isbn}')">View Details</button>
            `;
            booksList.appendChild(bookItem);
        });

        showBooksView();
    } catch (error) {
        console.error('Error fetching books:', error);
        showNotification('Error: Could not fetch books. Is the backend server running?');
    }
}

// Function to search for books by ISBN
async function searchBooks() {
    const query = document.getElementById('search-input').value;
    if (!query) {
        fetchAllBooks();
        return;
    }
    try {
        const response = await fetch(`${API_URL}/books/${query}`);
        if (!response.ok) {
            showNotification('No book found with that ISBN.');
            return;
        }
        const book = await response.json();
        const booksList = document.getElementById('books-list');
        booksList.innerHTML = '';
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';
        book.isbn = query;
        bookItem.innerHTML = `
            <p><strong>${book.title}</strong> by ${book.author}</p>
            <button onclick="fetchBookDetails('${book.isbn}')">View Details</button>
        `;
        booksList.appendChild(bookItem);
    } catch (error) {
        console.error('Error searching for books:', error);
        showNotification('An error occurred while searching.');
    }
}

// Function to fetch details and reviews for a specific book
async function fetchBookDetails(isbn) {
    try {
        const [bookRes, reviewsRes] = await Promise.all([
            fetch(`${API_URL}/books/${isbn}`),
            fetch(`${API_URL}/books/${isbn}/review`)
        ]);

        // ✅ ADDED CHECK: Validate both responses before trying to parse them
        if (!bookRes.ok || !reviewsRes.ok) {
            showNotification(`Could not find details for book with ISBN: ${isbn}.`);
            return; // Stop the function here
        }

        const book = await bookRes.json();
        const reviews = await reviewsRes.json();

        document.getElementById('book-title').innerText = book.title;
        document.getElementById('book-author').innerText = book.author;
        document.getElementById('book-isbn').innerText = isbn;

        const reviewsList = document.getElementById('reviews-list');
        reviewsList.innerHTML = '';
        if (reviews && Object.keys(reviews).length > 0) {
            for (const user in reviews) {
                const reviewItem = document.createElement('div');
                reviewItem.className = 'review-item';
                reviewItem.innerHTML = `<p><strong>${user}:</strong> ${reviews[user]}</p>`;
                reviewsList.appendChild(reviewItem);
            }
        } else {
            reviewsList.innerHTML = '<p>No reviews yet.</p>';
        }

        showDetailsView();
    } catch (error) {
        // This catch block will now only catch true network errors or other unexpected issues
        console.error('Error fetching book details:', error);
        showNotification('A network error occurred while fetching book details.');
    }
}

// Function to add a review
async function addReview() {
    const isbn = document.getElementById('book-isbn').innerText;
    const reviewText = document.getElementById('review-text').value;
    const token = localStorage.getItem('token');

    if (!token) {
        showNotification('You must be logged in to add a review.');
        return;
    }
    if (!reviewText) {
        showNotification('Review text cannot be empty.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/books/${isbn}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ review: reviewText })
        });
        const data = await response.json();
        showNotification(data.message);
        document.getElementById('review-text').value = '';
        fetchBookDetails(isbn);
    } catch (error) {
        console.error('Error adding review:', error);
        showNotification('Could not add review.');
    }
}

// =================================================================
// INITIALIZATION
// =================================================================
window.onload = fetchAllBooks;
