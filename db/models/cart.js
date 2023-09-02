const client = require("../client");


// This function creates a new cart for a logged-in user or a guest user.
async function createCart({userId, guestId}) {
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
async function addItemToCart({userId, cartId, productId, quantity}) {
  try {
    const cart = await getCartById(cartId);

    const query = `
      INSERT INTO cart_items (user_id, cart_id, product_id, quantity)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const values = [userId, cartId, productId, quantity];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Item could not be added to cart");
    }

    return result.rows[0].id;
  } catch (error) {
    throw new Error("Could not add item to cart: " + error.message);
  }
}

// This function updates the quantity of a product item in the cart.
async function updateCartItemQuantity({userId, cartItemId, newQuantity}) {
  try {
    // Validate input parameters
    if (typeof newQuantity !== 'number' || newQuantity < 0) {
      throw new Error('Invalid quantity value');
    }

    const cartItem = await getCartItemById(cartItemId);
    const cart = await getCartById(cartItem.cart_id);

    const query = `
      UPDATE cart_items
      SET quantity = $1
      WHERE id = $2
      RETURNING *;
    `;
    const values = [newQuantity, cartItemId];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Could not update cart item quantity");
    }

    const updatedCartItem = result.rows[0];
    return updatedCartItem;
  } catch (error) {
    throw new Error('Could not update cart item quantity: ' + error.message);
  }
}

// This function removes a product item from the cart.
async function removeItemFromCart(cartItemId) {
  try {
    const query = `
      DELETE FROM cart_items
      WHERE id = $1
      RETURNING cart_id;
    `;
    const values = [cartItemId];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Item could not be removed from cart");
    }

    return result.rows[0].cart_id;
  } catch (error) {
    throw new Error('Item could not be removed from cart: ' + error.message);
  }
}

async function getCartByUserId(userId) {
  try {
    const query = `
      SELECT *
      FROM carts
      WHERE user_id = $1;
    `;
    const values = [userId];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error('Could not get cart items: ' + error.message);
  }
}

async function getCartByGuestId(userId) {
  try {
    const query = `
      SELECT *
      FROM carts
      WHERE guest_id = $1;
    `;
    const values = [guestId];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error('Could not get cart items: ' + error.message);
  }
}

// This function retrieves all cart items associated with a given cart ID.
async function getCartItemsByCartId(cartId) {
  try {
    const query =
    `
      SELECT *
      FROM cart_items
      WHERE cart_id = $1;
    `;

    const values = [cartId];

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('No cart items found for the given cart ID');
    }

    return result.rows;
  } catch (error) {
    throw new Error('Could not get cart items: ' + error.message)
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
      throw new Error('Cart not found');
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
      throw new Error('Cart item not found');
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
    getCartByUserId,
    getCartItemsByCartId,
    getCartById,
    getCartItemById,
    getCartByGuestId
}