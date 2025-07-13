const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { STATUS_CODES, MESSAGES } = require('./constants/statusCodes');
const { sendErrorResponse } = require('./utils/errorHandler');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.status(STATUS_CODES.OK).json({ 
    success: true,
    message: MESSAGES.SERVER_RUNNING 
  });
});

// Import routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

// Use routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/users', userRoutes);

// 404 handler
app.use('*name', (req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).json({ 
    success: false,
    message: MESSAGES.ROUTE_NOT_FOUND 
  });
});

// Global error handling middleware
app.use((err, req, res) => {
  sendErrorResponse(res, err, {
    method: req.method,
    url: req.url
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 