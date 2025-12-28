const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Токен не предоставлен!'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.administratorId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Неавторизован!'
    });
  }
};

module.exports = {
  verifyToken
}; 