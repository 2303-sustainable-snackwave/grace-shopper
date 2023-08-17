const {faker} = require('@faker-js/faker');
const {v4} = require('uuid')
const {createProducts, getAllProducts} = require('./models/products')

const bikeData = () => {
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
       id: v4(), 
       category: category,
       brand: faker.vehicle.manufacturer(),
       name: name, 
       image_url: faker.image.urlLoremFlickr({ category: 'bicycle' }),
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
    for (let i = 0; i < numSamples; i++) {
      const productData = bikeData();
      await createProducts(productData);
    }
  }

fillDB(25);
