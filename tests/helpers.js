const { faker } = require('@faker-js/faker');
const { createUser, createProducts } = require("../db/models");
const jwt = require("jsonwebtoken");
const { JWT_SECRET = "neverTell" } = process.env;
// This contains helper functions which create fake entries in the database
// for the tests.

const createFakeUser = async (overrides = {}) => {
  const fakeUserData = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: "user",
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
  const minPrice = 500; // Define your minimum price
  const maxPrice = 1000; // Define your maximum price

  const fakeBikeData = {
    category: faker.vehicle.bicycle(),
    brand: faker.company.name(),
    name: `Bike - ${faker.commerce.productName()}`,
    imageUrl: faker.image.urlLoremFlickr({ category: 'bicycle' }),
    description: faker.lorem.paragraph(),
    min_price: {
      amount: minPrice,
      currency_code: "USD",
    },
    max_price: {
      amount: maxPrice,
      currency_code: "USD",
    },
    currency_code: 'USD',
    amount: faker.finance.amount({
      min: 500,
      max: 60000,
      dec: 0 
    }),
    availability: faker.datatype.boolean(),
    total_inventory: faker.number.int({ min: 0, max: 20 }),
  };

  const bikeProduct = await createProducts({ ...fakeBikeData, ...overrides }, "admin");
  if (!bikeProduct) {
    throw new Error("createProducts didn't return a bike product");
  }
  return { ...bikeProduct, ...overrides };
};

module.exports = {
    createFakeUser,
    createFakeUserWithToken,
    createFakeBikeProduct
}