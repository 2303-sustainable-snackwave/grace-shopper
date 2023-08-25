const client = require("../client");

async function createShippingAddress(userId, street, city, state, postalCode, country) {
    try {
      const result = await client.query(
        `
        INSERT INTO shipping_addresses (user_id, street, city, state, postal_code, country)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [userId, street, city, state, postalCode, country]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error('Could not create shipping address: ' + error.message);
    }
}

async function addShippingAddressToUser(userId, shippingAddressList) {
  try {
    const createdShippingAddresses = [];
    for (const shippingAddress of shippingAddressList) {
      const createdAddress = await createShippingAddress(
        userId,
        shippingAddress.street,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.postalCode,
        shippingAddress.country
      );

      await client.query(
        `
        INSERT INTO user_shipping_addresses (user_id, shipping_address_id)
        VALUES ($1, $2)
        `,
        [userId, createdAddress.id]
      );

      createdShippingAddresses.push(createdAddress);
    }

    return createdShippingAddresses;
  } catch (error) {
    throw new Error('Could not add shipping address: ' + error.message);
  }
}

async function getShippingAddressByUserId(userId) {
  try {
    const query = `
      SELECT ba.id, ba.street, ba.city, ba.state, ba.postal_code, ba.country
      FROM user_shipping_addresses uba
      JOIN shipping_addresses ba ON uba.shipping_address_id = ba.id
      WHERE uba.user_id = $1
    `;
    
    const { rows } = await client.query(query, [userId]);
    return rows;
  } catch (error) {
    throw new Error('Could not get shipping addresses: ' + error.message);
  }
}

async function updateUserShippingAddress(userId, addressId, updatedAddressData) {
  try {
    const { street, city, state, postalCode, country } = updatedAddressData;

    const query = `
      UPDATE shipping_addresses
      SET street = $1, city = $2, state = $3, postal_code = $4, country = $5
      FROM user_shipping_addresses uba
      WHERE uba.user_id = $6 AND uba.shipping_address_id = $7
      RETURNING *
    `;

    const values = [street, city, state, postalCode, country, userId, addressId];
    const { rows: [updatedShippingAddress] } = await client.query(query, values);

    if (!updatedShippingAddress) {
      throw new Error(`Shipping address with ID ${addressId} not found for user with ID ${userId}.`);
    }

    return updatedShippingAddress;
  } catch (error) {
    throw new Error('Could not update shipping address: ' + error.message);
  }
}

async function deleteShippingAddress(userId, addressId) {
  try {
    const shippingAddress = await client.query(
      `
      SELECT user_id, shipping_address_id
      FROM user_shipping_addresses
      WHERE id = $1
      `,
      [addressId]
    );

    if (!shippingAddress || shippingAddress.rows.length === 0) {
      throw new Error(`Shipping address with ID ${addressId} not found.`);
    }

    if (shippingAddress.rows[0].user_id !== userId) {
      throw new Error('You do not have permission to delete this shipping address.');
    }

    await client.query(
      `
      DELETE FROM user_shipping_addresses
      WHERE id = $1
      `,
      [addressId]
    );

    await client.query(
      `
      DELETE FROM shipping_addresses
      WHERE id = $1
      `,
      [shippingAddress.rows[0].shipping_address_id]
    );

    return true;
  } catch (error) {
    throw new Error('Could not delete shipping address: ' + error.message);
  }
}

module.exports = {
  createShippingAddress,
  getShippingAddressByUserId,
  addShippingAddressToUser,
  deleteShippingAddress,
  updateUserShippingAddress
}
