const jwt = require('jsonwebtoken')
const { JWT_CONFIG } = require('../constants/consts')

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: JWT_CONFIG.EXPIRES_IN
  })
}

// Verify JWT token
const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET)

// Extract token from authorization header
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.split(' ')[1]
}

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader
}
