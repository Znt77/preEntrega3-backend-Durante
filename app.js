const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();

connectDB();

app.use(express.json());
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/carts', require('./routes/cartRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});


mongoose.connect('mongodb://localhost/login-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', require('./routes/index'));
app.use('/users', require('../routes/users'));
app.use('/api/sessions', require('./routes/auth')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Servidor iniciado en el puerto ${PORT}`));
