const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied.' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token.' });
  }
}

module.exports = authenticate;
