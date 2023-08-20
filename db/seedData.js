const {faker} = require('@faker-js/faker');
const {createProducts, getAllProducts} = require('./models/products');
const {createUser, getAllUsers, getUserById} = require('./models/users');
const {createBillingAddress} = require('./models/billingAddress');
const {createShippingAddress, addShippingAddressToUser} = require('./models/shippingAddress');

const client = require('./client');

async function dropTables() {
  try {
    console.log("Starting to drop table...");

    // Add your SQL query to drop the products table here
    await client.query(`
      DROP TABLE IF EXISTS user_billing_addresses CASCADE; 
      DROP TABLE IF EXISTS billing_addresses CASCADE;
      DROP TABLE IF EXISTS user_shipping_addresses CASCADE; 
      DROP TABLE IF EXISTS shipping_addresses CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
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

    // Add your SQL query to create the products table here
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL
      );

      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        category TEXT,
        brand TEXT,
        name TEXT,
        imageUrl TEXT,
        description TEXT,
        min_price JSONB,
        max_price JSONB,
        currency_code TEXT,
        amount INT,
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
        billing_address_id INTEGER REFERENCES billing_addresses(id)
      ); 
  `);
    console.log("Finished creating table!");
  } catch (error) {
    console.error("Error creating table!");
    throw error;
  }
}

const bikeData = () => {
    console.log("Generating bike data...");
    const category = faker.vehicle.bicycle();
    let name = "";
    name = name + " " + faker.vehicle.model();
    const minPrice = faker.number.int({
        min: 500,
        max: 20000,
    });
    const maxPrice = faker.number.int({
        min: minPrice,
        max: minPrice * 3
    });

    return{
       category: category,
       brand: faker.vehicle.manufacturer(),
       name: name, 
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
       currency_code: "USD",
       amount: faker.number.int({
        min: 500,
        max: 60000,
       }),
       availability: faker.datatype.boolean(),
       total_inventory: faker.number.int({ min: 1, max: 5 }),
    }
}


async function fillDB(numSamples) {
  try {
    console.log("Starting to fill database...");

    for (let i = 0; i < numSamples; i++) {
      const productData = bikeData();
      await createProducts(productData);
    }

    console.log("Finished filling database!");
  } catch (error) {
    console.error("Error filling database!");
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
        role: 'customer',
        billing_addresses: [
          { street: '123 street', city: 'New York', state: 'NY', postalCode: '00345', country: 'US'}
        ],
        shipping_addresses: [
          { street: 'Triple street', city: 'Los Angles', state: 'CA', postalCode: '70094', country: 'US'}
        ]
      },
      { name: 'sandra', email: 'sandra@example.com', password: '2sandy4me', role: 'administrator',
        billing_addresses: [
        { street: 'Bark street', city: 'Boston', state: 'MA', postalCode: '03823', country: 'US'}
        ] ,
        shipping_addresses: [
          { street: 'Crazy street', city: 'Miami', state: 'FL', postalCode: '04975', country: 'US'}
        ]
      },
      { name: 'glamgal', email: 'glamgal@example.com', password: 'soglam', role: 'customer',
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
          await createBillingAddress(
            user.id,
            billingAddress.street,
            billingAddress.city,
            billingAddress.state,
            billingAddress.postalCode,
            billingAddress.country
          );
        }));
      }

      if (userData.shipping_addresses && userData.shipping_addresses.length > 0) {
        await Promise.all(userData.shipping_addresses.map(async (shippingAddress) => {
          await createShippingAddress(
            user.id,
            shippingAddress.street,
            shippingAddress.city,
            shippingAddress.state,
            shippingAddress.postalCode,
            shippingAddress.country
          );
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

async function rebuildDB() {
  try {
      await dropTables();
      await createTables();
      await fillDB(10);
      await createInitialUsers();
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

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

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
