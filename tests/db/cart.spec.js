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
    xit('creates a new cart for a user', async () => {
      const user = await createFakeUser();
      const product = await createFakeBikeProduct();
      const cartId = await createFakeCart(user.id, null, product.id);

      expect(cartId).toBeDefined();
    });

    xit('creates a new cart for a guest', async () => {
      const product = await createFakeBikeProduct();
      const cartId = await createFakeCart(null, product.id);

      expect(cartId).toBeDefined();
    });    
  });

  describe('addItemToCart', () => {
    xit('adds a new product item to an existing cart', async () => {
      const user = await createFakeUser();

      const product = await createFakeBikeProduct();

      const cart = await createFakeCart(user.id, null, product.id);

      const newproduct = await createFakeBikeProduct();

      const cartItemId = await addItemToCart(user.id, cart.cart_id, newproduct.id, 1);
   
      expect(cartItemId).toBeDefined();
    });

    xit('adds a product item to the cart for a guest', async () => {
      const product = await createFakeBikeProduct();

      const cart = await createFakeCart(null, product.id);

      const newproduct = await createFakeBikeProduct();

      const cartItemId = await addItemToCart(null, cart.cart_id, newproduct.id, 1);
   
      expect(cartItemId).toBeDefined();
    });
  
    xit('throws an error if non-owner tries to add item to cart', async () => {
      const user = await createFakeUser();
      const anotherUser = await createFakeUser();
      const product = await createFakeBikeProduct();
      const cart = await createFakeCart(user.id, null, product.id);

      await expect(
        addItemToCart(anotherUser.id, cart.cart_id, product.id, 1)
      ).rejects.toThrow("You do not have permission to update this cart.");
    });
  });

  describe('updateCartItemQuantity', () => {
    xit('updates the quantity of a cart item', async () => {
      const user = await createFakeUser();
      const product = await createFakeBikeProduct();
      const cart = await createFakeCart(user.id, product.id);
      const newQuantity = 2;
    
      const updatedCartItem = await updateCartItemQuantity(
        user.id,
        cart.cart_item_id, 
        newQuantity
      );
    
      expect(updatedCartItem).toBeDefined();
      expect(updatedCartItem.id).toBe(cart.cart_item_id);
      expect(updatedCartItem.quantity).toBe(newQuantity);
    });
  
    xit('removes a cart item if the quantity is set to 0', async () => {
      
      const user = await createFakeUser();
      const product = await createFakeBikeProduct();
      const cart = await createFakeCart(user.id, product.id);
      const cartItemId = cart.cart_item_id;
  
      const newQuantity = 0;
      const updatedCartItem = await updateCartItemQuantity(user.id, cartItemId, newQuantity);
  
      expect(updatedCartItem).toBeNull();
    });
  
    xit('throws an error for invalid quantity values', async () => {
      const user = await createFakeUser();
      const product = await createFakeBikeProduct();
      const cart = await createFakeCart(user.id, product.id);
      const cartItemId = cart.cart_item_id;
  
      const invalidQuantities = [null, 'invalid', -1];
      for (const invalidQuantity of invalidQuantities) {
        await expect(updateCartItemQuantity(user.id, cartItemId, invalidQuantity)).rejects.toThrow('Invalid quantity value');
      }
    });
  
    xit('throws an error if user does not have permission to update the cart item', async () => {
      const user1 = await createFakeUser();
      const user2 = await createFakeUser();
      const product = await createFakeBikeProduct();
      const cart = await createFakeCart(user1.id, product.id);
      const cartItemId = cart.cart_item_id;
  
      await expect(updateCartItemQuantity(user2.id, cartItemId, 2)).rejects.toThrow("You do not have permission to update this cart item.");
    });
  });

  describe('removeItemFromCart', () => {
    xit('removes a product item from the cart', async () => {
      const user = await createFakeUser();
      const cart = await createFakeCart(user.id, null);
      const product = await createFakeBikeProduct();
      const cartItemId = await addItemToCart(user.id, cart.cart_id, product.id, 1);
  
      const removed = await removeItemFromCart(user.id, cartItemId);
  
      expect(removed).toBe(true);
    });
  
    xit('throws an error if user does not have permission to remove the cart item', async () => {
      const user1 = await createFakeUser();
      const user2 = await createFakeUser();
      const cart = await createFakeCart(user1.id, null);
      const product = await createFakeBikeProduct();
      const cartItemId = await addItemToCart(user1.id, cart.cart_id, product.id, 1);
  
      await expect(removeItemFromCart(user2.id, cartItemId)).rejects.toThrow('You do not have permission to remove this cart item.');
    });
  
    xit('throws an error if cart item is not found', async () => {
      const user = await createFakeUser();
  
      await expect(removeItemFromCart(user.id, 123)).rejects.toThrow('Could not remove item from cart: Cart item not found.');
    });
  });

  describe('getCartItemsByCartId', () => {
    xit('retrieves cart items by cart ID', async () => {
      const user = await createFakeUser();
      const product = await createFakeBikeProduct();
      const cart = await createFakeCart(user.id, null, product.id);

      const product2 = await createFakeBikeProduct();
      const cartItemId2 = await addItemToCart(user.id, cart.cart_id, product2.id, 1);

      const cartItems = await getCartItemsByCartId(cart.cart_id);
    
      expect(cartItems.length).toBe(2);
    
      expect(cartItems[0].product_id).toBe(cart.product_id);
      expect(cartItems[1].id).toBe(cartItemId2);
    });
  
    xit('throws an error if the cart ID is invalid', async () => {
      await expect(getCartItemsByCartId(9999999)).rejects.toThrow('Could not get cart items:');
    });
  });

  describe('getCartById', () => {
    xit('retrieves cart information by cart ID', async () => {
      const user = await createFakeUser();
      const cart = await createFakeCart(user.id, null);
    
      const retrievedCart = await getCartById(cart.cart_id);
    
      expect(retrievedCart).toBeDefined();
      expect(retrievedCart.id).toBe(cart.cart_id);
      expect(retrievedCart.user_id).toBe(user.id);
    });
  
    xit('throws an error if cart ID does not exist', async () => {
      await expect(getCartById(123)).rejects.toThrow('Could not get cart:');
    });
  });

  describe('getCartItemById', () => {
    xit('retrieves a cart item by ID', async () => {
      const user = await createFakeUser();
      const product = await createFakeBikeProduct();
      const cart = await createFakeCart(user.id, null, product.id);
      const cartItemId = await addItemToCart(user.id, cart.cart_id, product.id, 1);
  
      const cartItem = await getCartItemById(cartItemId);
  
      expect(cartItem).toBeDefined();
      expect(cartItem.id).toBe(cartItemId);
      expect(cartItem.user_id).toBe(user.id);
      expect(cartItem.product_id).toBe(product.id);
      expect(cartItem.quantity).toBe(1);
    });
  
    xit('throws an error if cart item ID is invalid', async () => {
      await expect(getCartItemById(123)).rejects.toThrow('Could not get cart item:');
    });
  });
});