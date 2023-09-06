const {faker} = require('@faker-js/faker');
const {createProducts, getAllProducts} = require('./models/products');
const {createUser, getAllUsers, getUserById} = require('./models/users');
const {createBillingAddress} = require('./models/billingAddress');
const {createShippingAddress} = require('./models/shippingAddress');
const {createReview, } = require('./models/reviews');
const {createOrderInDatabase} = require('./models/checkout');
const {getOrderByUserId} = require('./models/orders');
const {createCart, getCartByUserId, addItemToCart, getCartById, getCartItemsByCartId} = require('./models/cart');

const client = require('./client');

async function dropTables() {
  try {
    console.log("Starting to drop table...");

    await client.query(`
      DROP TABLE IF EXISTS user_billing_addresses CASCADE; 
      DROP TABLE IF EXISTS billing_addresses CASCADE;
      DROP TABLE IF EXISTS user_shipping_addresses CASCADE; 
      DROP TABLE IF EXISTS shipping_addresses CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS product_reviews CASCADE;
      DROP TABLE IF EXISTS order_history CASCADE;
      DROP TABLE IF EXISTS carts CASCADE;
      DROP TABLE IF EXISTS cart_items CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    console.log("Finished dropping table!");
  } catch (error) {
    console.error("Error dropping table!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to create table...");

    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_admin BOOLEAN NOT NULL
    );
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      category TEXT,
      brand TEXT,
      name TEXT,
      imageUrl TEXT,
      description TEXT,
      min_price DECIMAL(10, 2) NOT NULL,
      max_price DECIMAL(10, 2) NOT NULL,
      currency_code TEXT,
      amount DECIMAL(10, 2) NOT NULL,
      availability BOOLEAN,
      total_inventory INT
    );   
    CREATE TABLE billing_addresses (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      street VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      state VARCHAR(255) NOT NULL,
      postal_code VARCHAR(20) NOT NULL,
      country VARCHAR(255) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE user_billing_addresses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      billing_address_id INTEGER REFERENCES billing_addresses(id)
    );  
    CREATE TABLE shipping_addresses (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      street VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      state VARCHAR(255) NOT NULL,
      postal_code VARCHAR(20) NOT NULL,
      country VARCHAR(255) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE user_shipping_addresses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      shipping_address_id INTEGER REFERENCES shipping_addresses(id)
    ); 
    CREATE TABLE product_reviews (
      id SERIAL PRIMARY KEY,
      product_id INT NOT NULL,
      user_id INT NOT NULL,
      rating INT NOT NULL,
      review_text TEXT,
      review_date TIMESTAMP NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE order_history (
      id SERIAL PRIMARY KEY,
      session_id UUID NOT NULL,
      user_id INT NOT NULL,
      order_date TIMESTAMP NOT NULL,
      total_amount DECIMAL(10, 2) NOT NULL,
      billing_address_id INT NOT NULL,
      shipping_address_id INT NOT NULL,
      order_products JSONB[] NOT NULL DEFAULT '{}',
      status TEXT NOT NULL, -- New column for order status
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (shipping_address_id) REFERENCES shipping_addresses(id),
      FOREIGN KEY (billing_address_id) REFERENCES billing_addresses(id)
    );
    CREATE TABLE carts (
      id SERIAL PRIMARY KEY,
      user_id INT,
      guest_id UUID,
      FOREIGN KEY (user_id) REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE cart_items (
      id SERIAL PRIMARY KEY,
      user_id INT,
      cart_id INT,
      product_id INT,
      quantity INT,
      FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
    console.log("Finished creating table!");
  } catch (error) {
    console.error("Error creating table!");
    throw error;
  }
}

const categoryNames = [
  'Road Bicycle',
  'Fitness Bicycle',
  'City Bicycle',
  'Track/Fixed-Gear Bicycle',
  'Dual-Sport Bicycle',
  'Touring Bicycle',
  'Mountain Bicycle',
  'Hybrid Bicycle',
  'Cruiser Bicycle',
  'BMX Bicycle',
];

const bikeData = () => {
  console.log("Generating bike data...");

  const categoryName = faker.helpers.arrayElement(categoryNames);

  let name = "";
  name = name + "" + faker.vehicle.model();

  const minPrice = faker.number.float({
    min: 500,
    max: 20000,
    precision: 0.01,
  });

  const maxPrice = faker.number.float({
    min: minPrice,
    max: minPrice * 3,
    precision: 0.01,
  });

  if (!minPrice || isNaN(minPrice)) {
    // Ensure minPrice is a valid number
    throw new Error("Invalid minPrice");
  }

  return {
    category: categoryName, // Use categoryName for the category name
    brand: faker.vehicle.manufacturer(),
    name: name,
    imageUrl: faker.image.urlLoremFlickr({ category: 'bicycle' }),
    description: faker.lorem.paragraph(),
    min_price: minPrice,
    max_price: maxPrice,
    currency_code: "USD",
    amount: faker.number.float({
      min: minPrice,
      max: maxPrice,
      precision: 0.01,
    }),
    availability: faker.datatype.boolean(),
    total_inventory: faker.number.int({ min: 1, max: 5 }),
  };
};

async function fillDB(numSamples) {
  try {
    console.log("Starting to fill database...");

    for (let i = 0; i < numSamples; i++) {
      const productData = bikeData();
      await createProducts(productData, "admin");
    }

    console.log("Finished filling database!");
  } catch (error) {
    console.error("Error filling database:", error);
    throw error;
  }
}

async function createInitialUsers() {
  console.log("Starting to create users...")
  try {
    const usersToCreate = [
      {
        name: 'albert',
        email: 'albert@example.com',
        password: 'bertie99',
        billing_addresses: [
          { street: '123 street', city: 'New York', state: 'NY', postalCode: '00345', country: 'US'}
        ],
        shipping_addresses: [
          { street: 'Triple street', city: 'Los Angles', state: 'CA', postalCode: '70094', country: 'US'}
        ]
      },
      { name: 'sandra', email: 'sandra@example.com', password: '2sandy4me', 
        billing_addresses: [
        { street: 'Bark street', city: 'Boston', state: 'MA', postalCode: '03823', country: 'US'}
        ] ,
        shipping_addresses: [
          { street: 'Crazy street', city: 'Miami', state: 'FL', postalCode: '04975', country: 'US'}
        ]
      },
      { name: 'glamgal', email: 'glamgal@example.com', password: 'soglam', 
      billing_addresses: [
        { street: 'Hulk street', city: 'Atlanta', state: 'GA', postalCode: '38746', country: 'US'}
      ],
      shipping_addresses: [
        { street: 'Ambition street', city: 'San Diego', state: 'CA', postalCode: '64883', country: 'US'}
      ]
     },
    ];
   
    const users = await Promise.all(usersToCreate.map(async (userData) => {
      const user = await createUser(userData);

      if (userData.billing_addresses && userData.billing_addresses.length > 0) {
        await Promise.all(userData.billing_addresses.map(async (billingAddress) => {
          await createBillingAddress({
            userId: user.id,
            street: billingAddress.street,
            city: billingAddress.city,
            state: billingAddress.state,
            postalCode: billingAddress.postalCode,
            country: billingAddress.country
          });
        }));
      }

      if (userData.shipping_addresses && userData.shipping_addresses.length > 0) {
        await Promise.all(userData.shipping_addresses.map(async (shippingAddress) => {
          await createShippingAddress({
            userId: user.id,
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country
          });
        }));
      }

      return user;
    }));

    console.log("Users created:");
    console.log(users);
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!")
    throw error;
  }
}

async function fillCarts(numCarts){
  try{
    console.log("Starting to fill carts... ");

    const cartsToCreate = [];
    for(let i = 0; i < numCarts; i++){
      const userID = i+1;
      const guestID = faker.string.uuid();

      cartsToCreate.push({
        userId: userID,
        guestId: guestID
      })
    }

    const createdCarts = await Promise.all(cartsToCreate.map(createCart));

    console.log("Carts created: ");
    console.log(createdCarts);
    console.log("Finished filling carts!");
  } catch (error) {
    console.error("Error filling carts!");
    throw error;
  }
}

async function fillCartProducts(numProducts){
  try{
    console.log("Starting to fill cart products... ");

    const products = await getAllProducts();
    const users = await getAllUsers();

    const cartProductsToCreate = [];
    for(let i = 0; i < numProducts; i++){
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomCart = await getCartByUserId(randomUser.id);
      const quantity = faker.number.int({max:randomProduct.total_inventory})

      cartProductsToCreate.push({
        userId: randomUser.id,
        cartId: randomCart.id,
        productId: randomProduct.id,
        quantity: quantity
      });
      

      const createdCartProducts = await Promise.all(cartProductsToCreate.map(addItemToCart));

      console.log("Cart product added:");
      console.log(createdCartProducts);
      console.log("Finished adding product to cart!");
    }
  } catch (error) {
    console.error("Error adding product to cart!");
    throw error;
  }
}

async function fillProductReviews(numReviews) {
  try {
    console.log("Starting to fill product reviews...");

    const products = await getAllProducts();
    const users = await getAllUsers();

    const reviewsToCreate = [];
    for (let i = 0; i < numReviews; i++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const rating = Math.floor(Math.random() * 5) + 1; 
      const reviewText = faker.lorem.paragraph();
      const reviewDate = faker.date.past();

      reviewsToCreate.push({
        productId: randomProduct.id,
        userId: randomUser.id,
        rating: rating,
        reviewText: reviewText,
        reviewDate: reviewDate,
      });
    }

    const createdReviews = await Promise.all(reviewsToCreate.map(createReview));

    console.log("Product reviews created:");
    console.log(createdReviews);
    console.log("Finished filling product reviews!");
  } catch (error) {
    console.error("Error filling product reviews!");
    throw error;
  }
}

async function fillOrderHistory(numOrders) {
  try {
    console.log("Starting to fill order history...");

    const users = await getAllUsers();
    const products = await getAllProducts();


    for (let i = 0; i < numOrders; i++) {
      const randomUser = await getUserById(Math.ceil(Math.random() * users.length));
      const randomProducts = [];
      for(let j = 0; j < Math.floor(Math.random() * products.length); j++){
        randomProducts.push(products[Math.floor(Math.random() * products.length)])
      }
      const orderProducts = randomProducts;
      let tempTotalAmount = 0; 
      for(let k = 0; k < orderProducts.length; k++){
        const productAmount = parseFloat(orderProducts[k].amount); 
        tempTotalAmount += productAmount;
      }
      const totalAmount = tempTotalAmount;
      const sessionID = faker.string.uuid(); 
      const orderDate = faker.date.past();
      const billingAddressID = randomUser.billing_addresses[0].id; 
      const shippingAddressID = randomUser.shipping_addresses[0].id; 
      

      const order = await createOrderInDatabase({
        sessionID,
        userID: randomUser.id,
        orderDate,
        totalAmount, 
        billingAddressID,
        shippingAddressID,
        orderProducts
      });

      console.log(`Order ${i + 1} created:`, order);
    }

    console.log("Finished filling order history!");
  } catch (error) {
    console.error("Error filling order history!");
    throw error;
  }
}

async function rebuildDB() {
  try {
      await dropTables();
      await createTables();
      await fillDB(75);
      await createInitialUsers();
      await fillProductReviews(65);
      await fillOrderHistory(100);
      await fillCarts(3);
      await fillCartProducts(5);
  }   catch(error) {
      console.log("Error during rebuildDB")
      throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    // console.log("Calling getAllProducts");
    // const products = await getAllProducts();
    // console.log("Result:", products);

    // console.log("Calling getAllUsers");
    // const users = await getAllUsers();
    // console.log("Result:", users);

    // console.log("Calling getUserById with 1");
    // const albert = await getUserById(1);
    // console.log("Result:", albert);

    // console.log("Calling getAllReviews");
    // const reviews = await getAllReviews();
    // console.log("Result", reviews);

    // console.log("Calling getReviewsByProduct with 1");
    // const productReview = await getReviewsByProduct(1);
    // console.log("Result:", productReview);

    // console.log("Calling getOrderByUserId with 1");
    // const order = await getOrderByUserId(1);
    // console.log("Result:", order);

    console.log("Calling getCartById with 1");
    const cart = await getCartById(1);
    console.log("Result:",cart);

    console.log("Calling getCartItemsByCartId with 1");
    const cartItems = await getCartItemsByCartId(1);
    console.log("Result:",cartItems);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}



module.exports = {
  rebuildDB,
  testDB,
  dropTables,
  createTables,
}
