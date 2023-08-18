const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {
    createProducts,
    getProductById,
    getProductsWithoutOrders,
    getAllProducts,
    updateProduct,
    destroyProduct
} = require('../db/models/products')