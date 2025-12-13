// backend/controllers/userController.js
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Get all users with filtering and sorting
const getAllUsers = (req, res) => {
  try {
    let query = 'SELECT id, name, email, address, role FROM users WHERE role IN ("normal_user", "admin")';
    const params = [];
    
    // Add filters
    if (req.query.name) {
      query += ' AND name LIKE ?';
      params.push(`%${req.query.name}%`);
    }
    if (req.query.email) {
      query += ' AND email LIKE ?';
      params.push(`%${req.query.email}%`);
    }
    if (req.query.address) {
      query += ' AND address LIKE ?';
      params.push(`%${req.query.address}%`);
    }
    if (req.query.role) {
      query += ' AND role = ?';
      params.push(req.query.role);
    }

    // Add sorting
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    db.query(query, params, (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
const getUserById = (req, res) => {
  try {
    const { id } = req.params;
    
    db.query('SELECT id, name, email, address, role FROM users WHERE id = ?', [id], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = results[0];

      // If user is store owner, get their average rating
      if (user.role === 'store_owner') {
        db.query(
          'SELECT AVG(rating) as avgRating FROM ratings r JOIN stores s ON r.store_id = s.id WHERE s.owner_id = ?',
          [id],
          (err, ratingResults) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            user.averageRating = ratingResults[0].avgRating || 0;
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
    db.query('SELECT email FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      
      if (results.length > 0) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, address, role],
        (err, results) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          res.status(201).json({ 
            message: 'User created successfully',
            userId: results.insertId 
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
      'UPDATE users SET name = ?, email = ?, address = ?, role = ? WHERE id = ?',
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

    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
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
