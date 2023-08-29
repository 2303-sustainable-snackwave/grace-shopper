/*

DO NOT CHANGE THIS FILE

*/
if (typeof TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;
}
require("dotenv").config();
const client = require("../../db/client");
const { faker } = require('@faker-js/faker');
const {
    createCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    getCartItemsByCartId,
    getCartById,
    getCartItemById
} = require("../../db/models");
const { 
  createFakeUser,
  createFakeBikeProduct,
  createFakeCart
} = require("../helpers");

describe('Cart Database Functions', () => {
  describe('createCart', () => {
    it('creates a new cart for a user', async () => {
      const user = await createFakeUser();
      const cartId = await createFakeCart(user.id, null);
      expect(cartId).toBeDefined();
    });

    it('creates a new cart for a guest', async () => {
      const cartId = await createFakeCart(null, 'fakeGuestId');
      expect(cartId).toBeDefined();
    });
  });

  describe('addItemToCart', () => {
    it('adds a product item to the cart', async () => {
      const user = await createFakeUser();
      const cartId = await createFakeCart({ user_id: user.id });
      const product = await createFakeBikeProduct();
      const cartItemId = await addItemToCart(user.id, cartId, product.id, 1);
      expect(cartItemId).toBeDefined();
    });
  
    it('throws an error if non-owner tries to add item to cart', async () => {
      const user = await createFakeUser();
      const cartId = await createFakeCart({ user_id: user.id });
      const anotherUser = await createFakeUser();
      const product = await createFakeBikeProduct();
  
      await expect(
        addItemToCart(anotherUser.id, cartId, product.id, 1)
      ).rejects.toThrow("You do not have permission to update this cart.");
    });
  });

  describe('updateCartItemQuantity', () => {
    it('updates the quantity of a cart item', async () => {
      const user = await createFakeUser();
      const cartId = await createFakeCart(user.id, null);
      const product = await createFakeBikeProduct();
      const cartItemId = await addItemToCart(user.id, cartId, product.id, 1);
      const newQuantity = 2;
  
      const result = await updateCartItemQuantity(user.id, cartItemId, newQuantity);
      expect(result).toBe(true);
    });
  
    it('throws an error if non-owner tries to update cart item quantity', async () => {
      const user = await createFakeUser();
      const cartId = await createFakeCart(user.id, null);
      const product = await createFakeBikeProduct();
      const cartItemId = await addItemToCart(user.id, cartId, product.id, 1);
      const anotherUser = await createFakeUser();
      const newQuantity = 2;
  
      await expect(
        updateCartItemQuantity(anotherUser.id, cartItemId, newQuantity)
      ).rejects.toThrow("You do not have permission to update this cart item.");
    });
  });

  describe('removeItemFromCart', () => {
    it('removes a product item from the cart', async () => {
      const user = await createFakeUser();
      const cartId = await createFakeCart(user.id, null);
      const product = await createFakeBikeProduct();
      const cartItemId = await addItemToCart(user.id, cartId, product.id, 1);
  
      const result = await removeItemFromCart(user.id, cartItemId);
      expect(result).toBe(true);
    });
  
    it('throws an error if non-owner tries to remove item from cart', async () => {
      const user = await createFakeUser();
      const cartId = await createFakeCart(user.id, null);
      const product = await createFakeBikeProduct();
      const cartItemId = await addItemToCart(user.id, cartId, product.id, 1);
      const anotherUser = await createFakeUser();
  
      await expect(
        removeItemFromCart(anotherUser.id, cartItemId)
      ).rejects.toThrow("You do not have permission to remove this cart item.");
    });
  });

  describe('getCartItemsByCartId', () => {
    it('retrieves all cart items associated with a given cart ID', async () => {
      const user = await createFakeUser();
      const cartId = await createFakeCart(user.id, null);
      const product1 = await createFakeBikeProduct();
      const product2 = await createFakeBikeProduct();
      await addItemToCart(user.id, cartId, product1.id, 1);
      await addItemToCart(user.id, cartId, product2.id, 2);
  
      const cartItems = await getCartItemsByCartId(cartId);
      expect(cartItems.length).toBe(2);
      expect(cartItems[0].product_id).toBe(product1.id);
      expect(cartItems[1].product_id).toBe(product2.id);
    });
  
    it('returns an empty array if no cart items are associated with the given cart ID', async () => {
      const user = await createFakeUser();
      const cartId = await createFakeCart(user.id, null);
  
      const cartItems = await getCartItemsByCartId(cartId);
      expect(cartItems.length).toBe(0);
    });
  
  });

  describe('getCartById', () => {
    it('retrieves cart information by cart ID', async () => {
      const user = await createFakeUser();
      const cartId = await createFakeCart(user.id, null);
  
      const cart = await getCartById(cartId);
      expect(cart.id).toBe(cartId);
      expect(cart.user_id).toBe(user.id);
    });
  
    it('throws an error if cart ID does not exist', async () => {
      const nonExistingCartId = -1;
  
      await expect(
        getCartById(nonExistingCartId)
      ).rejects.toThrow("Cart not found.");
    });
  
  });

  describe('getCartItemById', () => {
    it('retrieves cart item information by cart item ID', async () => {
      const user = await createFakeUser();
      const cartId = await createFakeCart(user.id, null);
      const product = await createFakeBikeProduct();
      const cartItemId = await addItemToCart(user.id, cartId, product.id, 1);
  
      const cartItem = await getCartItemById(cartItemId);
      expect(cartItem.id).toBe(cartItemId);
      expect(cartItem.product_id).toBe(product.id);
    });
  
    it('throws an error if cart item ID does not exist', async () => {
      const nonExistingCartItemID = -1;
  
      await expect(
        getCartItemById(nonExistingCartItemID)
      ).rejects.toThrow("Cart item not found.");
    });
  
  });
});