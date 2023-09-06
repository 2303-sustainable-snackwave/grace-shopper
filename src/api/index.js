// api/index.js
const BASE_URL = "http://localhost:3001/api/users";
const PRODUCTS_BASE_URL = "http://localhost:3001/api/products"; 
const ORDERS_BASE_URL = "http://localhost:3001/api/orders"; 
const CARTS_BASE_URL = "http://localhost:3001/api/cart"; 
const REVIEWS_BASE_URL = "http://localhost:3001/api/reviews"; 

/* Will need the endpoints for reviews, cart, and checkout!! */

// Register a new user
export const registerUser = async (  
  name,
  email, 
  password, 
  setToken, 
  setMessage,
  setSuccess,
  setName,
  setEmail) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password
      }),
    });
    const result = await response.json();
    if (result.token) {
      setSuccess(true)
      setName(result.user.name)
      setEmail(result.user.email)
    }
    setToken(result.token);
    setMessage(result.message);
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
    setError('Registration failed. Please try again.');
  }
};

// Login a user
export const loginUser = async (email, password, setToken, setMessage, setEmail) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    });
    const result = await response.json();
    console.log(result);
    if (result.token) {
      setEmail(result.user.email)
    }
    setToken(result.token);
    setMessage(result.message);
  } catch (error) {
    console.error(error);
    throw new Error('Login failed. Please try again.'); 
  }
};

// Fetch current user's info
export const fetchCurrentUser = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/me`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
    }
};

// Fetch a user's checkout details
export const fetchUserCheckout = async (userId, token) => {
    try {
        const response = await fetch(`${BASE_URL}/${userId}/checkout`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error fetching user checkout:", error);
        throw error;
    }
};

//Fetch a user's cart
export const fetchUserCart = async (userId, token) => {
    try{
        const response = await fetch(`${BASE_URL}/${userId}/cart`,{
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error fetching user cart:", error);
        throw error;
    }
}

// Add a product to the user's cart
export const addProductToCart = async (userId, productId, token) => {
    try {
        const response = await fetch(`${BASE_URL}/${userId}/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ productId }),
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
        throw error;
    }
};

//Update a product in cart by ID
export const updateProductInCart = async (userId, productId, number ) => {
    try {
        const response = await fetch(`${BASE_URL}/${userId}/cart/${productId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ number }),
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Error updating review:", error);
        throw error;
    }
};

// Delete a product from the user's cart
export const deleteProductFromCart = async (userId, productId, token) => {
    try {
        const response = await fetch(`${BASE_URL}/${userId}/cart/${productId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (response.ok) {
            return await response.json();
        } else {
            const data = await response.json();
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error deleting product from cart:", error);
        throw error;
    }
};

// Fetch all products
export const fetchAllProducts = async () => {
  try {
    const response = await fetch(PRODUCTS_BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

// Add a new product (admin action)
export const addProduct = async (product, token) => {
    try {
        const response = await fetch(PRODUCTS_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(product),
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};

// Update a product (admin action)
export const updateProductById = async (productId, updatedProduct, token) => {
    try {
        const response = await fetch(`${PRODUCTS_BASE_URL}/${productId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(updatedProduct),
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

// Delete a product (admin action)
export const deleteProductById = async (productId, token) => {
    try {
        const response = await fetch(`${PRODUCTS_BASE_URL}/${productId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (response.ok) {
            return await response.json();
        } else {
            const data = await response.json();
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};

// Fetch all orders
export const fetchAllOrders = async () => {
    try {
        const response = await fetch(ORDERS_BASE_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        throw error;
    }
};

// Create a new order
export const createNewOrder = async (order) => {
    try {
        const response = await fetch(ORDERS_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

// Update an order by ID
export const updateOrderById = async (orderId, totalAmount) => {
    try {
        const response = await fetch(`${ORDERS_BASE_URL}/${orderId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ totalAmount }),
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Error updating order:", error);
        throw error;
    }
};

// Delete an order by ID
export const deleteOrderById = async (orderId) => {
    try {
        const response = await fetch(`${ORDERS_BASE_URL}/${orderId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            return await response.json();
        } else {
            const data = await response.json();
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error;
    }
};

// Fetch all reviews by product ID
export const fetchReviewsByProductId = async (productId) => {
    try {
        const response = await fetch(`${PRODUCTS_BASE_URL}/${productId}/reviews`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error fetching reviews by product ID:", error);
        throw error;
    }
};


// Add a review to a product
export const addReviewToProduct = async (productId, reviewData, token) => {
    try {
        const response = await fetch(`${PRODUCTS_BASE_URL}/${productId}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({reviewData}),
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error adding review to product:", error);
        throw error;
    }
};


//Update a reivew by ID
export const updateReviewById = async (productId, reviewId, content) => {
    try {
        const response = await fetch(`${PRODUCTS_BASE_URL}/${productId}/reviews/${reviewId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Error updating review:", error);
        throw error;
    }
};

//Delete a reivew by ID
export const deleteReviewById = async (productId, reviewId) => {
    try {
        const response = await fetch(`${PRODUCTS_BASE_URL}/${productId}/reviews/${reviewId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            return await response.json();
        } else {
            const data = await response.json();
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Error deleting review:", error);
        throw error;
    }
};

// Fetch a product by ID
export const fetchProductById = async (productId) => {
  try {
    const response = await fetch(`${PRODUCTS_BASE_URL}/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to fetch product');
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

// Fetch cart items by cart ID
export const getCartItemsByCartId = async (cartId) => {
  try {
    const response = await fetch(`${CARTS_BASE_URL}/${cartId}/items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to fetch cart items');
    }
  } catch (error) {
    console.error('Error fetching cart items by cart ID:', error);
    throw error;
  }
};

export const postReview = async (productId, userId, rating, reviewText) => {
  try {
    const response = await fetch(REVIEWS_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, userId, rating, reviewText }),
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to post review');
    }
  } catch (error) {
    console.error('Error posting review:', error);
    throw error;
  }
};

export const searchProducts = async (searchQuery) => {
  try {
    // Construct the URL with the search query as a query parameter
    const url = new URL(`${PRODUCTS_BASE_URL}/search`);
    url.searchParams.append('query', searchQuery);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to search for products');
    }
  } catch (error) {
    console.error('Error searching for products:', error);
    throw error;
  }
};