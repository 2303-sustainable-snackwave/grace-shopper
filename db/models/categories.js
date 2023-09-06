const client = require("../client");

async function createProductCategory(name) {
  try {
    const {
      rows: [category],
    } = await client.query(
      `
      INSERT INTO categories (name)
      VALUES ($1)
      RETURNING *;
      `,
      [name]
    );
    return category;
  } catch (error) {
    throw new Error('Could not create product category: ' + error.message);
  }
}

async function getAllCategories() {
  try {
    const { rows: categories } = await client.query('SELECT * FROM categories;');
    return categories;
  } catch (error) {
    throw new Error('Could not get categories: ' + error.message);
  }
}

async function updateCategory(categoryId, newName) {
  try {
    const {
      rows: [updatedCategory],
    } = await client.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *;',
      [newName, categoryId]
    );
    return updatedCategory;
  } catch (error) {
    throw new Error('Could not update category: ' + error.message);
  }
}

async function deleteCategory(categoryId) {
  try {
    const {
      rows: [deletedCategory],
    } = await client.query('DELETE FROM categories WHERE id = $1 RETURNING *;', [
      categoryId,
    ]);
    return deletedCategory;
  } catch (error) {
    throw new Error('Could not delete category: ' + error.message);
  }
}

module.exports = {
  createProductCategory,
  getAllCategories,
  deleteCategory,
  updateCategory
};