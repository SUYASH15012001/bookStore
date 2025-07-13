const express = require('express')
const { validationResult } = require('express-validator')
const pool = require('../config/db')
const { authenticateToken, requireAdmin } = require('../middleware/auth')
const { STATUS_CODES, MESSAGES, PAGINATION, SORT_CONFIG } = require('../constants/statusCodes')
const { sendSuccessResponse, asyncHandler } = require('../utils/errorHandler')
const { bookValidation, reviewValidation, queryValidation } = require('../utils/validation')

const router = express.Router()

// Get all books with filtering, searching, and pagination
router.get('/', queryValidation.pagination, queryValidation.sort, asyncHandler(async (req, res) => {
  let {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    genre,
    author,
    title,
    sortBy = SORT_CONFIG.DEFAULT_FIELD,
    sortOrder = SORT_CONFIG.DEFAULT_ORDER
  } = req.query

  const offset = (parseInt(page) - 1) * parseInt(limit)

  // Build WHERE clause for filters
  let whereClause = 'WHERE 1=1'
  const queryParams = []
  let paramCount = 0

  if (genre) {
    paramCount++
    whereClause += ` AND genre ILIKE $${paramCount}`
    queryParams.push(`%${genre}%`)
  }

  if (author) {
    paramCount++
    whereClause += ` AND author ILIKE $${paramCount}`
    queryParams.push(`%${author}%`)
  }

  if (title) {
    paramCount++
    whereClause += ` AND title ILIKE $${paramCount}`
    queryParams.push(`%${title}%`)
  }

  // Validate sort parameters
  if (!SORT_CONFIG.ALLOWED_FIELDS.includes(sortBy)) {
    sortBy = SORT_CONFIG.DEFAULT_FIELD
  }

  if (!SORT_CONFIG.ALLOWED_ORDERS.includes(sortOrder.toUpperCase())) {
    sortOrder = SORT_CONFIG.DEFAULT_ORDER
  }

  // Get total count
  const countQuery = `SELECT COUNT(*) FROM books ${whereClause}`
  const countResult = await pool.query(countQuery, queryParams)
  const totalBooks = parseInt(countResult.rows[0].count)

  // Get books with pagination
  const booksQuery = `
    SELECT 
      b.*,
      COALESCE(AVG(r.rating), 0) as average_rating,
      COUNT(r.id) as review_count
    FROM books b
    LEFT JOIN reviews r ON b.id = r.book_id
    ${whereClause}
    GROUP BY b.id
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
  `

  const booksResult = await pool.query(booksQuery, [...queryParams, limit, offset])

  sendSuccessResponse(res, {
    books: booksResult.rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
      booksPerPage: parseInt(limit)
    }
  })
}))

// Get all reviews for a book
router.get('/:bookId/reviews', queryValidation.pagination, asyncHandler(async (req, res) => {
  const { bookId } = req.params
  const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = req.query

  const offset = (parseInt(page) - 1) * parseInt(limit)

  // Check if book exists
  const bookExists = await pool.query('SELECT * FROM books WHERE id = $1', [bookId])
  if (bookExists.rows.length === 0) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: MESSAGES.BOOK_NOT_FOUND
    })
  }

  // Get total count of reviews
  const countResult = await pool.query(
    'SELECT COUNT(*) FROM reviews WHERE book_id = $1',
    [bookId]
  )
  const totalReviews = parseInt(countResult.rows[0].count)

  // Get reviews with user information
  const reviewsResult = await pool.query(
    `SELECT 
      r.*,
      u.name as reviewer_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.book_id = $1
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3`,
    [bookId, limit, offset]
  )

  sendSuccessResponse(res, {
    reviews: reviewsResult.rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalReviews / limit),
      totalReviews,
      reviewsPerPage: parseInt(limit)
    }
  })
}))

// Add a review to a book (logged-in users only)
router.post('/:bookId/reviews', [
  authenticateToken,
  ...reviewValidation.create
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      errors: errors.array()
    })
  }

  const { bookId } = req.params
  const { rating, comment } = req.body
  const userId = req.user.id

  // Check if book exists
  const bookExists = await pool.query('SELECT * FROM books WHERE id = $1', [bookId])
  if (bookExists.rows.length === 0) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: MESSAGES.BOOK_NOT_FOUND
    })
  }

  // Create review
  const result = await pool.query(
    'INSERT INTO reviews (user_id, book_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, bookId, rating, comment]
  )

  // Get the created review with user information
  const reviewWithUser = await pool.query(
    `SELECT 
      r.*,
      u.name as reviewer_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.id = $1`,
    [result.rows[0].id]
  )

  sendSuccessResponse(res, {
    review: reviewWithUser.rows[0]
  }, MESSAGES.REVIEW_ADDED, STATUS_CODES.CREATED)
}))

// Get single book by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params

  const result = await pool.query(
    `SELECT 
      b.*,
      COALESCE(AVG(r.rating), 0) as average_rating,
      COUNT(r.id) as review_count
    FROM books b
    LEFT JOIN reviews r ON b.id = r.book_id
    WHERE b.id = $1
    GROUP BY b.id`,
    [id]
  )

  if (result.rows.length === 0) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: MESSAGES.BOOK_NOT_FOUND
    })
  }

  sendSuccessResponse(res, { book: result.rows[0] })
}))

// Create new book (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  ...bookValidation.create
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      errors: errors.array()
    })
  }

  const { title, author, genre, description } = req.body

  const result = await pool.query(
    'INSERT INTO books (title, author, genre, description) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, author, genre, description]
  )

  sendSuccessResponse(res, {
    book: result.rows[0]
  }, MESSAGES.BOOK_CREATED, STATUS_CODES.CREATED)
}))

// Update book (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  ...bookValidation.update
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      errors: errors.array()
    })
  }

  const { id } = req.params
  const { title, author, genre, description } = req.body

  // Check if book exists
  const bookExists = await pool.query('SELECT * FROM books WHERE id = $1', [id])
  if (bookExists.rows.length === 0) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: MESSAGES.BOOK_NOT_FOUND
    })
  }

  // Check for uniqueness if title, author, or genre is being updated
  if (title !== undefined && author !== undefined && genre !== undefined) {
    const duplicate = await pool.query(
      'SELECT * FROM books WHERE title = $1 AND author = $2 AND genre = $3 AND id <> $4',
      [title, author, genre, id]
    )
    if (duplicate.rows.length > 0) {
      return res.status(STATUS_CODES.CONFLICT).json({
        success: false,
        message: MESSAGES.BOOK_EXISTS
      })
    }
  }

  // Build update query dynamically
  const updateFields = []
  const queryParams = []
  let paramCount = 0

  if (title !== undefined) {
    paramCount++
    updateFields.push(`title = $${paramCount}`)
    queryParams.push(title)
  }

  if (author !== undefined) {
    paramCount++
    updateFields.push(`author = $${paramCount}`)
    queryParams.push(author)
  }

  if (genre !== undefined) {
    paramCount++
    updateFields.push(`genre = $${paramCount}`)
    queryParams.push(genre)
  }

  if (description !== undefined) {
    paramCount++
    updateFields.push(`description = $${paramCount}`)
    queryParams.push(description)
  }

  if (updateFields.length === 0) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.NO_FIELDS_TO_UPDATE
    })
  }

  queryParams.push(id)

  const result = await pool.query(
    `UPDATE books SET ${updateFields.join(', ')} WHERE id = $${paramCount + 1} RETURNING *`,
    queryParams
  )

  sendSuccessResponse(res, {
    book: result.rows[0]
  }, MESSAGES.BOOK_UPDATED)
}))

// Delete book (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], asyncHandler(async (req, res) => {
  const { id } = req.params

  // Check if book exists
  const bookExists = await pool.query('SELECT * FROM books WHERE id = $1', [id])
  if (bookExists.rows.length === 0) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: MESSAGES.BOOK_NOT_FOUND
    })
  }

  // Delete associated reviews first
  await pool.query('DELETE FROM reviews WHERE book_id = $1', [id])

  // Delete book
  await pool.query('DELETE FROM books WHERE id = $1', [id])

  sendSuccessResponse(res, null, MESSAGES.BOOK_DELETED)
}))

module.exports = router
