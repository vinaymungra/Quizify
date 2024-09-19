// Standard HTTP status codes used in error handling
const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

// Base class for all application errors
class AppError extends Error {
  constructor(name, statusCode, description, isOperational = true) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype); // Maintain proper prototype chain
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error for API-level issues
class APIError extends AppError {
  constructor(
    description = "Internal Server Error",
    statusCode = STATUS_CODES.INTERNAL_ERROR
  ) {
    super("API Error", statusCode, description);
  }
}

// Error class for handling bad requests (400)
class BadRequestError extends AppError {
  constructor(description = "Bad Request") {
    super("Bad Request", STATUS_CODES.BAD_REQUEST, description);
  }
}

// Error class for validation-related errors (400)
class ValidationError extends AppError {
  constructor(description = "Validation Error") {
    super("Validation Error", STATUS_CODES.BAD_REQUEST, description);
  }
}

// Utility function for creating and logging errors
const logAndThrowError = (errorInstance) => {
  // Log the error stack if available for easier debugging
  if (errorInstance.isOperational) {
    console.error(`[${errorInstance.name}] ${errorInstance.message}`);
  }
  throw errorInstance;
};

module.exports = {
  AppError,
  APIError,
  BadRequestError,
  ValidationError,
  STATUS_CODES,
  logAndThrowError, // Optional utility for centralized error throwing
};
