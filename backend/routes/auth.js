const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const pool = require('../config/db');
const { STATUS_CODES, MESSAGES } = require('../constants/statusCodes');
const { sendSuccessResponse, sendErrorResponse, asyncHandler } = require('../utils/errorHandler');
const { userValidation } = require('../utils/validation');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

// Register user
router.post('/register', userValidation.register, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  const { name, email, password } = req.body;

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const result = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [name, email, hashedPassword, 'user']
  );

  const user = result.rows[0];

  // Generate JWT token
  const token = generateToken({ userId: user.id });

  sendSuccessResponse(res, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  }, MESSAGES.USER_REGISTERED, STATUS_CODES.CREATED);
}));

// Login user
router.post('/login', userValidation.login, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  const { email, password } = req.body;

  // Find user
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ 
      success: false,
      message: MESSAGES.INVALID_CREDENTIALS 
    });
  }

  const user = result.rows[0];

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ 
      success: false,
      message: MESSAGES.INVALID_CREDENTIALS 
    });
  }

  // Generate JWT token
  const token = generateToken({ userId: user.id });

  sendSuccessResponse(res, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  }, MESSAGES.LOGIN_SUCCESSFUL);
}));

module.exports = router; 