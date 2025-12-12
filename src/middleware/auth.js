const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : null;

    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role, name, email } = decoded || {};

    if (!id || !role) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    req.user = { id, role, name, email };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const requireRole = (allowedRoles = []) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  return next();
};

module.exports = { requireAuth, requireRole };
