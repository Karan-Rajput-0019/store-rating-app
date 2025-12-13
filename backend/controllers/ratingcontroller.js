// backend/controllers/ratingController.js
const db = require('../config/database');

// Get ratings for a store
const getRatingsByStore = (req, res) => {
  try {
    const { storeId } = req.params;

    db.query(
      'SELECT r.id, r.user_id, u.name, r.rating, r.created_at FROM ratings r JOIN users u ON r.user_id = u.id WHERE r.store_id = ? ORDER BY r.created_at DESC',
      [storeId],
      (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ratings by user
const getRatingsByUser = (req, res) => {
  try {
    const { userId } = req.params;

    db.query(
      'SELECT r.id, r.store_id, s.name as storeName, r.rating, r.created_at FROM ratings r JOIN stores s ON r.store_id = s.id WHERE r.user_id = ? ORDER BY r.created_at DESC',
      [userId],
      (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit or update rating
const submitRating = (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    // Check if rating already exists
    db.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [user_id, store_id],
      (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length > 0) {
          // Update existing rating
          db.query(
            'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
            [rating, user_id, store_id],
            (err) => {
              if (err) return res.status(500).json({ message: 'Database error' });
              res.json({ message: 'Rating updated successfully' });
            }
          );
        } else {
          // Insert new rating
          db.query(
            'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
            [user_id, store_id, rating],
            (err, results) => {
              if (err) return res.status(500).json({ message: 'Database error' });
              res.status(201).json({ 
                message: 'Rating submitted successfully',
                ratingId: results.insertId 
              });
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's rating for a specific store
const getUserStoreRating = (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    db.query(
      'SELECT rating FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId],
      (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ rating: results.length > 0 ? results[0].rating : null });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRatingsByStore,
  getRatingsByUser,
  submitRating,
  getUserStoreRating
};
