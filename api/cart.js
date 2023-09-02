const express = require('express');
const router = express.Router();
const { verifyToken, checkCartPermission } = require('./authMiddleware');
const { 
  CartError
} = require('../errors');
const {
    createCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    getCartItemsByCartId,
    getCartItemById,
    getCartByUserId,
    getCartByGuestId
} = require("../db/models/cart");

router.use(verifyToken);
router.use(checkCartPermission);

// Create a new cart for a user (both guest and logged-in)
router.post('/cart', async (req, res, next) => {
  try {
    const { userId, guestId } = req.user;
    const cartId = await createCart({ userId, guestId });
    res.json({ cartId });
  } catch (error) {
    next(new CartError('There was an error creating cart'));
  }
});

// Add an item to the cart route with combined permission check
router.post('/cart/items', async (req, res, next) => {
  try {
    const { userId, guestId } = req.user;
    const { productId, quantity } = req.body;

    const cartId = userId ? await getCartByUserId(userId).id : guestId;

    const cartItemId = await addItemToCart({ userId, guestId, cartId, productId, quantity });
    res.json({ cartItemId });
  } catch (error) {
    next(new CartError('There was an error adding an item to the cart.'));
  }
});

// Update the quantity of a cart item
router.put('/cart/items/:cartItemId', async (req, res, next) => {
  try {
    const { userId, guestId } = req.user;
    const { newQuantity } = req.body;
    const { cartItemId } = req.params;

    if (typeof newQuantity !== 'number' || newQuantity < 0) {
      return res.status(400).json({ message: 'Invalid quantity value.' });
    }

    const updatedCartItem = await updateCartItemQuantity({
      userId,
      guestId,
      cartItemId,
      newQuantity,
    });

    res.json({ updatedCartItem });
  } catch (error) {
    next(new CartError('There was an error updating the cart item quantity.'));
  }
});

// Remove a cart item
router.delete('/cart/items/:cartItemId', async (req, res, next) => {
  try {
    const { cartItemId } = req.params;

    const removedCartId = await removeItemFromCart(cartItemId);

    if (!removedCartId) {
      return res.status(404).json({ message: 'Item could not be found in the cart.' });
    }

    res.json({ message: 'Cart item removed successfully.' });
  } catch (error) {
    next(new CartError('There was an error removing the cart item.'));
  }
});

// Retrieve all cart items for a given cart
router.get('/cart/items/:cartId', async (req, res, next) => {
  try {
    const { cartId } = req.params;

    const cartItems = await getCartItemsByCartId(cartId);

    if (!cartItems) {
      return res.status(404).json({ message: 'No cart items found for the given cart ID.' });
    }

    res.json({ cartItems });
  } catch (error) {
    next(new CartError('There was an error retrieving cart items.'));
  }
});

// Retrieve the user's cart
router.get('/cart', async (req, res, next) => {
  try {
    const { userId, guestId } = req.user;

    const cart = userId
      ? await getCartByUserId(userId)
      : await getCartByGuestId(guestId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const cartItems = await getCartItemsByCartId(cart.id);

    res.json({ cart, cartItems });
  } catch (error) {
    next(new CartError('There was an error retrieving the cart.'));
  }
});

// Get cart item information by cart item ID
router.get('/cart/items/:cartItemId', async (req, res, next) => {
  try {
    const { cartItemId } = req.params;

    const cartItem = await getCartItemById(cartItemId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    res.json({ cartItem });
  } catch (error) {
    next(new CartError('There was an error retrieving cart item details.'));
  }
});

module.exports = router;