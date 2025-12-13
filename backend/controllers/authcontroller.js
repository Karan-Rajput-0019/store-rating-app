// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Register new normal user
const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Check if user exists
    db.query('SELECT email FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      
      if (results.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      db.query(
        'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, address, 'normal_user'],
        (err, results) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          
          res.status(201).json({ 
            message: 'User registered successfully',
            userId: results.insertId 
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      
      if (results.length === 0 || !await bcrypt.compare(password, results[0].password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const user = results[0];
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          address: user.address
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    db.query('SELECT password FROM users WHERE id = ?', [userId], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      
      if (!results.length) {
        return res.status(404).json({ message: 'User not found' });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, results[0].password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Password changed successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  changePassword
};
