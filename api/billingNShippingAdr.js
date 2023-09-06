const express = require('express');
const router = express.Router();
const { verifyToken, checkCartPermission } = require('./authMiddleware');
const {
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
} = require("../db/models");




// Define the route handler for creating a new billing address
router.post('/', async (req, res) => {
  try {
    // Extract data from the request body
    const { userId, street, city, state, postalCode, country } = req.body;

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


module.exports = router;
