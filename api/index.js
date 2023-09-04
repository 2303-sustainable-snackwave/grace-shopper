const express = require('express');
const router = express.Router();


// ROUTER: /api/users
const usersRouter = require("./users");
router.use("/users", usersRouter);

// ROUTER: /api/reviews
const reviewsRouter = require("./reviews");
router.use("/reviews", reviewsRouter);

// ROUTER: /api/products
const productsRouter = require("./products");
router.use("/products", productsRouter);

// ROUTER: /api/orders
const ordersRouter = require("./orders");
router.use("/orders", ordersRouter);

// ROUTER: /api/checkout
const checkoutRouter = require("./checkout");
router.use("/checkout", checkoutRouter);

// ROUTER: /api/cart
const cartRouter = require("./cart");
router.use("/cart", cartRouter);

// // ROUTER: /api/adminDashboard
// const cartRouter = require("./adminDashboard");
// router.use("/adminDashboard", cartRouter);


module.exports = router;
