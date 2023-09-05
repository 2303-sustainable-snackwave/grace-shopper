require('dotenv').config()
const client = require('./db/client');
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const {
  NotFoundError,
  AuthenticationError,
  ValidationError,
  CartError,
  UserError,
  ProductError,
  ReviewError,
  OrderHistoryError,
  PermissionError,
  CartValidationFailedError,
  ProductValidationFailedError,
  ReviewValidationFailedError,
  TokenVerificationError,
  RegistrationError,
  AdminPermissionError,
} = require('./errors');
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your front-end URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // If you're using cookies or sessions
};

// Setup your Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));


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


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your front-end URL
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // If you're using cookies or sessions
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else if (err instanceof AuthenticationError) {
    res.status(401).json({ error: err.message });
  } else if (err instanceof ValidationError) {
    res.status(422).json({ error: err.message, details: err.details });
  } else if (err instanceof CartError) {
    // Handle your custom CartError here
    res.status(404).json({ error: err.message });
  } else if (err instanceof UserError) {
    // Handle your custom UserError here
    res.status(404).json({ error: err.message });
  } else if (err instanceof ProductError) {
    // Handle your custom ProductError here
    res.status(404).json({ error: err.message });
  } else if (err instanceof ReviewError) {
    // Handle your custom ReviewError here
    res.status(404).json({ error: err.message });
  } else if (err instanceof OrderHistoryError) {
    // Handle your custom OrderHistoryError here
    res.status(404).json({ error: err.message });
  } else if (err instanceof PermissionError) {
    // Handle your custom PermissionError here
    res.status(403).json({ error: err.message });
  } else if (err instanceof CartValidationFailedError) {
    // Handle your custom CartValidationFailedError here
    res.status(400).json({ error: err.message });
  } else if (err instanceof ProductValidationFailedError) {
    // Handle your custom ProductValidationFailedError here
    res.status(400).json({ error: err.message });
  } else if (err instanceof ReviewValidationFailedError) {
    // Handle your custom ReviewValidationFailedError here
    res.status(400).json({ error: err.message });
  } else if (err instanceof TokenVerificationError) {
    // Handle your custom TokenVerificationError here
    res.status(400).json({ error: err.message });
  } else if (err instanceof RegistrationError) {
    // Handle your custom RegistrationError here
    res.status(400).json({ error: err.message });
  } else if (err instanceof AdminPermissionError) {
    // Handle your custom AdminPermissionError here
    res.status(403).json({ error: err.message });
  } else {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
