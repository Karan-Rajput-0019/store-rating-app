// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const storeOwnerOnly = (req, res, next) => {
  if (req.user.role !== 'store_owner') {
    return res.status(403).json({ message: 'Store owner access required' });
  }
  next();
};

const normalUserOnly = (req, res, next) => {
  if (req.user.role !== 'normal_user') {
    return res.status(403).json({ message: 'Normal user access required' });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminOnly,
  storeOwnerOnly,
  normalUserOnly
};
