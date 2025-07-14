// HTTP Status Codes
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
}

// Common Response Messages
const MESSAGES = {
  // Success Messages
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESSFUL: 'Login successful',
  BOOK_CREATED: 'Book created successfully',
  BOOK_UPDATED: 'Book updated successfully',
  BOOK_DELETED: 'Book deleted successfully',
  REVIEW_ADDED: 'Review added successfully',
  SERVER_RUNNING: 'Server is running!',

  // Error Messages
  SERVER_ERROR: 'Server error',
  SOMETHING_WENT_WRONG: 'Something went wrong!',
  ROUTE_NOT_FOUND: 'Route not found',
  ACCESS_TOKEN_REQUIRED: 'Access token required',
  INVALID_TOKEN: 'Invalid token',
  USER_NOT_FOUND: 'User not found',
  ADMIN_ACCESS_REQUIRED: 'Admin access required',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_EXISTS: 'User with this email already exists',
  BOOK_NOT_FOUND: 'Book not found',
  BOOK_EXISTS: 'A book with the same title, author, and genre already exists.',
  REVIEW_EXISTS: 'You have already reviewed this book',
  NO_FIELDS_TO_UPDATE: 'No fields to update',

  // Validation Messages
  NAME_MIN_LENGTH: 'Name must be at least 3 characters',
  EMAIL_INVALID: 'Please provide a valid email',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  PASSWORD_REQUIRED: 'Password is required',
  TITLE_LENGTH: 'Title must be 2-200 characters',
  AUTHOR_LENGTH: 'Author must be 2-100 characters',
  GENRE_LENGTH: 'Genre must be 2-50 characters',
  DESCRIPTION_LENGTH: 'Description must be 10-1000 characters',
  RATING_RANGE: 'Rating must be between 1 and 5',
  COMMENT_LENGTH: 'Comment must be between 10 and 1000 characters'
}

// Database Error Codes
const DB_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502'
}

// JWT Configuration
const JWT_CONFIG = {
  EXPIRES_IN: '24h'
}

// Pagination Defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
}

// Sort Configuration
const SORT_CONFIG = {
  ALLOWED_FIELDS: ['title', 'author', 'genre', 'created_at', 'average_rating'],
  ALLOWED_ORDERS: ['ASC', 'DESC'],
  DEFAULT_FIELD: 'created_at',
  DEFAULT_ORDER: 'DESC'
}

// Unique Constraint Names
const USER_EMAIL_CONSTRAINT = 'users_email_key';
const BOOK_UNIQUE_CONSTRAINT = 'unique_book_combo';
const REVIEW_UNIQUE_CONSTRAINT = 'unique_user_book_review';

module.exports = {
  STATUS_CODES,
  MESSAGES,
  DB_ERROR_CODES,
  JWT_CONFIG,
  PAGINATION,
  SORT_CONFIG,
  USER_EMAIL_CONSTRAINT,
  BOOK_UNIQUE_CONSTRAINT,
  REVIEW_UNIQUE_CONSTRAINT
}
