// backend/routes/dashboard.js

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware, adminOnly, storeOwnerOnly } = require('../middleware/auth');

// Admin Dashboard
router.get('/admin', authMiddleware, adminOnly, (req, res) => {
  try {
    let completed = 0;

    // Get total users
    db.query('SELECT COUNT(*) as totalUsers FROM users WHERE role IN ($1, $2)', ['normal_user', 'admin'], (err, userResults) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      completed++;

      // Get total stores
      db.query('SELECT COUNT(*) as totalStores FROM stores', (err, storeResults) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        completed++;

        // Get total ratings
        db.query('SELECT COUNT(*) as totalRatings FROM ratings', (err, ratingResults) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          res.json({
            totalUsers: userResults.rows[0].totalusers,
            totalStores: storeResults.rows[0].totalstores,
            totalRatings: ratingResults.rows[0].totalratings
          });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Store Owner Dashboard
router.get('/store-owner', authMiddleware, storeOwnerOnly, (req, res) => {
  try {
    const storeOwnerId = req.user.id;
    db.query(
      `SELECT s.id, s.name, ROUND(AVG(r.rating)::NUMERIC, 2) as averageRating, COUNT(r.id) as totalRatings
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.owner_id = $1
       GROUP BY s.id`,
      [storeOwnerId],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ stores: result.rows });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;