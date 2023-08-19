const bcrypt = require('bcrypt');
const client = require("../client");
const { addBillingAddressToUser, getBillingAddressByUserId } = require('./billingAddress');
const { addShippingAddressToUser, getShippingAddressByUserId } = require('./shippingAddress');

// database functions

// user functions
async function createUser({ name, email, password }) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start a transaction
    await client.query('BEGIN');

    const { rows: [user] } = await client.query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [name, email, hashedPassword, 'user']
      [name, email, hashedPassword, 'user']
    );

    delete user.password;

    if (billingAddressList && billingAddressList.length > 0) {
      await addBillingAddressToUser(user.id, billingAddressList);
    }

    if (shippingAddressList && shippingAddressList.length > 0) {
      await addShippingAddressToUser(user.id, shippingAddressList);
    }

    // Commit the transaction
    await client.query('COMMIT');

    return user;
  } catch (error) {
    // Rollback the transaction on error
    await client.query('ROLLBACK');
    throw new Error('Could not create user: ' + error.message);
  }
}

async function getUser({ name, password }) {
  try {
   
    const user = await getUserByName(name);

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
      SELECT id, name, password, email, role
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
    delete user.password;
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
    throw new Error('Could not locate name: ' + error.message);
  }
}

async function getUserByEmail(email) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id, name, password, email
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (!user) {
      return null;
    }
    delete user.password;
    return user;
  } catch (error) {
    throw new Error('Could not locate user email: ' + error.message);
  }
}

async function updateUser(userId, updatedFields, requestingUserRole) {
  try {
    const { name, email, password, role } = updatedFields;

    if (requestingUserRole !== 'admin' && userId !== updatedFields.userId) {
      throw new Error('You do not have permission to update this user.');
    }

    if (email) {
      const existingUser = await getUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Email already exists for another user.');
      }
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    let query = `
      UPDATE users
      SET name = $1, email = $2
    `;

    const values = [name, email];

    if (hashedPassword) {
      query += ', password = $3';
      values.push(hashedPassword);
    }

    if (requestingUserRole === 'admin') {
      query += ', role = $' + (values.length + 1);
      values.push(role);
    }

    query += `
      WHERE id = $${values.length + 1}
      RETURNING *;
    `;

    const { rows: [updatedUser] } = await client.query(query, [...values, userId]);

    if (!updatedUser) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    delete updatedUser.password;

    return updatedUser;
  } catch (error) {
    throw new Error('Could not update user: ' + error.message);
    throw new Error('Could not update user: ' + error.message);
  }
}

async function deleteUser(userId, requestingUserRole) {
  try {
    if (requestingUserRole !== 'admin') {
      throw new Error('Only admin users can delete users.');
    }

    const result = await client.query(
      `
      UPDATE users
      SET role = 'deleted'
      WHERE id = $1
      `,
      [userId]
    );

    if (result.rowCount === 0) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    return true;
  } catch (error) {
    throw new Error('Could not delete user: ' + error.message);
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
