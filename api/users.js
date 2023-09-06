const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { verifyToken, generateToken, isAuthorizedToUpdate, isAdminOrOwner} = require('./authMiddleware');
const { 
  UserError,
  RegistrationError,
  AuthenticationError,
  PermissionError
} = require('../errors');
const {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  createBillingAddress,
  getBillingAddressByUserId,
  addBillingAddressToUser,
  updateUserBillingAddress,
  deleteBillingAddress,
  createShippingAddress,
  getShippingAddressByUserId,
  addShippingAddressToUser,
  deleteShippingAddress,
  updateUserShippingAddress
} = require('../db/models')

router.post('/register', async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
      const userExists = await getUserByEmail(email);
      if (userExists) {
        return res.status(409).json({
          error: 'Email already exists.',
          message: `${email} is already in use.`,
          name: 'EmailExistsError'
        });
      }
      if (password.length < 8) {
        return res.status(400).json({
          error: 'Password must be at least 8 characters long',
          message: 'Password Too Short!',
          name: 'UserPasswordError'
        });
      }

    const newUser = await createUser({ name, email, password });
    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    res.status(201).json({
      message: "Thank you for signing up",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    next(new RegistrationError('Registration failed.'));
  }
});

// POST /api/users/login

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    console.log('User Object:', user);
    if (!user) {
      return res.status(401).json({
          error: 'Email not found.',
          message: 'User with the provided email does not exist',
          name: 'EmailNotFoundError'
      });
    }
    console.log('Provided Password:', password);
    console.log('Stored Hashed Password:', user.password);
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password Match:', passwordMatch);
         if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Invalid email or password',
        name: 'InvalidCredentialsError',
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    res.status(200).json({
      message: "you're logged in!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    next(new AuthenticationError('Authentication failed.'));
  }
});

// GET /api/users/me
router.get("/me", async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    console.log("Received Token:", token);

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({
        error: "No token provided",
        message: "You must be logged in to perform this action",
        name: "UnauthorizedError",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decodedToken);

    if (!decodedToken || !decodedToken.id) {
      console.log("Invalid token");
      return res.status(401).json({
        error: "Invalid token",
        message: "You must be logged in to perform this action",
        name: "UnauthorizedError",
      });
    }

    const userId = decodedToken.id;

    console.log("Fetching user data for user ID:", userId);

    const user = await getUserById(userId);

    if (!user) {
      console.log("User not found");
      return res.status(401).json({
        error: "User not found",
        message: "You must be logged in to perform this action",
        name: "UnauthorizedError",
      });
    }

    console.log("User data retrieved successfully:", user);

    res.json(user);
  } catch (error) {
    console.error("Error in /api/users/me:", error);
    next(error);
  }
});

// PATCH /api/users/:userId (Update user profile)
router.patch('/:userId', verifyToken, isAuthorizedToUpdate, isAdminOrOwner, async (req, res, next) => {
  try {
    const { userId: targetUserId } = req.params;
    const { is_admin: isAdminUpdate, ...updatedUserData } = req.body;

    if (!isAdmin && isAdminUpdate !== undefined) {
      throw new PermissionError('You do not have permission to see or change the is_admin status.');
    }

    if (isAdminUpdate !== undefined && req.user.userId === targetUserId) {
      throw new PermissionError('You do not have permission to change your own is_admin status.');
    }

    const updatedUser = await updateUser({ userId: targetUserId, updatedFields: updatedUserData });

    delete updatedUser.password;

    res.json({ updatedUser });
  } catch (error) {
    next(new UserError('There was an error updating user.'));
  }
});

router.delete('/delete-account/:userId', verifyToken, isAuthorizedToUpdate, async (req, res, next) => {
  try {
    const { userId } = req.user;

    const deletedUser = await deleteUser(userId);

    if (deletedUser) {
      res.json({ message: 'User account deleted successfully' });
    } else {
      throw new AuthenticationError('User not found.');
    }
  } catch (error) {
    next(new UserError('There was an deleting user.'));
  }
});

// Define the route handler for creating a new billing address
router.post('/me/billing-addresses', verifyToken, isAuthorizedToUpdate, async (req, res) => {
  try {
    const { userId } = req.user;
    const { street, city, state, postalCode, country } = req.body;

    // Call the controller function to create the billing address
    const newBillingAddress = await createBillingAddress({
      userId,
      street,
      city,
      state,
      postalCode,
      country
    });

    // Return a success response with the created billing address
    res.status(201).json(newBillingAddress);
  } catch (error) {
    // Handle errors and return an error response
    console.error('Error creating billing address:', error);
    res.status(500).json({ error: 'Could not create billing address' });
  }
});

// Define the route handler for creating a new shipping address for a user
router.post('/me/shipping-addresses', verifyToken, isAuthorizedToUpdate, async (req, res) => {
  try {
    // Extract the user ID from the request (assuming it's stored in req.user or req.userId)
    const { userId } = req.user;
    // Extract the shipping address data from the request body
    const { street, city, state, postalCode, country } = req.body;

    // Call the controller function to create the new shipping address
    const newShippingAddress = await createShippingAddress({
      userId,
      street,
      city,
      state,
      postalCode,
      country
    });

    // Return a success response with the created shipping address
    res.status(201).json(newShippingAddress);
  } catch (error) {
    // Handle errors and return an error response
    console.error('Error creating shipping address:', error);
    res.status(500).json({ error: 'Could not create shipping address' });
  }
});

// Define the route handler for getting billing addresses by user ID
router.get('/me/billing-addresses', verifyToken, isAuthorizedToUpdate, async (req, res) => {
  console.log('Token Data:', verifyToken);

  try {
    // Extract the user ID from the request (assuming it's stored in req.user or req.userId)
    const { userId } = req.user.id;
    
    // Log the token data
    console.log('Token Data:', req.user);

    // Call the controller function to retrieve billing addresses by user ID
    const billingAddresses = await getBillingAddressByUserId(userId);

    // Add a console log to see the retrieved billing addresses
    console.log('Billing Addresses:', billingAddresses);

    // Return a JSON response with the billing addresses
    res.json(billingAddresses);
  } catch (error) {
    // Handle errors and return an error response
    console.error('Error fetching billing addresses:', error);
    res.status(500).json({ error: 'Could not fetch billing addresses' });
  }
});

// Define the route handler for getting shipping addresses by user ID
router.get('/me/shipping-addresses', verifyToken, isAuthorizedToUpdate,  async (req, res) => {
  try {
    // Extract the user ID from the request (assuming it's stored in req.user or req.userId)
    const { userId } = req.user;
    // Call the controller function to retrieve shipping addresses by user ID
    const shippingAddresses = await getShippingAddressByUserId(userId);

    // Return a JSON response with the shipping addresses
    res.json(shippingAddresses);
  } catch (error) {
    // Handle errors and return an error response
    console.error('Error fetching shipping addresses:', error);
    res.status(500).json({ error: 'Could not fetch shipping addresses' });
  }
}); 

// Define the route handler for adding billing addresses to a user
router.post('/me/billing-addresses/add', verifyToken, isAuthorizedToUpdate, async (req, res) => {
  try {
    // Extract the user ID from the request (assuming it's stored in req.user or req.userId)
    const { userId } = req.user;
    // Extract the list of billing addresses from the request body
    const { billingAddressList } = req.body;

    // Call the controller function to add billing addresses to the user
    const addedBillingAddresses = await addBillingAddressToUser(userId, billingAddressList);

    // Return a JSON response with the added billing addresses
    res.status(201).json(addedBillingAddresses);
  } catch (error) {
    // Handle errors and return an error response
    console.error('Error adding billing addresses:', error);
    res.status(500).json({ error: 'Could not add billing addresses' });
  }
});

// Define the route handler for adding shipping addresses to a user
router.post('/me/shipping-addresses/add', verifyToken, isAuthorizedToUpdate, async (req, res) => {
  try {
    // Extract the user ID from the request (assuming it's stored in req.user or req.userId)
    const { userId } = req.user;
    // Extract the list of shipping addresses from the request body
    const { shippingAddressList } = req.body;

    // Call the controller function to add shipping addresses to the user
    const addedShippingAddresses = await addShippingAddressToUser(userId, shippingAddressList);

    // Return a JSON response with the added shipping addresses
    res.status(201).json(addedShippingAddresses);
  } catch (error) {
    // Handle errors and return an error response
    console.error('Error adding shipping addresses:', error);
    res.status(500).json({ error: 'Could not add shipping addresses' });
  }
});

// Define the route handler for updating a user's billing address
router.patch('/me/billing-addresses/:addressId', verifyToken, isAuthorizedToUpdate, async (req, res) => {
  try {
    // Extract data from the request body (you can customize the fields you want to update)
    const { street, city, state, postalCode, country } = req.body;
    // Extract addressId from the route parameters
    const { addressId } = req.params;

    // Call the controller function to update the billing address with PATCH
    const updatedBillingAddress = await updateUserBillingAddress({
      addressId,
      street,
      city,
      state,
      postalCode,
      country
    });

    // Return a success response with the updated billing address
    res.json(updatedBillingAddress);
  } catch (error) {
    // Handle errors and return an error response
    console.error('Error updating billing address:', error);
    res.status(500).json({ error: 'Could not update billing address' });
  }
});

// Define the route handler for updating a user's shipping address
router.patch('/me/shipping-addresses/:addressId', verifyToken, isAuthorizedToUpdate, async (req, res) => {
  try {
    // Extract addressId from the route parameters
    const { addressId } = req.params;
    // Extract the updated shipping address data from the request body
    const updatedShippingAddressData = req.body;

    // Call the controller function to update the shipping address
    const updatedShippingAddress = await updateUserShippingAddress(userId, addressId, updatedShippingAddressData);

    // Return a JSON response with the updated shipping address
    res.json(updatedShippingAddress);
  } catch (error) {
    // Handle errors and return an error response
    console.error('Error updating shipping address:', error);
    res.status(500).json({ error: 'Could not update shipping address' });
  }
});

// Define the route handler for deleting a user's billing address
router.delete('/me/billing-addresses/:addressId', verifyToken, isAuthorizedToUpdate, async (req, res) => {
  try {
    // Extract addressId from the route parameters
    const { addressId } = req.params;

    // Call the controller function to delete the billing address
    const isDeleted = await deleteBillingAddress(addressId);

    if (isDeleted) {
      // Return a success response if the billing address is deleted
      res.json({ message: 'Billing address deleted successfully' });
    } else {
      // Return an error response if the billing address is not found
      res.status(404).json({ error: 'Billing address not found' });
    }
  } catch (error) {
    // Handle errors and return an error response
    console.error('Error deleting billing address:', error);
    res.status(500).json({ error: 'Could not delete billing address' });
  }
});

// Define the route handler for deleting a user's shipping address
router.delete('/me/shipping-addresses/:addressId', verifyToken, isAuthorizedToUpdate, async (req, res) => {
  try {
    // Extract addressId from the route parameters
    const { addressId } = req.params;

    // Call the controller function to delete the shipping address
    const isDeleted = await deleteShippingAddress(addressId);

    if (isDeleted) {
      // Return a success response if the shipping address is deleted
      res.json({ message: 'Shipping address deleted successfully' });
    } else {
      // Return an error response if the shipping address is not found
      res.status(404).json({ error: 'Shipping address not found' });
    }
  } catch (error) {
    // Handle errors and return an error response
    console.error('Error deleting shipping address:', error);
    res.status(500).json({ error: 'Could not delete shipping address' });
  }
});

module.exports = router;
