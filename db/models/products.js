const client = require("./client");

// Updates

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
}, requestingUserRole) {
}, requestingUserRole) {
  try {
    if (requestingUserRole !== "admin") {
      throw new Error("Only admin users can create products.");
    }
    if (requestingUserRole !== "admin") {
      throw new Error("Only admin users can create products.");
    }
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
        total_inventory, )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
            `,
      [category,
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
    throw new Error('Could not create product: ' + error.message);
    throw new Error('Could not create product: ' + error.message);
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
    throw new Error('Could not locate product: ' + error.message);
    throw new Error('Could not locate product: ' + error.message);
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
    throw new Error('Could not locate products: ' + error.message);
    throw new Error('Could not locate products: ' + error.message);
  }
}

async function getAllProducts() {
  try {
    const { rows: products } = await client.query(`
      SELECT *
      FROM products;
    `);

    return products;
  } catch (error) {
    throw new Error('Could not locate products: ' + error.message);
  }
}

// async function getAllProductsByOrders({ orders }) {
//   // Needs to built out after orders
//   try {
//   } catch (error) {}
// }

// async function getProductsByOrdered({ id }) {
//   // fleshout after db/orders.js
//   try {
//   } catch (error) {}
// }

async function updateProduct({ id, ...fields }, requestingUserRole) {
  try {
    if (requestingUserRole !== "admin") {
      throw new Error("Only admin users can update products.");
    }
    const updateFields = Object.keys(fields)
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(", ");

    const values = Object.values(updatedFields);

    const { rows } = await client.query(
      `
      UPDATE products
      SET ${updateFields}
      WHERE id=$${values.length + 1}
      RETURNING *;
      `,
      [...values, id]
    );
    const updatedProduct = rows[0];

    return updatedProduct;
  } catch (error) {
    throw new Error('Could not update product: ' + error.message);
    throw new Error('Could not update product: ' + error.message);
  }
}

async function destroyProduct(id, requestingUserRole) {
  try {
    if (requestingUserRole !== "admin") {
      throw new Error("Only admin users can delete products.");
    }
    const deletedProduct = await getProductById(id);
async function destroyProduct(id, requestingUserRole) {
  try {
    if (requestingUserRole !== "admin") {
      throw new Error("Only admin users can delete products.");
    }
    const deletedProduct = await getProductById(id);

      if (!deletedProduct) {
      if (!deletedProduct) {
            return null;
      }
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
      if (rowCount === 0) {
        return null;
      }

    return deletedProduct;
  } catch (error) {
    throw new Error('Could not delete product: ' + error.message);
  }
    return deletedProduct;
  } catch (error) {
    throw new Error('Could not delete product: ' + error.message);
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
