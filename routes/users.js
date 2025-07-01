const express = require('express');
const router = express.Router();
const { generateToken } = require('../middleware/auth');

let users = {};

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.status(400).json({ message: 'User exists' });

  users[username] = { password };
  return res.status(201).json({ message: 'User registered' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ username });
  res.json({ token });
});

module.exports = router;
