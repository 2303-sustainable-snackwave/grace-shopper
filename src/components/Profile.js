import React, { useState, useEffect } from 'react';
import {
  fetchCurrentUser, 
  updateUser,
  fetchUserOrderHistory,
  deleteUser,
  updateBillingAddress,
  updateShippingAddress,
  deleteBillingAddress,
  deleteShippingAddress,
  createBillingAddress,
  createShippingAddress,
  addBillingAddress,
  addShippingAddress,
  fetchUserBillingAddresses,
  fetchUserShippingAddresses,
} from '../api'; 

function Profile({ token }) {
  // Define state variables to store user data and addresses
  const [user, setUser] = useState(null);
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newAddress, setNewAddress] = useState({});
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoadingOrderHistory, setIsLoadingOrderHistory] = useState(true);

  console.log('Token:', token);

  useEffect(() => {
    // Fetch user data and addresses when the component mounts
    const fetchData = async () => {
      try {
        // Fetch the current user's data
        const userData = await fetchCurrentUser(token);
        setUser(userData);

        // Fetch billing and shipping addresses
        const billingData = await fetchUserBillingAddresses(token);
        console.log('Billing Data:', billingData); // Log the response data
        setBillingAddresses(billingData);

        const shippingData = await fetchUserShippingAddresses(token);
        setShippingAddresses(shippingData);

        setName(userData.name);
        setEmail(userData.email);

        setIsLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set loading to false in case of an error
      }
    };

    console.log('Token:', token); // Log the token

    fetchData(); // Call the fetchData function
  }, [token]); // Run this effect whenever the 'token' prop changes

  useEffect(() => {
    // Fetch user's order history when the component mounts
    const fetchOrderHistory = async () => {
      try {
        const orderHistoryData = await fetchUserOrderHistory(user.id, token);
        setOrderHistory(orderHistoryData.orders);
        setIsLoadingOrderHistory(false);
      } catch (error) {
        console.error('Error fetching order history:', error);
        setIsLoadingOrderHistory(false);
      }
    };

    if (user) {
      fetchOrderHistory(); // Call the fetchOrderHistory function if user data is available
    }
  }, [token, user]);

  // Function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API request to update the user's name and email
      const updatedUserData = await updateUser(user.id, { name, email }, token);

      // Update the user state with the new data
      setUser(updatedUserData);

      // Optionally, display a success message to the user
      console.log('User data updated successfully.');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleNewAddressSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new billing or shipping address based on some condition
      let createdAddress;
      if (newAddress.type === 'billing') {
        createdAddress = await createBillingAddress(newAddress, token);
        // Associate the new billing address with the user
        await addBillingAddress(createdAddress.id, token);
      } else if (newAddress.type === 'shipping') {
        createdAddress = await createShippingAddress(newAddress, token);
        // Associate the new shipping address with the user
        await addShippingAddress(createdAddress.id, token);
      }

      // Update the component state with the new address
      if (newAddress.type === 'billing') {
        setBillingAddresses([...billingAddresses, createdAddress]);
      } else if (newAddress.type === 'shipping') {
        setShippingAddresses([...shippingAddresses, createdAddress]);
      }

      // Optionally, clear the new address form
      setNewAddress({});
    } catch (error) {
      console.error('Error creating address:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user && (
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
        </div>
      )}

      <div>
        <h3>Billing Addresses</h3>
        {/* ... Billing addresses list */}
      </div>
  
      <div>
        <h3>Shipping Addresses</h3>
        {/* ... Shipping addresses list */}
      </div>
      <div>
        <h3>Order History</h3>
        {isLoadingOrderHistory ? (
          <p>Loading order history...</p>
        ) : orderHistory.length === 0 ? (
          <p>Check out our wonderful selections of bikes. Order today!</p>
        ) : (
          <ul>
            {orderHistory.map((order) => (
              <li key={order.id}>
                {/* Display order details here */}
              </li>
            ))}
          </ul>
        )}
      </div>
  
      {/* Form to update name and email */}
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Update Name and Email</button>
        </div>
      </form>
  
      {/* Form to create a new address */}
      <form onSubmit={handleNewAddressSubmit}>
        <div>
          <label>
            Type:
            <select
              value={newAddress.type || ''}
              onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="billing">Billing</option>
              <option value="shipping">Shipping</option>
            </select>
          </label>
        </div>
        <div>
        <label htmlFor="street">Street:</label>
        <input
          type="text"
          id="street"
          value={newAddress.street || ''}
          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            value={newAddress.city || ''}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            value={newAddress.state || ''}
            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="postalCode">Postal Code:</label>
          <input
            type="text"
            id="postalCode"
            value={newAddress.postalCode || ''}
            onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            value={newAddress.country || ''}
            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
          />
        </div>
        <div>
          <button type="submit">Create Address</button>
        </div>
      </form>
    </div>
  );
}

export default Profile;