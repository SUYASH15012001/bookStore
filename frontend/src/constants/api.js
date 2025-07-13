// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// HTTP Status Codes
export const STATUS_CODES = {
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
};

// Common Messages
export const MESSAGES = {
  // Success Messages
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  LOGOUT_SUCCESS: 'Logged out successfully',
  BOOK_CREATED: 'Book created successfully!',
  BOOK_UPDATED: 'Book updated successfully!',
  BOOK_DELETED: 'Book deleted successfully!',
  REVIEW_ADDED: 'Review added successfully!',
  
  // Error Messages
  LOGIN_FAILED: 'Login failed. Please try again.',
  REGISTER_FAILED: 'Registration failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  
  // Form Validation Messages
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Email is invalid',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  NAME_REQUIRED: 'Name is required',
  NAME_MIN_LENGTH: 'Name must be at least 3 characters',
  TITLE_REQUIRED: 'Title is required',
  AUTHOR_REQUIRED: 'Author is required',
  GENRE_REQUIRED: 'Genre is required',
  DESCRIPTION_REQUIRED: 'Description is required',
  RATING_REQUIRED: 'Rating is required',
  COMMENT_REQUIRED: 'Comment is required',
  COMMENT_MIN_LENGTH: 'Comment must be at least 10 characters',
  COMMENT_MAX_LENGTH: 'Comment must be at most 1000 characters'
};

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 3,
  TITLE_MIN_LENGTH: 2,
  TITLE_MAX_LENGTH: 200,
  AUTHOR_MIN_LENGTH: 2,
  AUTHOR_MAX_LENGTH: 100,
  GENRE_MIN_LENGTH: 2,
  GENRE_MAX_LENGTH: 50,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 1000,
  COMMENT_MIN_LENGTH: 10,
  COMMENT_MAX_LENGTH: 1000,
  RATING_MIN: 1,
  RATING_MAX: 5
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100
};

// Sort Configuration
export const SORT_CONFIG = {
  ALLOWED_FIELDS: ['title', 'author', 'genre', 'created_at', 'average_rating'],
  ALLOWED_ORDERS: ['ASC', 'DESC'],
  DEFAULT_FIELD: 'created_at',
  DEFAULT_ORDER: 'DESC'
};

// Genres
export const GENRES = [
  'Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 
  'Fantasy', 'Romance', 'Thriller', 'Biography', 
  'History', 'Self-Help'
];

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  BOOK_DETAILS: '/book/:id',
  ADMIN_PANEL: '/admin'
}; 