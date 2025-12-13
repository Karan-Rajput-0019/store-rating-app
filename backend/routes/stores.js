// backend/routes/stores.js
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { validateCreateStore, handleValidationErrors } = require('../middleware/validation');

router.get('/', storeController.getAllStores);
router.get('/:id', storeController.getStoreById);
router.post('/', authMiddleware, adminOnly, validateCreateStore, handleValidationErrors, storeController.createStore);
router.put('/:id', authMiddleware, adminOnly, storeController.updateStore);
router.delete('/:id', authMiddleware, adminOnly, storeController.deleteStore);

module.exports = router;
