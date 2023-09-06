import React, { useState, useEffect } from 'react';
import {
  addProduct,
  updateProductById,
  deleteProductById,
  updateUser,
  deleteUser,
} from '../api';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    category_id: "",
    brand: "",
    name: "",
    imageUrl: "",
    description: "",
    min_price: "",
    max_price: "",
    currency_code: "",
    amount: "",
    availability: true,
    total_inventory: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = await createProduct(formData);
    setProducts([...products, newProduct]);
    setFormData({
      category_id: "",
      brand: "",
      name: "",
      imageUrl: "",
      description: "",
      min_price: "",
      max_price: "",
      currency_code: "",
      amount: "",
      availability: true,
      total_inventory: "",
    });
  };

  const handleDelete = async (productId) => {
    await deleteProduct(productId);
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    setProducts(updatedProducts);
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({ ...prevState, name: value }));
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const newCategory = await createCategory({ name: formData.name });
    setCategories([...categories, newCategory]);
    setFormData((prevState) => ({ ...prevState, name: "" }));
  };

  const handleCategoryDelete = async (categoryId) => {
    await deleteCategory(categoryId);
    const updatedCategories = categories.filter(
      (category) => category.id !== categoryId
    );
    setCategories(updatedCategories);
  };

  const handleUserPromote = async (userId) => {
    const updatedUser = await promoteUser(userId);
    const updatedUsers = users.map((user) =>
      user.id === userId ? updatedUser : user
    );
    setUsers(updatedUsers);
  };

  const handleUserDelete = async (userId) => {
    await deleteUser(userId);
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const allProducts = await getProducts();
      const allCategories = await getCategories();
      const allUsers = await getUsers();

      setProducts(allProducts);
      setCategories(allCategories);
      setUsers(allUsers);
    };
    fetchInitialData();
  }, []);

  return (
    <div>
      <section>
        <h2>Manage Products</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={productFormData.name}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Add Product</button>
        </form>

        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name}
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Manage Categories</h2>

        <form onSubmit={handleCategorySubmit}>
          <div>
            <label>Category Name:</label>
            <input
              type="text"
              name="name"
              value={categoryFormData.name}
              onChange={handleCategoryChange}
            />
          </div>
          <button type="submit">Add Category</button>
        </form>

        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              {category.name}
              <button onClick={() => handleCategoryDelete(category.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Manage Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.username} - {user.isAdmin ? "Admin" : "User"}
              {!user.isAdmin && (
                <button onClick={() => handleUserPromote(user.id)}>
                  Promote to Admin
                </button>
              )}
              <button onClick={() => handleUserDelete(user.id)}>
                Delete User
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;