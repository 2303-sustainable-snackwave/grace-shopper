require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

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

app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  res.status(500)
  res.json({ error: "Internal Server Error" });
});

module.exports = app;
