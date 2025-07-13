# Book Review Platform - Backend

A Node.js/Express backend for the book review platform with PostgreSQL database.

## Features

- User authentication with JWT
- Role-based access control (user/admin)
- Book CRUD operations
- Review system
- Search and filtering
- Pagination

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file with the following variables:
```
PORT=3001
DB_USER=postgres
DB_HOST=localhost
DB_NAME=bookreview_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key
```

3. Make sure PostgreSQL is running and the database is created.

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /users/me` - Get current user info

### Books
- `GET /books` - Get all books (with filters, search, pagination)
- `GET /books/:id` - Get single book
- `POST /books` - Create book (admin only)
- `PUT /books/:id` - Update book (admin only)
- `DELETE /books/:id` - Delete book (admin only)

### Reviews
- `GET /books/:bookId/reviews` - Get reviews for a book
- `POST /books/:bookId/reviews` - Add review to book (authenticated users)

## Query Parameters for Books

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `genre` - Filter by genre
- `author` - Filter by author
- `title` - Search by title
- `sortBy` - Sort field (title, author, genre, created_at, rating)
- `sortOrder` - Sort order (ASC, DESC) 