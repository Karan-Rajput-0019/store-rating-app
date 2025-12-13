// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignUp, validatePassword, handleValidationErrors } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth');

router.post('/register', validateSignUp, handleValidationErrors, authController.register);
router.post('/login', authController.login);
router.post('/change-password', authMiddleware, validatePassword, handleValidationErrors, authController.changePassword);

module.exports = router;
