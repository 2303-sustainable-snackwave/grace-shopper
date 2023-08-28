const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
    createUser,
    getUser,
    getUserById,
    getUserByName,
    getUserByEmail
} = require('../db/models/users')
/* 
    Waiting on db/checkout 

    const {
    getAllCheckoutByUser
    getPublicCheckoutByUser
    } = require('../db/models/checkout')
} */

// POST /api/users/register

router.post('/register', async (req, res, next) => {
    const { name, email, password, role }= req.body;
    try {
        const userExists = await getUserByName(name);
        if (userExists) {
            return res.status(409).json({
                error: 'Username already exists.',
                message: `User ${name} is already taken.`,
                name: 'UserExistsError'
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long',
                message: 'Password Too Short!',
                name: 'UserPasswordError'
            });
        }
        const newUser = await createUser({ name, email, password, role })
      const token = jwt.sign(
        {
          id: newUser.id,
          name: newUser.name,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
      res.json({
        message: "Thank you for signing up",
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      next({
          name: "UserRegistrationError",
          message: "There was an error registering user",
      });
   }
   
});

// POST /api/users/login

router.post('/login', async (req, res, next) => {
    const { name, password } = req.body;
    try {
        // Are we using the email for login purposes? Because I can change the the async await here!
        const user = await getUserByUsername(name);
        if (!user) {
            return next ({
                error: "User not found",
                message: "User with the provided username does not exist",
                name: "UserNotFoundError",
            });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return next ({
                error: "Invalid credentials",
                message: "Invalid username or password",
                name: "InvalidCredentialsError",
            });
        }
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "1w",
              }
        );
        res.json({
            message: "you're logged in!",
            token,
            user: {
              id: user.id,
              name: user.name,
            },
          });

    } catch ({ name, message }) {
        next({
            name: 'LoginError',
            message: 'There was an error during login'
          });
    }
});

// GET /api/users/me

router.get("/me", async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          error: "No token provided",
          message: "You must be logged in to perform this action",
          name: "UnauthorizedError",
        });
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (!decodedToken || !decodedToken.id) {
        return res.status(401).json({
          error: "Invalid token",
          message: "You must be logged in to perform this action",
          name: "UnauthorizedError",
        });
      }
      const userId = decodedToken.id;
      const user = await getUserById(userId);
      if (!user) {
        return res.status(401).json({
          error: "User not found",
          message: "You must be logged in to perform this action",
          name: "UnauthorizedError",
        });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
});

// GET /api/users/:username/checkout

router.get("/:username/checkout", async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "You must be logged in to perform this action" });
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (!decodedToken || !decodedToken.id) {
        return res.status(401).json({ error: "Invalid token" });
      }
      const name = req.params.name;
      const user = await getUserByUsername(name);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (decodedToken.name === name) {
        const allRoutines = await getAllCheckoutByUser({ name });
        return res.json(allRoutines);
      } else {
        const publicRoutines = await getPublicCheckoutByUser({ name });
        return res.json(publicRoutines);
      }
    } catch (error) {
      next(error);
    }
});

module.exports = router;