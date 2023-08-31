const { faker } = require('@faker-js/faker');
const { 
  createUser, 
  createProducts,
  createBillingAddress,
  createShippingAddress,
  createReview
} = require("../db/models");
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
    billingAddressList: [],
    shippingAddressList: []
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
    min_price: minPrice,
    max_price: maxPrice,
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

const createFakeBillingAddress = async (userId, overrides = {}) => {
  const fakeBillingAddressData = {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country()
  };
  const billingAddress = await createBillingAddress(
    userId,
    fakeBillingAddressData.street,
    fakeBillingAddressData.city,
    fakeBillingAddressData.state,
    fakeBillingAddressData.postalCode,
    fakeBillingAddressData.country
  );
  if (!billingAddress) {
    throw new Error("createBillingAddress didn't return a billing address");
  }
  return { ...billingAddress, ...overrides };
};

const createFakeShippingAddress = async (userId, overrides = {}) => {
  const fakeShippingAddressData = {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country()
  };
  
  const shippingAddress = await createShippingAddress(
    userId,
    fakeShippingAddressData.street,
    fakeShippingAddressData.city,
    fakeShippingAddressData.state,
    fakeShippingAddressData.postalCode,
    fakeShippingAddressData.country
  );
  if (!shippingAddress) {
    throw new Error("createShippingAddress didn't return a shipping address");
  }
  return { ...shippingAddress, ...overrides };
};

const createFakeReviews = async (productId, userId, numberOfReviews = 5) => {
  const reviews = [];

  for (let i = 0; i < numberOfReviews; i++) {
    const fakeReviewData = {
        productId,
        userId,
        rating: faker.number.int({ min: 1, max: 5 }),
        reviewText: faker.lorem.paragraph(),
        reviewDate: faker.date.past(),
    };

    const review = await createReview(fakeReviewData);
    if (!review) {
        throw new Error("createReview didn't return a review");
    }

    reviews.push(review);
  }

  return reviews;
};

module.exports = {
    createFakeUser,
    createFakeUserWithToken,
    createFakeBikeProduct,
    createFakeShippingAddress,
    createFakeBillingAddress,
    createFakeReviews
}