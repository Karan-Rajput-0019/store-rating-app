const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

router.post('/signup', async (req, res) => {
  try {
    const { name, email, address, password } = req.body || {};

    if (!name || name.length < 20 || name.length > 60) {
      return res.status(400).json({ error: 'Name must be 20-60 characters' });
    }

    if (!address || address.length > 400) {
      return res.status(400).json({ error: 'Address must be at most 400 characters' });
    }

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    if (!password || !passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Password must be 8-16 chars with one uppercase and one special character',
      });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        address,
        password: hashed,
        role: 'NORMAL_USER',
      },
    });

    const { password: _, ...safeUser } = user;
    return res.status(201).json(safeUser);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
