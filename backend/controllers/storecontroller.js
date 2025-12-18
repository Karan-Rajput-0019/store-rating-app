// backend/controllers/storecontroller.js

const db = require('../config/database');

// Get all stores with current user's rating (user optional)
const getStoresWithUserRating = (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    let query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        u.name AS ownerName,
        ROUND(AVG(r.rating)::NUMERIC, 2) AS averageRating,
        COUNT(r.id) AS totalRatings,
        ur.rating AS userRating
      FROM stores s
      JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id
    `;

    const params = [];

    if (userId) {
      query += ' AND ur.user_id = $1';
      params.push(userId);
    }

    query += `
      WHERE 1=1
      GROUP BY s.id, u.id, ur.rating
    `;

    const sortBy = req.query.sortBy || 's.name';
    const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    db.query(query, params, (err, result) => {
      if (err) {
        console.error('getStoresWithUserRating error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.json(result.rows);
    });
  } catch (error) {
    console.error('getStoresWithUserRating catch:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all stores
const getAllStores = (req, res) => {
  try {
    let query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        u.name AS ownerName,
        ROUND(AVG(r.rating)::NUMERIC, 2) AS averageRating,
        COUNT(r.id) AS totalRatings
      FROM stores s
      JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (req.query.name) {
      query += ` AND s.name ILIKE $${paramIndex}`;
      params.push(`%${req.query.name}%`);
      paramIndex++;
    }

    if (req.query.address) {
      query += ` AND s.address ILIKE $${paramIndex}`;
      params.push(`%${req.query.address}%`);
      paramIndex++;
    }

    query += ' GROUP BY s.id, u.id';

    const sortBy = req.query.sortBy || 's.name';
    const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    db.query(query, params, (err, result) => {
      if (err) {
        console.error('getAllStores error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.json(result.rows);
    });
  } catch (error) {
    console.error('getAllStores catch:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get store by ID
const getStoreById = (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        u.name AS ownerName,
        ROUND(AVG(r.rating)::NUMERIC, 2) AS averageRating,
        COUNT(r.id) AS totalRatings
      FROM stores s
      JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $1
      GROUP BY s.id, u.id
    `;

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('getStoreById error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Store not found' });
      }

      res.json(result.rows[0]);
    });
  } catch (error) {
    console.error('getStoreById catch:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new store (Admin only)
const createStore = (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    db.query(
      'SELECT email FROM stores WHERE email = $1',
      [email],
      (err, result) => {
        if (err) {
          console.error('createStore SELECT error:', err);
          return res.status(500).json({ message: 'Database error' });
        }

        if (result.rows.length > 0) {
          return res
            .status(400)
            .json({ message: 'Store email already exists' });
        }

        db.query(
          'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING id',
          [name, email, address, owner_id],
          (err2, insertResult) => {
            if (err2) {
              console.error('createStore INSERT error:', err2);
              return res.status(500).json({ message: 'Database error' });
            }

            res.status(201).json({
              message: 'Store created successfully',
              storeId: insertResult.rows[0].id,
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('createStore catch:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update store
const updateStore = (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address } = req.body;

    db.query(
      'UPDATE stores SET name = $1, email = $2, address = $3 WHERE id = $4',
      [name, email, address, id],
      err => {
        if (err) {
          console.error('updateStore error:', err);
          return res.status(500).json({ message: 'Database error' });
        }

        res.json({ message: 'Store updated successfully' });
      }
    );
  } catch (error) {
    console.error('updateStore catch:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete store
const deleteStore = (req, res) => {
  try {
    const { id } = req.params;

    db.query('DELETE FROM stores WHERE id = $1', [id], err => {
      if (err) {
        console.error('deleteStore error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({ message: 'Store deleted successfully' });
    });
  } catch (error) {
    console.error('deleteStore catch:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getStoresWithUserRating,
};
