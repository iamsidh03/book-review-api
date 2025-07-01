const express = require('express');
const fs = require('fs');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

const books = require('../data/books.json').books;

// Task 1: Get all books
router.get('/', (req, res) => {
  res.json(books);
});

// Task 2: Get book by ISBN
router.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// Task 3: Get all books by Author
router.get('/author/:author', (req, res) => {
  const result = Object.values(books).filter(book =>
    book.author.toLowerCase() === req.params.author.toLowerCase()
  );
  res.json(result);
});

// Task 4: Get all books by Title
router.get('/title/:title', (req, res) => {
  const result = Object.values(books).filter(book =>
    book.title.toLowerCase().includes(req.params.title.toLowerCase())
  );
  res.json(result);
});

// Task 5: Get Reviews for a book
router.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book.reviews || {});
});

// Task 8: Add or Modify a review
router.put('/review/:isbn', authenticateToken, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username;

  if (!books[isbn]) return res.status(404).json({ message: 'Book not found' });

  books[isbn].reviews[username] = review;
  res.json({ message: 'Review added/modified' });
});

// Task 9: Delete a review
router.delete('/review/:isbn', authenticateToken, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn] || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: 'Review not found' });
  }

  delete books[isbn].reviews[username];
  res.json({ message: 'Review deleted' });
});

module.exports = router;
