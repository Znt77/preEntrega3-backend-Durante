const express = require('express');
const authRoutes = require('./auth');
const passport = require('../config/passport');

const router = express.Router();
router.use('/api/sessions', authRoutes);

router.get('/', (req, res) => res.render('welcome'));

router.get('/dashboard', (req, res) => 
  res.render('dashboard', { user: req.user })
);

module.exports = router;
