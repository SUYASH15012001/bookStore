const { STATUS_CODES, MESSAGES, DB_ERROR_CODES } = require('../constants/statusCodes')

// Enhanced error logging
const logError = (error, context = {}) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    code: error.code,
    context,
    ...(error.sql && { sql: error.sql }),
    ...(error.query && { query: error.query }),
    ...(error.parameters && { parameters: error.parameters })
  }

  console.error('🚨 ERROR:', JSON.stringify(errorInfo, null, 2))
}

// Database error handler
const handleDatabaseError = (error) => {
  switch (error.code) {
    case DB_ERROR_CODES.UNIQUE_VIOLATION:
      return {
        status: STATUS_CODES.CONFLICT,
        message: MESSAGES.USER_EXISTS
      }
    case DB_ERROR_CODES.FOREIGN_KEY_VIOLATION:
      return {
        status: STATUS_CODES.BAD_REQUEST,
        message: 'Referenced record does not exist'
      }
    case DB_ERROR_CODES.NOT_NULL_VIOLATION:
      return {
        status: STATUS_CODES.BAD_REQUEST,
        message: 'Required field is missing'
      }
    default:
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.SERVER_ERROR
      }
  }
}

// Validation error handler
const handleValidationError = (errors) => {
  return {
    status: STATUS_CODES.BAD_REQUEST,
    message: 'Validation failed',
    errors: errors.array()
  }
}

// JWT error handler
const handleJWTError = () => {
  return {
    status: STATUS_CODES.UNAUTHORIZED,
    message: MESSAGES.INVALID_TOKEN
  }
}

// Generic error response
const sendErrorResponse = (res, error, context = {}) => {
  logError(error, context)

  let status = STATUS_CODES.INTERNAL_SERVER_ERROR
  let message = MESSAGES.SERVER_ERROR

  // Handle specific error types
  if (error.code && Object.values(DB_ERROR_CODES).includes(error.code)) {
    const dbError = handleDatabaseError(error)
    status = dbError.status
    message = dbError.message
  } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    const jwtError = handleJWTError(error)
    status = jwtError.status
    message = jwtError.message
  } else if (error.status) {
    status = error.status
    message = error.message || MESSAGES.SERVER_ERROR
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  })
}

// Success response helper
const sendSuccessResponse = (res, data, message = 'Success', status = STATUS_CODES.OK) => {
  res.status(status).json({
    success: true,
    message,
    data
  })
}

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      sendErrorResponse(res, error, {
        method: req.method,
        url: req.url,
        userId: req.user?.id
      })
    })
  }
}

module.exports = {
  logError,
  handleDatabaseError,
  handleValidationError,
  handleJWTError,
  sendErrorResponse,
  sendSuccessResponse,
  asyncHandler
}
