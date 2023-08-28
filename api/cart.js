const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();
const {
    createCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    getCartItemsByCartId,
    getCartById,
    getCartItemById
} = require("../db/models/cart");

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  
  // Check if token is present
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid token.' });
    }
  }

  // Allow guests to proceed without token
  next();
}

router.use(verifyToken);

// Create a new cart for a user (both guest and logged-in)
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { userId, guestId } = req.body;
    const cartId = await createCart(userId, guestId);
    res.json({ cartId });
  } catch (error) {
    next(error);
  }
});

// Add an item to the cart
router.post('/:cartId/items', verifyToken, async (req, res, next) => {
  try {
    const { userId, guestId } = req.body;
    const { cartId } = req.params;

    // If a userId is provided, it's a guest-to-logged-in-user transition
    if (userId) {
      const cart = await getCartById(cartId);
      if (cart.user_id !== userId) {
        res.status(403).json({ message: 'You do not have permission to update this cart item.' });
        return;
      }
    } else if (guestId) {
      const cart = await getCartById(cartId);
      if (cart.guest_id !== guestId) {
        res.status(403).json({ message: 'You do not have permission to update this cart item.' });
        return;
      }
    }

    const { productId, quantity } = req.body;
    const cartItemId = await addItemToCart(userId, guestId, cartId, productId, quantity, guestId);
    res.json({ cartItemId });
  } catch (error) {
    next(error);
  }
});

// Update the quantity of a cart item
router.put('/:cartId/items/:cartItemId', verifyToken, async (req, res, next) => {
  try {
    const { userId, guestId } = req.body;
    const { cartItemId } = req.params;
    const { newQuantity } = req.body;

    const cartItem = await getCartItemById(cartItemId);

    if (userId) {
      const cart = await getCartById(cartItem.cart_id);
      if (cart.user_id !== userId) {
        res.status(403).json({ message: 'You do not have permission to update this cart item.' });
        return;
      }
    } else if (guestId) {
      const cart = await getCartById(cartItem.cart_id);
      if (cart.guest_id !== guestId) {
        res.status(403).json({ message: 'You do not have permission to update this cart item.' });
        return;
      }
    }

    await updateCartItemQuantity(userId, guestId, cartItemId, newQuantity);
    res.json({ message: 'Cart item quantity updated successfully.' });
  } catch (error) {
    next(error);
  }
});

// Remove a cart item
router.delete('/items/:cartItemId', verifyToken, async (req, res, next) => {
  try {
    const { userId, guestId } = req.body;
    const { cartItemId } = req.params;

    const cartItem = await getCartItemById(cartItemId);

    if (userId) {
      const cart = await getCartById(cartItem.cart_id);
      if (cart.user_id !== userId) {
        res.status(403).json({ message: 'You do not have permission to remove this cart item.' });
        return;
      }
    } else if (guestId) {
      const cart = await getCartById(cartItem.cart_id);
      if (cart.guest_id !== guestId) {
        res.status(403).json({ message: 'You do not have permission to update this cart item.' });
        return;
      }
    }

    await removeItemFromCart(userId, guestId, cartItemId);
    res.json({ message: 'Cart item removed successfully.' });
  } catch (error) {
    next(error);
  }
});

// Get all cart items for a given cart ID
router.get('/:cartId/items', async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const cartItems = await getCartItemsByCartId(cartId);
    res.json(cartItems);
  } catch (error) {
    next(error);
  }
});

// Get cart information by cart ID
router.get('/:cartId', async (req, res, next) => {
  const { userId, guestId } = req.body;
  const { cartId } = req.params;

  try {
    if (userId) {
      const cart = await getCartById(cartId);
      if (cart.user_id !== userId) {
        res.status(403).json({ message: 'You do not have permission to access this cart.' });
        return;
      }
    } else if (guestId) {
      const cart = await getCartById(cartId);
      if (cart.guest_id !== guestId) {
        res.status(403).json({ message: 'You do not have permission to access this cart.' });
        return;
      }
    }

    const cartItems = await getCartItemsByCartId(cartId);
    res.json(cartItems);
  } catch (error) {
    next(error);
  }
});

// Get cart item information by cart item ID
router.get('/:cartId/items/:cartItemId', async (req, res, next) => {
  const { userId, guestId } = req.body;
  const { cartItemId } = req.params;

  try {
    if (userId) {
      const cartItem = await getCartItemById(cartItemId);
      const cart = await getCartById(cartItem.cart_id);
      if (cart.user_id !== userId) {
        res.status(403).json({ message: 'You do not have permission to access this cart item.' });
        return;
      }
    } else if (guestId) {
      const cartItem = await getCartItemById(cartItemId);
      const cart = await getCartById(cartItem.cart_id);
      if (cart.guest_id !== guestId) {
        res.status(403).json({ message: 'You do not have permission to access this cart item.' });
        return;
      }
    }

    const cartItem = await getCartItemById(cartItemId);
    res.json(cartItem);
  } catch (error) {
    next(error);
  }
});

module.exports = router;