const client = require("./client");

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
          createdShippingAddresses.push(createdAddress);
      }

      return createdShippingAddresses;
  } catch (error) {
      throw error;
  }
}

async function getShippingAddressByUserId(userId) {
  try {
    const { rows } = await client.query(
      `SELECT * 
      FROM shipping_addresses 
      WHERE user_id = $1
      `, 
      [userId]);

    return rows;
  } catch (error) {
    throw new Error('Could not get shipping address: ' + error.message);
  }
}


module.exports = {
  createShippingAddress,
  getShippingAddressByUserId,
  addShippingAddressToUser
}
