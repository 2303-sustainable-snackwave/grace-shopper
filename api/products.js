const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  createProducts,
  getProductById,
  getProductsWithoutOrders,
  getAllProducts,
  updateProduct,
  destroyProduct,
} = require("../db/models/products");

// GET /api/products

router.post("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();

    res.json(products);
  } catch (error) {
    next(error);
  }
});

// POST /api/products

router.post("/", async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "No token provided",
      message: "You must be logged in to perform this action",
      name: "UnauthorizedError",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_ADMIN);
    const userId = decodedToken?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Invalid token",
        message: "You must be logged in as an admin to perform this action",
        name: "UnauthorizedError",
      });
    }

    const {
      category,
      brand,
      name,
      imageUrl,
      description,
      min_price,
      max_price,
      currency_code,
      amount,
      availability,
      total_inventory,
    } = req.body;

    const newProduct = await createProducts({
      category,
      brand,
      name,
      imageUrl,
      description,
      min_price,
      max_price,
      currency_code,
      amount,
      availability,
      total_inventory,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/products/:id

router.patch("/:id", async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "No token provided",
      message: "You must be logged in to perform this action",
      name: "UnauthorizedError",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_ADMIN);
    const userId = decodedToken?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Invalid token",
        message: "You must be logged in as an admin to perform this action",
        name: "UnauthorizedError",
      });
    }

    const { id } = req.params;
    const updatedProduct = await updateProduct({ id, ...req.body });
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products

router.delete("/:id", async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "No token provided",
      message: "You must be logged in to perform this action",
      name: "UnauthorizedError",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_ADMIN);
    const userId = decodedToken?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Invalid token",
        message: "You must be logged in as an admin to perform this action",
        name: "UnauthorizedError",
      });
    }

    const { id } = req.params;
    const deletedProduct = await destroyProduct(id);

    if (deletedProduct) {
      res.json(deletedProduct);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;