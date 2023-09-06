const client = require("../client");

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
    rows: [product],
  } = await client.query(
    ` 
    INSERT INTO products(
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
    total_inventory )
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
  return product;
} catch (error) {
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

async function updateProduct({productId, updatedFields}) {
  try {
    const {  
      brand, 
      name, 
      imageUrl, 
      description , 
      min_price, 
      max_price, 
      currency_code, 
      amount, 
      availability,
      total_inventory     
    } = updatedFields;

    const existingProduct = await getProductById(productId);
    if (!existingProduct) {
      throw new Error(`Product with ID ${productId} not found.`);
    }

    const updateFields = Object.keys(updatedFields)
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
      [...values, productId]
    );
    const updatedProduct = rows[0];

    return updatedProduct;
  } catch (error) {
    throw new Error('Could not update product: ' + error.message);
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
      DELETE FROM order_history
      WHERE $1 = ANY(order_products)
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
    throw new Error('Could not delete product: ' + error.message);
  }
}

async function searchProducts(query) {
  try {
      const { rows: products } = await client.query(`
          SELECT p.*
          FROM products p
          WHERE p.category IKIKE $1
          or p.name ILIKE $1
          OR p.description ILIKE $1
          OR p.brand ILIKE $1;
      `, [`%${query}%`]);

      return products;
  } catch (error) {
      throw new Error('Could not search products: ' + error.message);
  }
}

module.exports = {
  createProducts,
  getProductById,
  getProductsWithoutOrders,
  getAllProducts,
  updateProduct,
  destroyProduct,
  searchProducts
};