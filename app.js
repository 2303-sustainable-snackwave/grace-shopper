require('dotenv').config()
const { client } = require('./client'); 
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const { NotFoundError, AuthenticationError, ValidationError } = require('./errors');

// Setup your Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


// Routes
app.use('/api/users', require('./api/users'));
app.use('/api/reviews', require('./api/reviews'));
app.use('/api/products', require('./api/products'));
app.use('/api/orders', require('./api/orders'));
app.use('/api/checkout', require('./api/checkout'));
app.use('/api/cart', require('./api/cart'));

app.use(
  session({
    store: new pgSession({
      pool: client,
      tableName: 'sessions', 
    }),
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);

app.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else if (err instanceof AuthenticationError) {
    res.status(401).json({ error: err.message });
  } else if (err instanceof ValidationError) {
    res.status(422).json({ error: err.message, details: err.details });
  } else {
    next(err); 
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
