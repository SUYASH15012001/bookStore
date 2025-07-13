const express = require('express')
const { authenticateToken } = require('../middleware/auth')
const { sendSuccessResponse } = require('../utils/errorHandler')

const router = express.Router()

// Get current user info
router.get('/me', authenticateToken, (req, res) => {
  sendSuccessResponse(res, {
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  })
})

module.exports = router
