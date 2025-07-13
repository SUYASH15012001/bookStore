# Book Review Platform

A full-stack web application built with the PERN stack (PostgreSQL, Express.js, React, Node.js) that allows users to browse books, write reviews, and manage a book collection.

## 🚀 Features

### For Users
- **User Authentication**: Register and login with JWT tokens
- **Book Browsing**: View all books with search and filtering
- **Book Details**: View comprehensive book information and reviews
- **Review System**: Add ratings and reviews to books
- **Responsive Design**: Mobile-first approach for all devices

### For Admins
- **Book Management**: Full CRUD operations for books
- **Admin Panel**: Dedicated interface for book administration
- **Role-based Access**: Secure admin-only features

### Technical Features
- **RESTful API**: Well-structured backend API
- **Database Relationships**: Proper PostgreSQL schema design
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error management
- **Toast Notifications**: User feedback for all actions
- **Pagination**: Efficient data loading for large datasets

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Context API** - State management

## 📁 Project Structure

```
myPro/
├── backend/                 # Node.js/Express backend
│   ├── config/
│   │   └── db.js           # Database configuration
│   ├── middleware/
│   │   └── auth.js         # Authentication middleware
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   ├── books.js        # Book management routes
│   │   ├── reviews.js      # Review routes
│   │   └── users.js        # User routes
│   ├── .env                # Environment variables
│   ├── package.json        # Backend dependencies
│   ├── server.js           # Main server file
│   └── README.md           # Backend documentation
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utilities and services
│   │   └── App.js          # Main app component
│   ├── package.json        # Frontend dependencies
│   └── README.md           # Frontend documentation
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Create .env file with your database credentials
PORT=3001
DB_USER=postgres
DB_HOST=localhost
DB_NAME=bookreview_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Books Table
```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  isbn VARCHAR(20),
  published_year INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, book_id)
);
```

## 🔌 API Endpoints

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

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Material Design**: Clean, modern interface using MUI components
- **Loading States**: Visual feedback during data operations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation with helpful error messages
- **Toast Notifications**: Success and error feedback
- **Smooth Animations**: Hover effects and transitions

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing
- **Role-based Access**: Admin-only routes and features
- **SQL Injection Prevention**: Parameterized queries

## 🧪 Testing

The application includes comprehensive error handling and validation:

- **Client-side Validation**: Real-time form validation
- **Server-side Validation**: Express-validator middleware
- **Database Constraints**: PostgreSQL constraints and checks
- **Error Boundaries**: React error boundaries for graceful failures

## 📱 Mobile Responsiveness

The application is built with a mobile-first approach:

- **Responsive Grid**: Adapts to different screen sizes
- **Touch-friendly**: Optimized for touch interactions
- **Readable Typography**: Appropriate font sizes for mobile
- **Optimized Navigation**: Mobile-friendly navigation menu

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables for production
2. Use PM2 or similar process manager
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure environment variables
4. Set up custom domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support and questions:
1. Check the documentation in each directory
2. Review the API endpoints
3. Check the console for error messages
4. Verify database connectivity

## 🎯 Future Enhancements

- User profile management
- Book cover image uploads
- Advanced search filters
- Book recommendations
- Social features (following users, sharing reviews)
- Dark mode theme
- Email notifications
- Book reading lists
- Export functionality 