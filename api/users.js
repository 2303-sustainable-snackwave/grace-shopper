const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const { verifyToken, generateToken, isAuthorizedToUpdateProfile, isAdminOrOwner} = require('./authMiddleware');
const { 
  RegistrationError,
  AuthenticationError
} = require('../errors');
const {
  createUser,
  getAllUsers,
  getUserById,
  getUserByName,
  getUserByEmail,
  updateUser,
  deleteUser,
} = require('../db/models/users')
/* 
    Waiting on db/checkout 

    const {
    getAllCheckoutByUser
    getPublicCheckoutByUser
    } = require('../db/models/checkout')
} */

// POST /api/users/register

router.post('/register', async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
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
      
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({ name, email, password: hashedPassword });
    const token = generateToken(newUser.id, newUser.email);
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
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
          error: 'Email not found.',
          message: 'User with the provided email does not exist',
          name: 'EmailNotFoundError'
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
     if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Invalid email or password',
        name: 'InvalidCredentialsError',
      });
    }
    const token = generateToken(user.id, user.email);
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
router.get("/me", verifyToken, async (req, res, next) => {
  try {

    if (!req.user) {
      throw new AuthenticationError('You must be logged in to perform this action.');
    }

    const user = await getUserById(req.user.userId);

    if (!user) {
      throw new AuthenticationError('User not found.');
    }

    delete user.password;

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/:userId (Update user profile)
router.patch('/:userId', verifyToken, isAuthorizedToUpdateProfile, isAdminOrOwner, async (req, res, next) => {
  try {
    const { userId: targetUserId } = req.params;
    const { is_admin: isAdminUpdate, ...updatedUserData } = req.body;

    // Check if a regular user is trying to see or change is_admin status
    if (!isAdmin && isAdminUpdate !== undefined) {
      return res.status(403).json({ message: 'You do not have permission to see or change the is_admin status.' });
    }

    // If an admin user is trying to change their own is_admin status, deny the action
    if (isAdminUpdate !== undefined && req.user.userId === targetUserId) {
      return res.status(403).json({ message: 'You do not have permission to change your own is_admin status.' });
    }

    // Update only the fields provided in the request body
    const updatedUser = await updateUser({ userId: targetUserId, updatedFields: updatedUserData });

    // Remove sensitive information
    delete updatedUser.password;

    res.json({ updatedUser });
  } catch (error) {
    next(error);
  }
});

router.delete('/delete-account/:userId', verifyToken, isAuthorizedToUpdateProfile, async (req, res, next) => {
  try {
    const { userId } = req.params;

    const deletedUser = await deleteUser(userId);

    // Check if the user was successfully deleted
    if (deletedUser) {
      res.json({ message: 'User account deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error); // Handle any errors
  }
});

module.exports = router;