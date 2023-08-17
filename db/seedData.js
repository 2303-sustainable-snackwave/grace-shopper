import {faker} from '@faker-js/faker';
import {v4} from 'uuid';
import slugify from 'slugify';

export const bikeData = () => {
    const category = faker.vehicle.bicycle();
    const name = name + " " + faker.vehicle.model();
    const handle = slugify(name).toLocaleLowerCase();
    const minPrice = faker.datatype.number({
        min: 500,
        max: 20000,
    });
    const maxPrice = faker.datatype.number({
        min: minPrice,
        max: minPrice * 3
    });

    return{
       id: v4(), 
       category: category,
       brand: faker.vehicle.manufacturer(),
       name: name, 
       image_url: faker.image.bicycle(),
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
       amount: faker.datatype.number({
        min: 500,
        max: 60000,
       }),
       availability: faker.datatype.boolean(),
       total_inventory: faker.datatype.number({ min: 1, max: 5 }),
    }
}