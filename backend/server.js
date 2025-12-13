// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  if (connection) connection.release();
  console.log('Database connected successfully');
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
