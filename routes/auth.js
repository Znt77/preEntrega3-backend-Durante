const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      first_name,
      last_name,
      email,
      age,
      password
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

    res.cookie('jwt', token, { httpOnly: true });
    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});

module.exports = router;
