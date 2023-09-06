/*

DO NOT CHANGE THIS FILE

*/
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
require("dotenv").config();
const request = require("supertest");
const { faker } = require('@faker-js/faker');
const client = require("../../db/client");
const app = require("../../app");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createFakeUserWithToken,
} = require("../helpers");
const {
  expectToBeError,
  expectNotToBeError,
  expectToHaveErrorMessage,
} = require("../expectHelpers");

const { JWT_SECRET = "neverTell" } = process.env;

const { objectContaining } = expect;
const {  
  generateToken,
  verifyToken
} = require('../../api')
const {
  createUser,
  getUser,
  getAllUsers,
  getUserById,
  getUserByName,
  getUserByEmail,
  updateUser,
  deleteUser,
} = require("../../db");

// Helper function to generate a hashed password
async function generateHashedPassword() {
  return await bcrypt.hash('password123', 10);
}

describe('POST /api/users/register', () => {
  xit('Creates a new user.', async () => {
    const fakeUserData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(fakeUserData);

    // Assert the response and database to ensure user creation
    expect(response.status).toBe(201);

    // You can also check your database or use your getUserByEmail function to verify user creation
    const createdUser = await getUserByEmail(fakeUserData.email);
    expect(createdUser).toBeTruthy();

    // You can also check other properties of the user if needed
    expect(createdUser.name).toBe(fakeUserData.name);
  });

  xit('Throws errors for duplicate user email', async () => {
    // Create a user with the same email first
    const { fakeUser } = await createFakeUserWithToken('john.doe@example.com');

    const duplicateUserData = {
      name: 'Jane Smith',
      email: 'john.doe@example.com', // Same email as the previous user
      password: 'anotherpassword',
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(duplicateUserData);

    // Assert that you receive an error response
    expect(response.status).toBe(409);
  });

  xit('Returns error if password is less than 8 characters.', async () => {
    const shortPasswordData = {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'short', // Password less than 8 characters
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(shortPasswordData);

    // Assert that you receive an error response
    expect(response.status).toBe(400);
  });
});

describe('POST /api/users/login', () => {
  xit('Logs in the user and returns a JSON Web Token.', async () => {
    // Create some fake user data
    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    // Create the user in the DB
    await createUser(userData)

    const response = await request(app)
      .post('/api/users/login')
      .send(userData);

    expectNotToBeError(response.body);

    expect(response.body).toEqual(
      objectContaining({
        message: "you're logged in!",
      })
    );
  });

  xit('Rejects login requests with incorrect password.', async () => {
    // Create a fake user with a known password
    const userPassword = 'securepassword'; // Replace with the actual password
    const { fakeUser } = await createFakeUserWithToken('jane.doe@example.com', userPassword);

    // Attempt to log in with an incorrect password
    const loginData = {
      email: fakeUser.email,
      password: 'wrongpassword',
    };

    const response = await request(app)
      .post('/api/users/login')
      .send(loginData);

    // Assert that you receive an error response
    expect(response.status).toBe(401);
  });
});

describe('GET /api/users/me', () => {
  xit('Sends back user data if a valid token is supplied in the header', async () => {
    // Create a fake user and generate a token for them
    const { fakeUser, token } = await createFakeUserWithToken('jane.doe@example.com');

    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expectNotToBeError(response.body);

    expect(response.body).toEqual({
      user: objectContaining(fakeUser), // Ensure fakeUser properties are present
    });
  });

  xit('Rejects requests with no valid token', async () => {
    const response = await request(app)
      .get('/api/users/me');

    // Assert that you receive an error response
    expect(response.status).toBe(401);
  });
});