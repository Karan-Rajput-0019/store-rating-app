// routes/auth.js
const express = require('express');
const authcontroller = require('../controllers/authcontroller');
const {
  validateSignUp,
  validatePassword,
  handleValidationErrors,
} = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// register new user => POST /api/auth/register
router.post(
  '/register',
  validateSignUp,
  handleValidationErrors,
  authcontroller.register
);

// login existing user => POST /api/auth/login
router.post('/login', authcontroller.login);

// change password => POST /api/auth/change-password
router.post(
  '/change-password',
  authMiddleware,
  validatePassword,
  handleValidationErrors,
  authcontroller.changePassword
);

module.exports = router;
