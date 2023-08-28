const client = require("../client");


// This function creates a new cart for a logged-in user or a guest user.
async function createCart(userId, guestId) {
  try {
    const query = `
      INSERT INTO carts (user_id, guest_id)
      VALUES ($1, $2)
      RETURNING id;
    `;
    const values = [userId, guestId];
    const result = await client.query(query, values);
    return result.rows[0].id;
  } catch (error) {
    throw new Error('Could not create cart: ' + error.message);
  }
}

// This function adds a product item to the cart
async function addItemToCart(userId, cartId, productId, quantity) {
  try {

    const cart = await getCartById(cartId);
    if (cart.user_id !== userId) {
      throw new Error('You do not have permission to update this cart.');
    }

    const query = `
      INSERT INTO cart_items (cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const values = [cartId, productId, quantity];
    const result = await client.query(query, values);
    return result.rows[0].id;
  } catch (error) {
    throw new Error('Could not add item to cart: ' + error.message);
  }
}

// This function updates the quantity of a product item in the cart.
async function updateCartItemQuantity(userId, cartItemId, newQuantity) {
  try {

    const cartItem = await getCartItemById(cartItemId);
    const cart = await getCartById(cartItem.cart_id);
    if (cart.user_id !== userId) {
      throw new Error('You do not have permission to update this cart item.');
    }

    const query = `
      UPDATE cart_items
      SET quantity = $1
      WHERE id = $2;
    `;
    const values = [newQuantity, cartItemId];
    await client.query(query, values);
    return true;
  } catch (error) {
    throw new Error('Could not update cart item quantity: ' + error.message);
  }
}

// This function removes a product item from the cart.
async function removeItemFromCart(userId, cartItemId) {
  try {

    const cartItem = await getCartItemById(cartItemId);
    const cart = await getCartById(cartItem.cart_id);
    if (cart.user_id !== userId) {
      throw new Error('You do not have permission to remove this cart item.');
    }

    const query = `
      DELETE FROM cart_items
      WHERE id = $1;
    `;
    const values = [cartItemId];
    await client.query(query, values);
    return true;
  } catch (error) {
    throw new Error('Could not remove item from cart: ' + error.message);
  }
}

// This function retrieves all cart items associated with a given cart ID.
async function getCartItemsByCartId(cartId) {
  try {
    const query = `
      SELECT * FROM cart_items
      WHERE cart_id = $1;
    `;
    const values = [cartId];
    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    throw new Error('Could not get cart items: ' + error.message);
  }
}

// These functions retrieve cart and cart item information 
// from the database based on their IDs. 
// If the provided IDs do not correspond to existing records, 
// they throw an error indicating that the cart or cart item was not found.
async function getCartById(cartId) {
  try {
    const query = `
      SELECT *
      FROM carts
      WHERE id = $1;
    `;
    const values = [cartId];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Cart not found.');
    }

    return result.rows[0];
  } catch (error) {
    throw new Error('Could not get cart: ' + error.message);
  }
}

async function getCartItemById(cartItemId) {
  try {
    const query = `
      SELECT *
      FROM cart_items
      WHERE id = $1;
    `;
    const values = [cartItemId];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Cart item not found.');
    }

    return result.rows[0];
  } catch (error) {
    throw new Error('Could not get cart item: ' + error.message);
  }
}

module.exports = {
    createCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    getCartItemsByCartId,
    getCartById,
    getCartItemById
}