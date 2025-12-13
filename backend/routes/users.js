// backend/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { validateCreateUser, handleValidationErrors } = require('../middleware/validation');

router.get('/', authMiddleware, adminOnly, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/', authMiddleware, adminOnly, validateCreateUser, handleValidationErrors, userController.createUser);
router.put('/:id', authMiddleware, adminOnly, userController.updateUser);
router.delete('/:id', authMiddleware, adminOnly, userController.deleteUser);

module.exports = router;
