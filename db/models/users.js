const bcrypt = require('bcrypt');
const client = require("./client");

// database functions

// user functions
async function createUser({ username, email, password, role }) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows: [user] } = await client.query(
      `
      INSERT INTO users (username, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [username, email, hashedPassword, role]
    );

    delete user.password;

    return user;
  } catch (error) {
    throw new Error('Could not create user: ' + error.message);
  }
}

async function getUser({ username, password }) {
  try {
   
    const user = await getUserByUsername(username);

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

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id, username
      FROM users
      WHERE id = $1
      `,
      [userId]
    );
  
    if (!user) {
      return null;
    }

    return user;
  } catch (error) { 
    throw new Error('Could not locate user with id: ' + error.message);
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
      `,
      [username]
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
      SELECT id, username
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

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
  getUserByEmail
}
