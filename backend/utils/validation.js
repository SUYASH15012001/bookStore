const { body } = require('express-validator');
const { MESSAGES } = require('../constants/statusCodes');

// User validation rules
const userValidation = {
  register: [
    body('name')
      .isLength({ min: 3 })
      .withMessage(MESSAGES.NAME_MIN_LENGTH)
      .trim()
      .escape(),
    body('email')
      .isEmail()
      .withMessage(MESSAGES.EMAIL_INVALID)
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage(MESSAGES.PASSWORD_MIN_LENGTH)
  ],
  
  login: [
    body('email')
      .isEmail()
      .withMessage(MESSAGES.EMAIL_INVALID)
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage(MESSAGES.PASSWORD_REQUIRED)
  ]
};

// Book validation rules
const bookValidation = {
  create: [
    body('title')
      .isLength({ min: 2, max: 200 })
      .withMessage(MESSAGES.TITLE_LENGTH)
      .trim()
      .escape(),
    body('author')
      .isLength({ min: 2, max: 100 })
      .withMessage(MESSAGES.AUTHOR_LENGTH)
      .trim()
      .escape(),
    body('genre')
      .isLength({ min: 2, max: 50 })
      .withMessage(MESSAGES.GENRE_LENGTH)
      .trim()
      .escape(),
    body('description')
      .isLength({ min: 10, max: 1000 })
      .withMessage(MESSAGES.DESCRIPTION_LENGTH)
      .trim()
      .escape()
  ],
  
  update: [
    body('title')
      .optional()
      .isLength({ min: 2, max: 200 })
      .withMessage(MESSAGES.TITLE_LENGTH)
      .trim()
      .escape(),
    body('author')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage(MESSAGES.AUTHOR_LENGTH)
      .trim()
      .escape(),
    body('genre')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage(MESSAGES.GENRE_LENGTH)
      .trim()
      .escape(),
    body('description')
      .optional()
      .isLength({ min: 10, max: 1000 })
      .withMessage(MESSAGES.DESCRIPTION_LENGTH)
      .trim()
      .escape()
  ]
};

// Review validation rules
const reviewValidation = {
  create: [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage(MESSAGES.RATING_RANGE),
    body('comment')
      .isLength({ min: 10, max: 1000 })
      .withMessage(MESSAGES.COMMENT_LENGTH)
      .trim()
      .escape()
  ]
};

// Query parameter validation
const queryValidation = {
  pagination: (req, res, next) => {
    const { page, limit } = req.query;
    
    if (page && (!Number.isInteger(+page) || +page < 1)) {
      return res.status(400).json({
        success: false,
        message: 'Page must be a positive integer'
      });
    }
    
    if (limit && (!Number.isInteger(+limit) || +limit < 1 || +limit > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100'
      });
    }
    
    next();
  },
  
  sort: (req, res, next) => {
    const { sortBy, sortOrder } = req.query;
    const { SORT_CONFIG } = require('../constants/statusCodes');
    
    if (sortBy && !SORT_CONFIG.ALLOWED_FIELDS.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: `Invalid sort field. Allowed: ${SORT_CONFIG.ALLOWED_FIELDS.join(', ')}`
      });
    }
    
    if (sortOrder && !SORT_CONFIG.ALLOWED_ORDERS.includes(sortOrder.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Sort order must be ASC or DESC'
      });
    }
    
    next();
  }
};

module.exports = {
  userValidation,
  bookValidation,
  reviewValidation,
  queryValidation
}; 