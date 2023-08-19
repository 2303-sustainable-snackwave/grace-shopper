const { faker } = require('@faker-js/faker');
const { createUser, createProducts } = require("../db/models");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET
// This contains helper functions which create fake entries in the database
// for the tests.

const createFakeUser = async (overrides = {}) => {
  const fakeUserData = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: "user",
    addresses: {
      billingAddressList: [],
      shippingAddressList: []
    }
  };
  const user = await createUser({ ...fakeUserData, ...overrides });
  if (!user) {
    throw new Error("createUser didn't return a user");
  }
  return { ...user, ...overrides };
};

const createFakeUserWithToken = async (email) => {
    const fakeUser = await createFakeUser(email);
  
    const token = jwt.sign(
      { id: fakeUser.id, email: fakeUser.email },
      JWT_SECRET,
      { expiresIn: "1w" }
    );
  
    return {
      fakeUser,
      token,
    };
};

const createFakeBikeProduct = async (overrides = {}) => {
  const fakeBikeData = {
    category: 'Bikes',
    brand: faker.company.companyName(),
    name: `Bike - ${faker.commerce.productName()}`,
    imageUrl: faker.image.imageUrl(),
    description: `A ${faker.lorem.word()} bike for outdoor adventures.`,
    min_price: faker.random.number({ min: 200, max: 500 }),
    max_price: faker.random.number({ min: 501, max: 1000 }),
    currency_code: 'USD',
    amount: faker.random.number({ min: 10, max: 30 }),
    availability: true,
    total_inventory: faker.random.number({ min: 5, max: 20 }),
  };
  const bikeProduct = await createProducts({ ...fakeBikeData, ...overrides }, adminUser.role);
  if (!bikeProduct) {
    throw new Error("createProducts didn't return a bike product");
  }
  return { ...bikeProduct, ...overrides };
};


module.exports = {
    createFakeUser,
    createFakeUserWithToken,
    createFakeBikeProduct
    createFakeUserWithToken,
    createFakeBikeProduct
}