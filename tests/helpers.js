const { faker } = require('@faker-js/faker');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');
const { 
  createUser, 
  createProducts,
  createBillingAddress,
  createShippingAddress,
  createCart,
  addItemToCart,
  createReview,
  createOrderInDatabase
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
    is_admin: false,
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
  const minPrice = 500;
  const maxPrice = 1000;

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

const createFakeCart = async (userId, guestId, productId, overrides = {}) => {
  const fakeCartData = {
    user_id: userId || null,
    guest_id: guestId !== null ? uuidv4() : null,
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    product_id: productId || null,
    ...overrides,
  };

  const cartId = await createCart(
    fakeCartData.user_id,
    fakeCartData.guest_id,
    fakeCartData.created_at,
    fakeCartData.updated_at,
    fakeCartData.product_id
  );

  if (!cartId) {
    throw new Error("createCart didn't return a cart with an ID");
  }

  let cartItemId = null;
  if (fakeCartData.product_id !== null) {
    cartItemId = await addItemToCart(
      fakeCartData.user_id,
      cartId,
      fakeCartData.product_id,
      1
    );

    if (!cartItemId) {
      throw new Error("addItemToCart didn't return a cart item with an ID");
    }
  }

  return { cart_id: cartId, cart_item_id: cartItemId, ...fakeCartData };
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

const createFakeOrderWithProduct = async (productId, overrides = {}) => {
  // Generate fake order data
  const fakeOrderData = {
    session_id: "1515155",
    user_id: faker.number.int(),
    order_date: new Date(),
    total_amount: faker.finance.amount(),
    billing_address_id: faker.number.int(),
    shipping_address_id: faker.number.int(),
    order_products: [{ product_id: productId, quantity: 1 }],
    ...overrides,
  };

  // Insert the fake order into the order_history table
  const insertedOrder = await createOrderInDatabase(fakeOrderData);
  console.log("fake order data", insertedOrder);

  if (!insertedOrder) {
    throw new Error("createOrderInDatabase didn't return an order");
  }

  return insertedOrder;
};


module.exports = {
  createFakeUser,
  createFakeUserWithToken,
  createFakeBikeProduct,
  createFakeShippingAddress,
  createFakeBillingAddress,
  createFakeCart,
  createFakeReviews,
  createFakeOrderWithProduct
}