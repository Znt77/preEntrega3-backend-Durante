const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'Ese correo no está registrado' });
          }

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Contraseña incorrecta' });
            }
          });
        })
        .catch(err => console.log(err));
    })
  );

  passport.use(new GitHubStrategy({
    clientID: 'TU_CLIENT_ID_GITHUB',
    clientSecret: 'TU_CLIENT_SECRET_GITHUB',
    callbackURL: '/auth/github/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ githubId: profile.id }, (err, user) => {
      if (err) return done(err);
      if (user) {
        return done(null, user);
      } else {
        const newUser = new User({
          githubId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value
        });

        newUser.save((err) => {
          if (err) throw err;
          return done(null, newUser);
        });
      }
    });
  }
  ));

  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
  };

  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
      .then(user => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(err => console.log(err));
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
