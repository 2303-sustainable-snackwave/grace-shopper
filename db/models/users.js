const bcrypt = require('bcrypt');
const client = require("../client");
const { addBillingAddressToUser, getBillingAddressByUserId } = require('./billingAddress');
const { addShippingAddressToUser, getShippingAddressByUserId } = require('./shippingAddress');

// database functions

// user functions
async function createUser({ 
  name, 
  email, 
  password, 
  role, 
  billingAddressList,
  shippingAddressList}) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows: [user] } = await client.query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [name, email, hashedPassword, role]
    );

    delete user.password;


    if (billingAddressList && billingAddressList.length > 0) {
      await addBillingAddressToUser(user.id, billingAddressList);
    }

    if (shippingAddressList && shippingAddressList.length > 0) {
      await addShippingAddressToUser(user.id, shippingAddressList);
    }

    return user;
  } catch (error) {
    throw new Error('Could not create user: ' + error.message);
  }
}

async function getUser({ name, password }) {
  try {
   
    const user = await getUserByUsername(name);

    if (!user) {
      return null;
    }

    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordsMatch) {
      return null;
    }


    delete user.password;

    return user;
  } catch (error) {
    throw new Error('Could not locate user ' + error.message);
  }
}

async function getAllUsers() {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM users
    `)
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id, name
      FROM users
      WHERE id = $1
      `,
      [userId]
    );
    user.billing_addresses = await getBillingAddressByUserId(userId);
    user.shipping_addresses = await getShippingAddressByUserId(userId);
  
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    throw new Error('Could not get user: ' + error.message);
  }
}



async function getUserByName(name) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE name=$1;
      `,
      [name]
    );

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    throw new Error('Could not locate username: ' + error.message);
  }
}

async function getUserByEmail(email) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id, name
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    throw new Error('Could not locate user email: ' + error.message);
  }
}

async function updateUser(userId, { name, email, password, role }) {
  try {
    const { rows: [user] } = await client.query(
      `
      UPDATE users
      SET name = $1, email = $2, password = $3, role = $4
      WHERE id = $5
      RETURNING *;
      `,
      [name, email, password, role, userId]
    );

    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    delete user.password;

    return user;
  } catch (error) {
    throw new Error(`Could not update user: ${error.message}`);
  }
}

async function deleteUser(userId) {
  try {
    const { rows: [user] } = await client.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING *;
      `,
      [userId]
    );

    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    delete user.password;

    return user;
  } catch (error) {
    throw new Error(`Could not delete user: ${error.message}`);
  }
}

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  getUserById,
  getUserByName,
  getUserByEmail,
  updateUser,
  deleteUser
}
