const client = require("./client");

async function createBillingAddress(userId, street, city, state, postalCode, country) {
    try {
      const result = await client.query(
        `
        INSERT INTO billing_addresses (user_id, street, city, state, postal_code, country)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [userId, street, city, state, postalCode, country]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error('Could not create billing address: ' + error.message);
    }
}

async function addBillingAddressToUser(userId, billingAddressList) {
  try {
      const createdBillingAddresses = [];
      for (const billingAddress of billingAddressList) {
          const createdAddress = await createBillingAddress(
              userId,
              billingAddress.street,
              billingAddress.city,
              billingAddress.state,
              billingAddress.postalCode,
              billingAddress.country
          );
          createdBillingAddresses.push(createdAddress);
      }

      return createdBillingAddresses;
  } catch (error) {
      throw error;
  }
}

async function getBillingAddressByUserId(userId) {
  try {
    const { rows } = await client.query(
      `SELECT * 
      FROM billing_addresses 
      WHERE user_id = $1
      `, 
      [userId]);

    return rows;
  } catch (error) {
    throw new Error('Could not get billing address: ' + error.message);
  }
}


module.exports = {
  createBillingAddress,
  getBillingAddressByUserId,
  addBillingAddressToUser
}
