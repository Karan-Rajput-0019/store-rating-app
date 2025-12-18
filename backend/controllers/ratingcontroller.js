const db = require('../config/database');

// Get ratings for a store
const getRatingsByStore = (req, res) => {
  try {
    const { storeId } = req.params;
    db.query(
      'SELECT r.id, r.user_id, u.name, r.rating, r.created_at FROM ratings r JOIN users u ON r.user_id = u.id WHERE r.store_id = $1 ORDER BY r.created_at DESC',
      [storeId],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(result.rows);
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
      'SELECT r.id, r.store_id, s.name as storeName, r.rating, r.created_at FROM ratings r JOIN stores s ON r.store_id = s.id WHERE r.user_id = $1 ORDER BY r.created_at DESC',
      [userId],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(result.rows);
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
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [user_id, store_id],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (result.rows.length > 0) {
          // Update existing rating
          db.query(
            'UPDATE ratings SET rating = $1 WHERE user_id = $2 AND store_id = $3',
            [rating, user_id, store_id],
            (err) => {
              if (err) return res.status(500).json({ message: 'Database error' });
              res.json({ message: 'Rating updated successfully' });
            }
          );
        } else {
          // Insert new rating
          db.query(
            'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3) RETURNING id',
            [user_id, store_id, rating],
            (err, result) => {
              if (err) return res.status(500).json({ message: 'Database error' });
              res.status(201).json({
                message: 'Rating submitted successfully',
                ratingId: result.rows[0].id
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
      'SELECT rating FROM ratings WHERE user_id = $1 AND store_id = $2',
      [userId, storeId],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ rating: result.rows.length > 0 ? result.rows[0].rating : null });
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