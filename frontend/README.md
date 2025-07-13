# Book Review Platform - Frontend

A modern React frontend for the book review platform built with Material-UI (MUI).

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create a `.env` file (optional):**
   ```bash
   # In the frontend directory
   echo "REACT_APP_API_URL=http://localhost:3001" > .env
   ```
   - This sets the backend API URL. Adjust if your backend runs elsewhere.
4. **Start the development server:**
   ```bash
   npm start
   ```
   - The app will open at [http://localhost:3000](http://localhost:3000)

---

## Features

- **Responsive Design**: Mobile-first approach with responsive layouts
- **Authentication**: User registration, login, and JWT token management
- **Book Management**: Browse, search, and filter books
- **Review System**: Add and view book reviews with ratings
- **Admin Panel**: Full CRUD operations for books (admin only)
- **Toast Notifications**: User feedback for all actions
- **Form Validation**: Client-side validation with error messages
- **Modern UI**: Clean and intuitive Material-UI design

## Tech Stack

- React 18
- Material-UI (MUI) v5
- React Router v6
- Axios for API calls
- React Toastify for notifications
- Context API for state management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see backend README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file (optional):
```bash
# Create .env file in frontend directory
REACT_APP_API_URL=http://localhost:3001
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BookCard.js     # Book display card
│   ├── Navbar.js       # Navigation bar
│   ├── Pagination.js   # Pagination component
│   ├── ReviewList.js   # Reviews display
│   └── SearchAndFilter.js # Search and filter controls
├── pages/              # Page components
│   ├── AdminPanel.js   # Admin book management
│   ├── BookDetails.js  # Book details and reviews
│   ├── Dashboard.js    # Main book listing
│   ├── Login.js        # User login
│   └── Register.js     # User registration
├── utils/              # Utilities and services
│   ├── api.js          # API service functions
│   └── AuthContext.js  # Authentication context
└── App.js              # Main app component
```

## Features in Detail

### Authentication
- User registration with validation
- Login with JWT token storage
- Protected routes for authenticated users
- Role-based access control (user/admin)

### Book Dashboard
- Responsive grid layout for books
- Search by title, filter by author/genre
- Sorting options (title, author, genre, rating, date)
- Pagination for large book collections
- Real-time search and filtering

### Book Details
- Comprehensive book information display
- Average rating and review count
- Review list with user information
- Add review functionality (authenticated users)
- Responsive layout with sidebar

### Admin Panel
- Full book management (Create, Read, Update, Delete)
- Form validation for all inputs
- ISBN and publication year validation
- Confirmation dialogs for destructive actions
- Responsive card layout

### Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:3001)

## API Integration

The frontend communicates with the backend through the API service in `src/utils/api.js`. All API calls include:

- Automatic JWT token inclusion
- Error handling and user feedback
- Loading states
- Automatic logout on authentication errors

## Styling

The app uses Material-UI (MUI) for consistent, modern styling:

- Custom theme with primary/secondary colors
- Responsive breakpoints
- Consistent spacing and typography
- Dark/light mode ready (can be extended)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Use MUI components for consistency
3. Implement responsive design
4. Add proper error handling
5. Include loading states
6. Test on mobile devices
