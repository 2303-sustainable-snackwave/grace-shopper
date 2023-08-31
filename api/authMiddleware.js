const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  
  // Check if token is present
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid token.' });
    }
  }

  // Allow guests to proceed without token
  next();
}

module.exports = { verifyToken };