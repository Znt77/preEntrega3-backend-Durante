const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Por favor, llena todos los campos' });
  }

  if (password != password2) {
    errors.push({ msg: 'Las contraseñas no coinciden' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'La contraseña debe tener al menos 6 caracteres' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'El correo electrónico ya está registrado' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => {
              req.flash('success_msg', 'Estás registrado y puedes iniciar sesión');
              res.redirect('/users/login');
            })
            .catch(err => console.log(err));
        }));
      }
    });
  }
});

router.get('/login', (req, res) => res.render('login'));

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success_msg', 'Has cerrado sesión');
    res.redirect('/users/login');
  });
});

router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/users/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  });

module.exports = router;
