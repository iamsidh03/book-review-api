const jwt = require('jsonwebtoken');
const secret = 'secret123'; // Move to .env in production

exports.authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

exports.generateToken = (user) => jwt.sign(user, secret);
