require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

// Setup your Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


// Routes
app.use('/api', require('./api'));


app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  res.status(500)
  res.json({ error: "Internal Server Error" });
});

module.exports = app;
