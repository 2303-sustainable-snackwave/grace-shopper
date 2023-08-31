const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// ROUTER: /api
router.get("/", async (req, res, next) => {
  try {
    res.send({
      message: "API is under construction!",
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/health
router.get("/health", async (req, res, next) => {
  try {
    res.send({
      message: "Server is healthy!",
    });
  } catch (error) {
    next(error);
  }
});

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

module.exports = router;
