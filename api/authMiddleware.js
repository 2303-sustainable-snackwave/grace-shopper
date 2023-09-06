const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const { 
  PermissionError,
  TokenVerificationError,
  AdminPermissionError,
  AuthenticationError,
} = require('../errors');

function generateToken(userId, email) {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '1w' });
}

function generateGuestId() {
  // Generate a UUID (Version 4)
  return uuidv4();
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  console.log("Received Token:", token);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
      req.user = decoded;
    } catch (error) {
      console.error("Token Verification Error:", error);
      next(new TokenVerificationError('Invalid token'));
    }
  } else {
    console.log("No Token Provided");
    // ... (rest of your code)
  }

  next();
}

const checkCartPermission = async (req, res, next) => {
  const { userId, guestId } = req.user;
  const { cartId } = req.params;

  try {
    const cart = await getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    if (cart.user_id === userId || cart.guest_id === guestId) {
      // If the user has ownership or guest access, they have permission
      next();
    } else {
      // If neither ownership nor guest access, the user doesn't have permission
      res.status(403).json({ message: 'You do not have permission to modify this cart.' });
    }
  } catch (error) {
    // Handle errors or throw custom permission-related errors
    next(new PermissionError('Permission check failed.'));
  }
};

function isAuthorizedToUpdate(req, res, next) {
  try {
    // Ensure that the user is logged in
    if (!req.user) {
      throw new AuthenticationError('Authentication required.');
    }

    // Check if the user is trying to update their own data
    if (req.params.userId !== req.user.userId && !isAdmin) {
      throw new PermissionError('You are not authorized to make this update.');
    }

    // If the user is authorized, allow access
    next();
  } catch (error) {
    next(error);
  }
}

function isAdminOrOwner(req, res, next) {
  if (req.user && (req.user.is_admin || req.user.userId === req.params.userId)) {
    next();
  } else {
    next(new PermissionError('You do not have permission to access this feature.'));
  }
}

function isAdmin(req, res, next) {
  console.log('isAdmin middleware - User:', req.user);
  if (req?.user?.is_admin) {
    next();
  } else {
    next(new AdminPermissionError('You do not have permission to access this feature.'));
  }
}

module.exports = { 
  verifyToken,
  checkCartPermission,
  generateToken,
  isAdminOrOwner,
  isAdmin,
  isAuthorizedToUpdate
};
