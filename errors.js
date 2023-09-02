class NotFoundError extends Error {
  constructor(message = 'Not Found', status = 404) {
    super(message);
    this.name = 'NotFoundError';
    this.status = status;
  }
}

class AuthenticationError extends Error {
  constructor(message = 'Unauthorized', status = 401) {
    super(message);
    this.name = 'AuthenticationError';
    this.status = status;
  }
}

class ValidationError extends Error {
  constructor(message = 'Unprocessable Entity', details = {}, status = 422) {
    super(message);
    this.name = 'ValidationError';
    this.status = status;
    this.details = details;
  }
}

class CartError extends Error {
  constructor(message = 'Cart Error', status = 404) {
    super(message);
    this.name = 'CartError';
    this.status = status;
  }
}

class OrderHistoryError extends Error {
  constructor(message = 'Order History Error', status = 404) {
    super(message);
    this.name = 'OrderHistoryError';
    this.status = status;
  }
}  

class PermissionError extends Error {
  constructor(message = 'Permission check failed', status = 403) {
    super(message);
    this.name = 'CartPermissionError';
    this.status = status;
  }
}

class TokenVerificationError extends Error {
  constructor(message = 'Invalid token', status = 400) {
    super(message);
    this.name = 'TokenVerificationError';
    this.status = status;
  }
}

class RegistrationError extends Error {
  constructor(message = 'Registration failed', status = 400) {
    super(message);
    this.name = 'TokenVerificationError';
    this.status = status;
  }
}

class AdminPermissionError extends Error {
  constructor(message = 'Admin Permission Error', status = 403) {
    super(message);
    this.name = 'AdminPermissionError';
    this.status = status;
  }
}

module.exports = {
  NotFoundError,
  AuthenticationError,
  ValidationError,
  CartError,
  UserError,
  ProductError,
  CartValidationFailedError,
  ProductValidationFailedError,
  PermissionError,
  TokenVerificationError,
  RegistrationError,
  AdminPermissionError,
  OrderHistoryError,
  ReviewValidationFailedError,
  ReviewError
};
