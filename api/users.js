const express = require("express");
const router = express.Router();
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
} = require('../db/models/users')

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

    const user = await getUserById(req.user.id);

    if (!user) {
      throw new AuthenticationError('User not found.');
    }

    res.json({ user });
  } catch (error) {
    // console.error('Error in /api/users/me:', error);

    if (error instanceof AuthenticationError) {
      // Handle authentication-related errors (e.g., token validation)
      return res.status(401).json({ error: error.message });
    }

    // Handle other errors (e.g., database errors)
    next(new UserError('There was an error finding user.'));
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
    const { userId } = req.params;

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

module.exports = router;
