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
      const fakeCart = {
        user_id: user.id,
        guest_id: null,
        product_id: product.id
      };
      
      const cart = await createFakeCart(fakeCart);

      expect(cart.cart_id).toBeDefined();
    });

    xit('creates a new cart for a guest', async () => {
      const product = await createFakeBikeProduct();

      const fakeCart = {
        user_id: null,
        guest_id: 'some_valid_uuid_here',
        product_id: product.id
      };
      
      const cart = await createFakeCart(fakeCart);

      expect(cart.cart_id).toBeDefined();
    });    
  });

  describe('addItemToCart', () => {
    xit('adds a new product item to an existing cart', async () => {
      
      const user = await createFakeUser();
      console.log("user data", user);
      
      const product = await createFakeBikeProduct();
      console.log("product data", product);
      
      const fakeCart = {
        user_id: user.id,
        guest_id: null,
        product_id: product.id
      };
      
      const cart = await createFakeCart(fakeCart);
      console.log("fakeCart data", fakeCart);
      
      const newProduct = await createFakeBikeProduct();
      console.log("newProduct data", newProduct);
      
      const newItemData = {
        userId: user.id,
        cartId: cart.cart_id, 
        productId: newProduct.id,
        quantity: 1
      };
      console.log("new item data", newItemData);

      const cartItemId = await addItemToCart(newItemData);
      console.log("cartItemId data", cartItemId);
      expect(cartItemId).toBeDefined();
    });

    xit('adds a product item to the cart for a guest', async () => {
      
      const product = await createFakeBikeProduct();
      console.log("product data", product);
      
      const fakeCart = {
        user_id: null,
        guest_id: 'some_valid_uuid_here',
        product_id: product.id
      };
      
      const cart = await createFakeCart(fakeCart);
      console.log("fakeCart data", fakeCart);
      
      const newProduct = await createFakeBikeProduct();
      console.log("newProduct data", newProduct);
      
      const newItemData = {
        guestId: 'some_valid_uuid_here',
        cartId: cart.cart_id, 
        productId: newProduct.id,
        quantity: 1
      };
      console.log("new item data", newItemData);

      const cartItemId = await addItemToCart(newItemData);
      console.log("cartItemId data", cartItemId);
      expect(cartItemId).toBeDefined();
    });
  });

  describe('updateCartItemQuantity', () => {
    xit('updates the quantity of an existing cart item', async () => {
    
      const user = await createFakeUser();
  

      const product = await createFakeBikeProduct();
  
      const fakeCart = await createFakeCart({
        userId: user.id,
        productId: product.id
      });
  
      const newItemData = {
        userId: user.id,
        cartId: fakeCart.cart_id,
        productId: product.id,
        quantity: 1
      };
      const cartItemId = await addItemToCart(newItemData);
  
      const newQuantity = 3;
      const updatedCartItem = await updateCartItemQuantity({
        userId: user.id,
        cartItemId: cartItemId,
        newQuantity: newQuantity
      });
  
      expect(updatedCartItem.quantity).toEqual(newQuantity);
    });

    xit('throws an error for invalid quantity values', async () => {
      
      const user = await createFakeUser();
  
      const product = await createFakeBikeProduct();
  
      const fakeCart = await createFakeCart({
        userId: user.id,
        productId: product.id
      });
  
      const newItemData = {
        userId: user.id,
        cartId: fakeCart.cart_id,
        productId: product.id,
        quantity: 1
      };
      const cartItemId = await addItemToCart(newItemData);
  
      const invalidQuantity = -1;
      await expect(
        updateCartItemQuantity({
          userId: user.id,
          cartItemId: cartItemId,
          newQuantity: invalidQuantity
        })
      ).rejects.toThrow('Invalid quantity value');
    });
  });

  describe('removeItemFromCart', () => {
    xit('removes a product item from the cart', async () => {
      
      const fakeUser = await createFakeUser();
      const product = await createFakeBikeProduct();
      const fakeCartItem = await createFakeCart({ userId: fakeUser.id, productId: product.id });
      console.log('fake cart data', fakeCartItem);
      const cartId = await removeItemFromCart(fakeCartItem.cart_item_id);
      console.log('remove cart data', cartId);

      try {
        await getCartItemById(fakeCartItem.cart_item_id);
      
        expect(true).toBe(false); 
      } catch (error) {
        expect(error.message).toContain('Cart item not found');
      }

      const cartData = await getCartById(fakeCartItem.cart_id);
      console.log('cart data', cartData);

      const cartUpdatedAt = new Date(cartData.updated_at).getTime();
      const cartItemUpdatedAt = new Date(fakeCartItem.updated_at).getTime();

      expect(cartUpdatedAt).toBeGreaterThan(cartItemUpdatedAt);
    });
  
    xit('throws an error for non-existent cart item', async () => {
      // Create a fake cart item ID that doesn't exist in the database
      const nonExistentCartItemId = 999999; // Replace with a non-existent ID
  
      // Try to remove the non-existent cart item
      try {
        await removeItemFromCart(nonExistentCartItemId);
        // The above line should not be reached, as removeItemFromCart should throw an error
        expect(true).toBe(false); // Fail the test if removeItemFromCart doesn't throw an error
      } catch (error) {
        // Expect an error indicating that the cart item was not found
        expect(error.message).toContain('Item could not be removed from cart');
      }
    });  
  });

  describe('getCartItemsByCartId', () => {
    xit('retrieves cart items for a valid cart ID', async () => {
      const user = await createFakeUser();
  
      const product = await createFakeBikeProduct();
  
      const fakeCart = await createFakeCart({
        userId: user.id,
        productId: product.id
      });
  
      const cartItems = await getCartItemsByCartId(fakeCart.cart_id);
  
      expect(Array.isArray(cartItems)).toBeTruthy();
      expect(cartItems.length).toBeGreaterThan(0);
    });
  
    xit('throws an error when no cart items are found for a valid cart ID', async () => {
      
      const user = await createFakeUser();
  
      const fakeCart = await createFakeCart({
        userId: user.id,
        guestId: null,
        productId: null,
      });
      await expect(getCartItemsByCartId(fakeCart.cart_id)).rejects.toThrow('Could not get cart items: No cart items found for the given cart ID');
    });
  });

  describe('getCartById', () => {
    xit('retrieves cart information by cart ID', async () => {
      const user = await createFakeUser();
      const product = await createFakeBikeProduct();
      const fakeCart = await createFakeCart({
        userId: user.id,
        productId: product.id
      });
  
      const retrievedCart = await getCartById(fakeCart.cart_id);
    
      expect(retrievedCart).toBeDefined();
      expect(retrievedCart.id).toBe(fakeCart.cart_id);
      expect(retrievedCart.user_id).toBe(user.id);
    });
  
    xit('throws an error if cart ID does not exist', async () => {
      await expect(getCartById(123)).rejects.toThrow('Could not get cart:');
    });
  });

  describe('getCartItemById', () => {
    xit('retrieves a cart item by item ID', async () => {
      const user = await createFakeUser();
      const product = await createFakeBikeProduct();
      const fakeCart = await createFakeCart({
        userId: user.id,
        productId: product.id
      });
  
      const cartItem = await getCartItemById(fakeCart.cart_item_id);
  
      expect(cartItem).toBeDefined();
      expect(cartItem.id).toBe(fakeCart.cart_item_id);
      expect(cartItem.user_id).toBe(user.id);
      expect(cartItem.product_id).toBe(product.id);
      expect(cartItem.quantity).toBe(1);
    });
  
    xit('throws an error if cart item ID is invalid', async () => {
      await expect(getCartItemById(123)).rejects.toThrow('Could not get cart item:');
    });
  });
});