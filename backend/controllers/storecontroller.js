const db = require('../config/database');

// Get all stores with current user's rating
const getStoresWithUserRating = (req, res) => {
  try {
    const userId = req.user.id;
    let query = `
      SELECT s.id,
             s.name,
             s.email,
             s.address,
             s.owner_id,
             u.name as ownerName,
             ROUND(AVG(r.rating)::NUMERIC, 2) as averageRating,
             COUNT(r.id) as totalRatings,
             ur.rating as userRating
      FROM stores s
      JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1
      WHERE 1=1
    `;

    const params = [userId];
    query += " GROUP BY s.id, ur.rating";

    const sortBy = req.query.sortBy || "s.name";
    const sortOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC";
    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    db.query(query, params, (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json(result.rows);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all stores
const getAllStores = (req, res) => {
  try {
    let query = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id, u.name as ownerName,
             ROUND(AVG(r.rating)::NUMERIC, 2) as averageRating, COUNT(r.id) as totalRatings
      FROM stores s
      JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    // Add filters
    if (req.query.name) {
      query += ` AND s.name ILIKE $${paramCount}`;
      params.push(`%${req.query.name}%`);
      paramCount++;
    }

    if (req.query.address) {
      query += ` AND s.address ILIKE $${paramCount}`;
      params.push(`%${req.query.address}%`);
      paramCount++;
    }

    query += ' GROUP BY s.id, u.id';

    // Add sorting
    const sortBy = req.query.sortBy || 's.name';
    const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    db.query(query, params, (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(result.rows);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get store by ID
const getStoreById = (req, res) => {
  try {
    const { id } = req.params;
    db.query(
      `SELECT s.id, s.name, s.email, s.address, s.owner_id, u.name as ownerName,
              ROUND(AVG(r.rating)::NUMERIC, 2) as averageRating, COUNT(r.id) as totalRatings
       FROM stores s
       JOIN users u ON s.owner_id = u.id
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.id = $1
       GROUP BY s.id, u.id`,
      [id],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Store not found' });
        }

        res.json(result.rows[0]);
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new store (Admin only)
const createStore = (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    db.query('SELECT email FROM stores WHERE email = $1', [email], (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (result.rows.length > 0) {
        return res.status(400).json({ message: 'Store email already exists' });
      }

      db.query(
        'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING id',
        [name, email, address, owner_id],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          res.status(201).json({
            message: 'Store created successfully',
            storeId: result.rows[0].id
          });
        }
      );
    });
  } catch (error) {
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
      (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Store updated successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete store
const deleteStore = (req, res) => {
  try {
    const { id } = req.params;
    db.query('DELETE FROM stores WHERE id = $1', [id], (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: 'Store deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getStoresWithUserRating
};