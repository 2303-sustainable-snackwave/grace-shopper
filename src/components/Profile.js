import React, { useState, useEffect } from 'react';
import { 
  fetchCurrentUser, 
  updateUser, 
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

const Profile = ({ token }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [billingAddresses, setBillingAddresses] = useState([]);
    const [shippingAddresses, setShippingAddresses] = useState([]);
    const [newBillingAddress, setNewBillingAddress] = useState({
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    });
    const [newShippingAddress, setNewShippingAddress] = useState({
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    });


  // Fetch user data and addresses on component mount (use useEffect)
  useEffect(() => {
    const fetchData = async () => {
      try {

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
  
        const userData = await fetchCurrentUser(token, setName, setEmail);
        setName(userData.name);
        setEmail(userData.email);
        setLoading(false);

        const billingData = await fetchUserBillingAddresses(token);
        setBillingAddresses(billingData);
        console.log("profile billing list data", billingData);

        const shippingData = await fetchUserShippingAddresses(token);
        setShippingAddresses(shippingData);
      } catch (err) {
        setError('Failed to fetch user data and addresses');
      }
    };

    fetchData();
  }, [token]);

  // Function to update user data
  const handleUpdateUser = async () => {
    try {
      const updatedUserData = { name, email };
      await updateUser(token, updatedUserData);
      alert('User data updated successfully');
    } catch (err) {
      setError('Failed to update user data');
    }
  };

  // Function to add a new billing address
  const handleAddBillingAddress = async () => {
    try {

      // Create the billing address
      const createdBillingAddress = await createBillingAddress(token,
        userId,
        newBillingAddress
      );
  
      // Associate the billing address with the user
      await addBillingAddress(userId, createdBillingAddress.id);
  
      // Add the new billing address to the array
      setBillingAddresses([...billingAddresses, createdBillingAddress]);
  
      // Clear the new billing address form
      setNewBillingAddress({
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
      });
    } catch (error) {
      setError('Error adding billing address. Please try again.');
      console.error(error);
    }
  };
  
  // Function to add a new shipping address
  const handleAddShippingAddress = async () => {
    try {
    
      // Create the shipping address
      const createdShippingAddress = await createShippingAddress(token,
        userId,
        newShippingAddress
      );
  
      // Associate the shipping address with the user
      await addShippingAddress(userId, createdShippingAddress.id);
  
      // Add the new billing address to the array
      setShippingAddresses([...shippingAddresses, createdShippingAddress]);
  
      // Clear the new shipping address form
      setNewShippingAddress({
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
      });
    } catch (error) {
      setError('Error adding shipping address. Please try again.');
      console.error(error);
    }
  };

  // Function to delete user account
//   const handleDeleteUser = async () => {
//     try {
//       if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
//         await deleteUser(token, passwordForDeletion);
//         alert('User account deleted successfully');
//         // You can redirect to the login page or perform any other action after deletion.
//       }
//     } catch (err) {
//       setError('Failed to delete user account');
//     }
//   };

  return (
    <div>
      <h2>User Profile</h2>
      <div>
        <h3>Name</h3>
        <p>{name}</p>
      </div>
      <div>
        <h3>Email</h3>
        <p>{email}</p>
      </div>
      <div>
      <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button onClick={handleUpdateUser}>Update User</button>
  
      <div>
        <h3>Add New Billing Address</h3>
        <input
            type="text"
            placeholder="Street"
            value={newBillingAddress.street}
            onChange={(e) =>
            setNewBillingAddress({ ...newBillingAddress, street: e.target.value })
            }
        />
        <input
            type="text"
            placeholder="City"
            value={newBillingAddress.city}
            onChange={(e) =>
            setNewBillingAddress({ ...newBillingAddress, city: e.target.value })
            }
        />
        <input
            type="text"
            placeholder="State"
            value={newBillingAddress.state}
            onChange={(e) =>
            setNewBillingAddress({ ...newBillingAddress, state: e.target.value })
            }
        />
        <input
            type="text"
            placeholder="Postal Code"
            value={newBillingAddress.postal_code}
            onChange={(e) =>
            setNewBillingAddress({ ...newBillingAddress, postal_code: e.target.value })
            }
        />
        <input
            type="text"
            placeholder="Country"
            value={newBillingAddress.country}
            onChange={(e) =>
            setNewBillingAddress({ ...newBillingAddress, country: e.target.value })
            }
        />
        <button onClick={handleAddBillingAddress}>Add Billing Address</button>
        </div>
      <div>
        <h3>Billing Addresses</h3>
        <ul>
          {billingAddresses.map((address) => (
            <li key={address.id}>
              {address.street}, {address.city}, {address.state}, {address.postal_code}, {address.country}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Add New Shipping Address</h3>
        <input
            type="text"
            placeholder="Street"
            value={newShippingAddress.street}
            onChange={(e) =>
            setNewShippingAddress({ ...newShippingAddress, street: e.target.value })
            }
        />
        <input
            type="text"
            placeholder="City"
            value={newShippingAddress.city}
            onChange={(e) =>
            setNewShippingAddress({ ...newShippingAddress, city: e.target.value })
            }
        />
        <input
            type="text"
            placeholder="State"
            value={newShippingAddress.state}
            onChange={(e) =>
            setNewShippingAddress({ ...newShippingAddress, state: e.target.value })
            }
        />
        <input
            type="text"
            placeholder="Postal Code"
            value={newShippingAddress.postal_code}
            onChange={(e) =>
            setNewShippingAddress({
                ...newShippingAddress,
                postal_code: e.target.value
            })
            }
        />
        <input
            type="text"
            placeholder="Country"
            value={newShippingAddress.country}
            onChange={(e) =>
            setNewShippingAddress({ ...newShippingAddress, country: e.target.value })
            }
        />
        <button onClick={handleAddShippingAddress}>Add Shipping Address</button>
        </div>
        <div>
        <h3>Shipping Addresses</h3>
        <ul>
            {shippingAddresses.map((address) => (
            <li key={address.id}>
                {address.street}, {address.city}, {address.state}, {address.postal_code}, {address.country}
            </li>
            ))}
        </ul>
        </div>
      
      <div>
        {/* <h3>Delete Account</h3>
        <label>Password for Verification:</label> */}
        {/* <input
          type="password"
          value={passwordForDeletion}
          onChange={(e) => setPasswordForDeletion(e.target.value)}
        /> */}
        {/* <button onClick={handleDeleteUser}>Delete Account</button> */}
      </div>
    </div>
  );
};
export default Profile