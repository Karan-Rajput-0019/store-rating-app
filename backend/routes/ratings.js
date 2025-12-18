// backend/routes/ratings.js
const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const { authMiddleware, normalUserOnly } = require("../middleware/auth");
const {
  validateRating,
  handleValidationErrors,
} = require("../middleware/validation");

// Public: get ratings for a store
router.get("/store/:storeId", ratingController.getRatingsByStore);

// Authenticated: get ratings by a user
router.get("/user/:userId", authMiddleware, ratingController.getRatingsByUser);

// Authenticated: get current user's rating for a store
router.get(
  "/user-store/:storeId",
  authMiddleware,
  ratingController.getUserStoreRating
);
// all ratings for current user
router.get("/me", authMiddleware, (req, res) => {
  const userId = req.user.id;
  // reuse existing function
  req.params.userId = userId;
  ratingController.getRatingsByUser(req, res);
});

// Normal user: submit or update rating
router.post(
  "/",
  authMiddleware,
  normalUserOnly,
  validateRating,
  handleValidationErrors,
  ratingController.submitRating
);

// Count of ratings for current user (for streak/progress)
router.get('/me/count', authMiddleware, (req, res) => {
  const userId = req.user.id;

  const db = require('../config/database');

  db.query(
    'SELECT COUNT(*) AS total FROM ratings WHERE user_id = $1',
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      const total = Number(result.rows[0].total || 0);
      res.json({ total });
    }
  );
});


module.exports = router;

