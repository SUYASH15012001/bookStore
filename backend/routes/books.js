const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all books with filtering, searching, and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      genre, 
      author, 
      title,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Build WHERE clause for filters
    let whereClause = 'WHERE 1=1';
    const queryParams = [];
    let paramCount = 0;

    if (genre) {
      paramCount++;
      whereClause += ` AND genre ILIKE $${paramCount}`;
      queryParams.push(`%${genre}%`);
    }

    if (author) {
      paramCount++;
      whereClause += ` AND author ILIKE $${paramCount}`;
      queryParams.push(`%${author}%`);
    }

    if (title) {
      paramCount++;
      whereClause += ` AND title ILIKE $${paramCount}`;
      queryParams.push(`%${title}%`);
    }

    // Validate sort parameters
    const allowedSortFields = ['title', 'author', 'genre', 'created_at', 'average_rating'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    if (!allowedSortFields.includes(sortBy)) {
      sortBy = 'created_at';
    }
    
    if (!allowedSortOrders.includes(sortOrder.toUpperCase())) {
      sortOrder = 'DESC';
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM books ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const totalBooks = parseInt(countResult.rows[0].count);

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
    `;

    const booksResult = await pool.query(booksQuery, [...queryParams, limit, offset]);

    res.json({
      books: booksResult.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBooks / limit),
        totalBooks,
        booksPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all reviews for a book
router.get('/:bookId/reviews', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    // Check if book exists
    const bookExists = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);
    if (bookExists.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Get total count of reviews
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM reviews WHERE book_id = $1',
      [bookId]
    );
    const totalReviews = parseInt(countResult.rows[0].count);

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
    );

    res.json({
      reviews: reviewsResult.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        reviewsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a review to a book (logged-in users only)
router.post('/:bookId/reviews', [
  authenticateToken,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Check if book exists
    const bookExists = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);
    if (bookExists.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Create review
    const result = await pool.query(
      'INSERT INTO reviews (user_id, book_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, bookId, rating, comment]
    );

    // Get the created review with user information
    const reviewWithUser = await pool.query(
      `SELECT 
        r.*,
        u.name as reviewer_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json({
      message: 'Review added successfully',
      review: reviewWithUser.rows[0]
    });
  } catch (error) {
    if (err.code === '23505') {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single book by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

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
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ book: result.rows[0] });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new book (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('genre').optional(),
  body('description').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, genre, description } = req.body;

    const result = await pool.query(
      'INSERT INTO books (title, author, genre, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, author, genre, description]
    );

    res.status(201).json({
      message: 'Book created successfully',
      book: result.rows[0]
    });
  } catch (error) {
    console.error('Create book error:', error);
    if (err.code === '23505') {
      return res.status(400).json({ message: 'A book with the same title, author, and genre already exists.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update book (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().notEmpty().withMessage('Author cannot be empty'),
  body('genre').optional(),
  body('description').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, author, genre, description } = req.body;

    // Check if book exists
    const bookExists = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (bookExists.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check for uniqueness if title, author, or genre is being updated
    if (title !== undefined && author !== undefined && genre !== undefined) {
      const duplicate = await pool.query(
        'SELECT * FROM books WHERE title = $1 AND author = $2 AND genre = $3 AND id <> $4',
        [title, author, genre, id]
      );
      if (duplicate.rows.length > 0) {
        return res.status(400).json({ message: 'A book with the same title, author, and genre already exists.' });
      }
    }

    // Build update query dynamically
    const updateFields = [];
    const queryParams = [];
    let paramCount = 0;

    if (title !== undefined) {
      paramCount++;
      updateFields.push(`title = $${paramCount}`);
      queryParams.push(title);
    }

    if (author !== undefined) {
      paramCount++;
      updateFields.push(`author = $${paramCount}`);
      queryParams.push(author);
    }

    if (genre !== undefined) {
      paramCount++;
      updateFields.push(`genre = $${paramCount}`);
      queryParams.push(genre);
    }

    if (description !== undefined) {
      paramCount++;
      updateFields.push(`description = $${paramCount}`);
      queryParams.push(description);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    queryParams.push(id);

    const result = await pool.query(
      `UPDATE books SET ${updateFields.join(', ')} WHERE id = $${paramCount + 1} RETURNING *`,
      queryParams
    );

    res.json({
      message: 'Book updated successfully',
      book: result.rows[0]
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete book (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if book exists
    const bookExists = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (bookExists.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Delete associated reviews first
    await pool.query('DELETE FROM reviews WHERE book_id = $1', [id]);

    // Delete book
    await pool.query('DELETE FROM books WHERE id = $1', [id]);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 