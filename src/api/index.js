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
export const loginUser = async (email, password) => {
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
      return result.token; // Return the token upon successful login.
    } else {
      throw new Error(result.message || 'Login failed. Please try again.');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Login failed. Please try again.'); 
  }
};

// Fetch current user's info
export const fetchCurrentUser = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    // Check if the response status is okay (200)
    if (!response.ok) {
      // Handle the error here (e.g., throw an error or return an error message)
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as JSON
    const currentUser = await response.json();

    // Return the current user's data
    return currentUser;
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    console.error("Error fetching current user:", error);

    // Optionally, you can throw the error to be handled elsewhere
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

// Helper function to create a cart for a user (both guest and logged-in)
export const createCart = async (userId, guestId, token) => {
  try {
    console.log("Creating cart...");
    const response = await fetch(`${CARTS_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, guestId }),
    });

    console.log("Response from createCart:", response);

    const data = await response.json();

    if (response.ok) {
      console.log("Cart created successfully:", data);
      return data;
    } else {
      console.error("Error creating cart:", data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error creating cart:", error.message);
    throw new Error(`Error creating cart: ${error.message}`);
  }
};

// Fetch a user's cart (for both logged-in and guest users)
export const fetchUserCart = async (userId, guestId, token) => {
    try {
        let apiUrl = `${CARTS_BASE_URL}/`; // Note the trailing slash added here
        
        // If a userId is provided, it means the user is logged in
        if (userId) {
            apiUrl += `user/${userId}`; // Append the user's ID to the URL for logged-in users
        } else if (guestId) {
            apiUrl += `guest/${guestId}`; // Append the guest's ID to the URL for guest users
        }
        
        const response = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log('API URL:', apiUrl); // Log the constructed URL
        console.log('Response from fetchUserCart:', response);

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error in fetchUserCart:', error);
        throw error;
    }
};

// Add a product to the user's cart (for both logged-in and guest users)
export const addProductToCart = async (userId, guestId, productId, token) => {
    try {
        let apiUrl = `${CARTS_BASE_URL}/items`; // Base URL for adding items to the cart
        
        // Determine whether the user is logged in or a guest
        if (userId) {
            apiUrl += `/${userId}/user`; // Append the user's ID to the URL for logged-in users
        } else if (guestId) {
            apiUrl += `/${guestId}/guest`; // Append the guest's ID to the URL for guest users
        }
        
        const response = await fetch(apiUrl, {
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

// Update the quantity of a product in the user's cart (for both logged-in and guest users)
export const updateProductInCart = async (userId, guestId, productId, number, token) => {
    try {
        let apiUrl = `${CARTS_BASE_URL}/items/${productId}`; // Base URL for updating cart items
        
        // Determine whether the user is logged in or a guest
        if (userId) {
            apiUrl += `/${userId}/user`; // Append the user's ID to the URL for logged-in users
        } else if (guestId) {
            apiUrl += `/${guestId}/guest`; // Append the guest's ID to the URL for guest users
        }
        
        const response = await fetch(apiUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
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
        console.error("Error updating product in cart:", error);
        throw error;
    }
};

// Delete a product from the user's cart (for both logged-in and guest users)
export const deleteProductFromCart = async (userId, guestId, productId, token) => {
    try {
        let apiUrl = `${CARTS_BASE_URL}/items/${productId}`; // Base URL for deleting cart items
        
        // Determine whether the user is logged in or a guest
        if (userId) {
            apiUrl += `/${userId}/user`; // Append the user's ID to the URL for logged-in users
        } else if (guestId) {
            apiUrl += `/${guestId}/guest`; // Append the guest's ID to the URL for guest users
        }
        
        const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        
        if (response.ok) {
            return { message: "Product deleted from cart successfully." };
        } else {
            const data = await response.json();
            throw new Error(data.error);
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

    const products = await response.json();

    return products;
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

export const updateUser = async (userId, updatedUserData, token) => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updatedUserData),
    });
     if (response.ok) {
        return data.updatedUser;
      } else {
        throw new Error(data.error);
      }    const data = await response.json();
 
  } catch (error) {
      console.error("Error updating user:", error);
      throw error;
  }
};

export const deleteUser = async (userId, token) => {
    try {
        const response = await fetch(`/api/users/delete-account/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data.message; 
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

// Update a billing address by addressId
export const updateBillingAddress = async (userId, addressId, updatedAddressData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/me/billing-addresses/${addressId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, updatedAddressData }),
    });

    const data = await response.json();

    if (response.ok) {
      return data; 
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(`Error updating billing address: ${error.message}`);
  }
};

// Update a user's shipping address in the database
export const updateShippingAddress = async (userId, addressId, updatedAddressData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/me/shipping-addresses/${addressId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, updatedAddressData }),
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(`Error updating shipping address: ${error.message}`);
  }
};

// Delete a billing address by addressId
export const deleteBillingAddress = async (addressId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/me/billing-addresses/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data; 
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(`Error deleting billing address: ${error.message}`);
  }
};

// Delete a user's shipping address in the database
export const deleteShippingAddress = async (addressId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/me/shipping-addresses/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(`Error deleting shipping address: ${error.message}`);
  }
};

// Create a new billing address for the current user
export const createBillingAddress = async ({userId, billingAddressData, token}) => {
  try {
    const response = await fetch(`${BASE_URL}/me/billing-addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, billingAddressData }),    });

    const data = await response.json();

    if (response.ok) {
      return data; 
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(`Error creating billing address: ${error.message}`);
  }
};

// Create a new shipping address for the user in the database
export const createShippingAddress = async ({userId, shippingAddressData, token}) => {
    console.log("token received???", token);

    try {
    const response = await fetch(`${BASE_URL}/me/shipping-addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, shippingAddressData }),
    });

    const data = await response.json();

    if (response.ok) {
      return data; 
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(`Error creating shipping address: ${error.message}`);
  }
};

// Add a new billing address to the user's profile
export const addBillingAddress = async (userId, billingAddressData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/me/billing-addresses/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, billingAddressData }),
    });

    const data = await response.json();

    if (response.ok) {
      return data; 
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(`Error adding billing address: ${error.message}`);
  }
};

// Add a new shipping address for the user in the database
export const addShippingAddress = async (userId, shippingAddressData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/me/shipping-addresses/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, shippingAddressData }),
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(`Error adding shipping address: ${error.message}`);
  }
};

// Fetch user's billing addresses from the database
export const fetchUserBillingAddresses = async (token) => {
  console.log("Token received:", token);
  try {
    const response = await fetch(`${BASE_URL}/me/billing-addresses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log("Token response:", response);

    const data = await response.json();
    console.log("Token response:", response);

    if (response.ok) {
      return data; 
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(`Error fetching user's billing addresses: ${error.message}`);
  }
};

// Fetch user's shipping addresses from the database
export const fetchUserShippingAddresses = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/me/shipping-addresses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data; 
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(`Error fetching user's shipping addresses: ${error.message}`);
  }
};

export const fetchUserOrderHistory = async (userId, token) => {
  console.log("Token received:", token);
  try {
    const response = await fetch(`${BASE_URL}/api/orders/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log("Token response:", response);

    const data = await response.json();
    console.log("Token response:", response);

    if (response.ok) {
      return data; 
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(`Error fetching user's order history: ${error.message}`);
  }
};




