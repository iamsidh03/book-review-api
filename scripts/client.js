const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Task 10: Get all books – async callback
async function getAllBooks() {
  try {
    const res = await axios.get(`${BASE_URL}/books`);
    console.log('Books:', res.data);
  } catch (err) {
    console.error(err);
  }
}

// Task 11: Get by ISBN – using Promises
function getByISBN(isbn) {
  axios.get(`${BASE_URL}/books/isbn/${isbn}`)
    .then(res => console.log('Book:', res.data))
    .catch(err => console.error(err));
}

// Task 12: Get by Author
function getByAuthor(author) {
  axios.get(`${BASE_URL}/books/author/${author}`)
    .then(res => console.log('Books:', res.data))
    .catch(err => console.error(err));
}

// Task 13: Get by Title
function getByTitle(title) {
  axios.get(`${BASE_URL}/books/title/${title}`)
    .then(res => console.log('Books:', res.data))
    .catch(err => console.error(err));
}

// Call functions for testing
getAllBooks();
getByISBN('12345');
getByAuthor('James Clear');
getByTitle('Alchemist');
