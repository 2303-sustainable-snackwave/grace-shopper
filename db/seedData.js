const {faker} = require('@faker-js/faker');
const {v4} = require('uuid');
const {createProducts, getAllProducts} = require('./models/products')
const {createUser, getAllUsers} = require('./models/users')

const client = require('./client');

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
        //id: v4(),
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


async function dropTables() {
  try {
    console.log("Starting to drop table...");

    // Add your SQL query to drop the products table here
    await client.query(`
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS products;
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
  `);

  console.log("Finished creating table!");
} catch (error) {
  console.error("Error creating table!");
  throw error;
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
  try {
      console.log("Starting to create users...");

      await createUser({ name: 'albert', email: 'abc.com', password: 'bertie99', role: 'customer'});
      await createUser({ name: 'sandra', email: 'def.com', password: '2sandy4me', role: 'administrator' });
      await createUser({ name: 'glamgal', email: 'ghi.com', password: 'soglam', role: 'customer' });

      console.log("Finished creating users!");
  }   catch(error) {
      console.error("Error creating users!");
      throw error;
  }
}

async function rebuildDB() {
  try {
      client.connect();

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

    console.log("Calling getAllProducts");
    const products = await getAllProducts();
    console.log("Result:", products);

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}


rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());