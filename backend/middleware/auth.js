const pool = require('../config/db');
const { STATUS_CODES, MESSAGES } = require('../constants/statusCodes');
const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { sendErrorResponse } = require('../utils/errorHandler');

const authenticateToken = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers['authorization']);

    if (!token) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ 
        success: false,
        message: MESSAGES.ACCESS_TOKEN_REQUIRED 
      });
    }

    const decoded = verifyToken(token);
    
    // Get user from database to ensure they still exist
    const result = await pool.query(
      'SELECT id, email, name, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ 
        success: false,
        message: MESSAGES.USER_NOT_FOUND 
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    sendErrorResponse(res, error, {
      method: req.method,
      url: req.url
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(STATUS_CODES.FORBIDDEN).json({ 
      success: false,
      message: MESSAGES.ADMIN_ACCESS_REQUIRED 
    });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin }; 