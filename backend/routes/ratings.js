// backend/routes/ratings.js
const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authMiddleware, normalUserOnly } = require('../middleware/auth');
const { validateRating, handleValidationErrors } = require('../middleware/validation');

router.get('/store/:storeId', ratingController.getRatingsByStore);
router.get('/user/:userId', authMiddleware, ratingController.getRatingsByUser);
router.get('/user-store/:storeId', authMiddleware, ratingController.getUserStoreRating);
router.post('/', authMiddleware, normalUserOnly, validateRating, handleValidationErrors, ratingController.submitRating);

module.exports = router;
