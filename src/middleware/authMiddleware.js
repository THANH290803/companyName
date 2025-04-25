const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Lấy token từ header

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Xác thực và giải mã token
    const decoded = jwt.verify(token, 'jkFv@!4t#qN2$ePz98KlmR&0xYb1VuWc^HdTZs%3rAG6L+J9');
    req.user = decoded;
    next(); // Tiếp tục với request
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
