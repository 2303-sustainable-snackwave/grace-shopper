const client = require("../client");

async function createBillingAddress({userId, street, city, state, postalCode, country}) {
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

async function addBillingAddressToUser({userId, billingAddressList}) {
  try {    
    const createdBillingAddresses = [];
    for (const billingAddress of billingAddressList) {

      const createdAddress = billingAddress;

      await client.query(
        `
        INSERT INTO user_billing_addresses (user_id, billing_address_id)
        VALUES ($1, $2)
        `,
        [userId, createdAddress.id]
      );

      createdBillingAddresses.push(createdAddress);
    }

    return createdBillingAddresses;
  } catch (error) {
    throw new Error('Could not add billing address: ' + error.message);
  }
}

async function getBillingAddressByUserId(userId) {
  try {
    const query = `
      SELECT ba.id, ba.street, ba.city, ba.state, ba.postal_code, ba.country
      FROM user_billing_addresses uba
      JOIN billing_addresses ba ON uba.billing_address_id = ba.id
      WHERE uba.user_id = $1
    `;
    
    const { rows } = await client.query(query, [userId]);
    return rows;
  } catch (error) {
    throw new Error('Could not get billing addresses: ' + error.message);
  }
}

async function updateUserBillingAddress({userId, addressId, updatedAddressData}) {
  try {
    const { street, city, state, postalCode, country } = updatedAddressData;

    const query = `
      UPDATE billing_addresses AS ba
      SET street = $1, city = $2, state = $3, postal_code = $4, country = $5
      FROM user_billing_addresses AS uba
      WHERE uba.user_id = $6 AND uba.billing_address_id = $7 AND ba.id = uba.billing_address_id
      RETURNING ba.*
    `;

    const values = [street, city, state, postalCode, country, userId, addressId];
    const { rows: [updatedBillingAddress] } = await client.query(query, values);

    if (!updatedBillingAddress) {
      throw new Error(`Billing address with ID ${addressId} not found for user with ID ${userId}.`);
    }

    return updatedBillingAddress;
  } catch (error) {
    throw new Error('Could not update billing address: ' + error.message);
  }
}

async function deleteBillingAddress(addressId) {
  try {
    const billingAddressInfo = await client.query(
      `
      SELECT billing_address_id, user_id
      FROM user_billing_addresses
      WHERE id = $1
      `,
      [addressId]
    );

    if (!billingAddressInfo || billingAddressInfo.rows.length === 0) {
      throw new Error(`Billing address with ID ${addressId} not found.`);
    }

    await client.query(
      `
      DELETE FROM user_billing_addresses
      WHERE id = $1
      `,
      [addressId]
    );

    await client.query(
      `
      DELETE FROM billing_addresses
      WHERE id = $1
      `,
      [billingAddressInfo.rows[0].billing_address_id]
    );

    return true; 
  } catch (error) {
    throw new Error('Could not delete billing address: ' + error.message);
  }
}


module.exports = {
  createBillingAddress,
  getBillingAddressByUserId,
  addBillingAddressToUser,
  updateUserBillingAddress,
  deleteBillingAddress
}
