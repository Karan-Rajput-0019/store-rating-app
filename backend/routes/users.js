// backend/routes/users.js
const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/usercontroller');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { validateCreateUser, handleValidationErrors } = require('../middleware/validation');

router.get('/', authMiddleware, adminOnly, usercontroller.getAllUsers);
router.get('/:id', authMiddleware, usercontroller.getUserById);
router.post('/', authMiddleware, adminOnly, validateCreateUser, handleValidationErrors, usercontroller.createUser);
router.put('/:id', authMiddleware, adminOnly, usercontroller.updateUser);
router.delete('/:id', authMiddleware, adminOnly, usercontroller.deleteUser);

module.exports = router;
