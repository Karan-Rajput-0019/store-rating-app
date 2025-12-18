const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Get all users with filtering and sorting
const getAllUsers = (req, res) => {
  try {
    let query = 'SELECT id, name, email, address, role FROM users WHERE role IN ($1, $2)';
    const params = ['normal_user', 'admin'];

    // Add filters
    let paramCount = 3;
    if (req.query.name) {
      query += ` AND name ILIKE $${paramCount}`;
      params.push(`%${req.query.name}%`);
      paramCount++;
    }

    if (req.query.email) {
      query += ` AND email ILIKE $${paramCount}`;
      params.push(`%${req.query.email}%`);
      paramCount++;
    }

    if (req.query.address) {
      query += ` AND address ILIKE $${paramCount}`;
      params.push(`%${req.query.address}%`);
      paramCount++;
    }

    if (req.query.role) {
      query += ` AND role = $${paramCount}`;
      params.push(req.query.role);
      paramCount++;
    }

    // Add sorting
    const sortBy = req.query.sortBy || 'name';
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

// Get user by ID
const getUserById = (req, res) => {
  try {
    const { id } = req.params;
    db.query('SELECT id, name, email, address, role FROM users WHERE id = $1', [id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = result.rows[0];

      // If user is store owner, get their average rating
      if (user.role === 'store_owner') {
        db.query(
          'SELECT ROUND(AVG(rating)::NUMERIC, 2) as avgRating FROM ratings r JOIN stores s ON r.store_id = s.id WHERE s.owner_id = $1',
          [id],
          (err, ratingResult) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            user.averageRating = ratingResult.rows[0].avgRating || 0;
            res.json(user);
          }
        );
      } else {
        res.json(user);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new user (Admin only)
const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Check if email exists
    db.query('SELECT email FROM users WHERE email = $1', [email], async (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (result.rows.length > 0) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [name, email, hashedPassword, address, role],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          res.status(201).json({
            message: 'User created successfully',
            userId: result.rows[0].id
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
const updateUser = (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, role } = req.body;

    db.query(
      'UPDATE users SET name = $1, email = $2, address = $3, role = $4 WHERE id = $5',
      [name, email, address, role, id],
      (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'User updated successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
const deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = $1', [id], (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: 'User deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
