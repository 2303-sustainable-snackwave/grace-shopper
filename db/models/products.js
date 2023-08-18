const client = require("../client");

// Updated

async function createProducts({
    category,
    brand,
    name,
    imageUrl,
    description,
    min_price,
    max_price,
    currency_code,
    amount,
    availability,
    total_inventory,
}) {
  try {
    const {
      rows: [products],
    } = await client.query(
      ` INSERT INTO products(category,
        brand,
        name,
        imageUrl,
        description,
        min_price,
        max_price,
        currency_code,
        amount,
        availability,
        total_inventory)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
            `,
      [ category,
        brand,
        name,
        imageUrl,
        description,
        min_price,
        max_price,
        currency_code,
        amount,
        availability,
        total_inventory]
    );
    return products;
  } catch (error) {
    throw error;
  }
}

async function getProductById(id) {
  try {
    const { rows } = await client.query(
      `
            SELECT *
            FROM products
            WHERE id = $1;
            `,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM users
    `)
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getProductsWithoutOrders() {
  try {
    const { rows } = await client.query(`
            SELECT *
            FROM products
            LEFT JOIN product_orders ON product.id = product_orders."product.id"
            WHERE product_orders.id IS NULL;
        `);
    if (rows.length === 0) {
      return null;
    }

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllProducts() {
  // temporary until .db/orders.js is finished
  try {
    const { rows } = await client.query(`
            SELECT *
            FROM products;
        `);
        return rows;
  } catch (error) {throw error;}
}

async function getAllProductsByOrders({ orders }) {
  // Needs to built out after orders
  try {
  } catch (error) {}
}

async function getProductsByOrdered({ id }) {
  // fleshout after db/orders.js
  try {
  } catch (error) {}
}

async function updateProduct({ id, ...fields }) {
  try {
    const updateFields = Object.keys(fields)
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(", ");

    const values = Object.values(fields);

    const { rows } = await client.query(
      `
                UPDATE products
                SET ${updateFields}
                WHERE id=$${values.length + 1}
                RETURNING *;
                `,
      [...values, id]
    );
    const updateProduct = rows[0];

    return updateProduct;
  } catch (error) {
    throw error;
  }
}

async function destroyProduct(id) {
    try {
        const deletedProduct = await getProductById(id);

        if (!deletedProduct) {
            return null;
        }

        await client.query(
            `
            DELETE FROM product_orders
            WHERE "productId" = $1
            `,
            [id]
        );

        const { rowCount } = await client.query(
            `
            DELETE FROM products
            WHERE id = $1
            `,
            [id]
        );

        if (rowCount === 0) {
            return null;
        }

        return deletedProduct;
    } catch (error) {
        throw error;
    }
}

module.exports = {
  createProducts,
  getProductById,
  getProductsWithoutOrders,
  getAllProducts,
  updateProduct,
  destroyProduct
};
