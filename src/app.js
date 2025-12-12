const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./config/db');

// Load environment variables
dotenv.config();

// Import routes
const apiRouter = require('./routes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = { app, prisma };
