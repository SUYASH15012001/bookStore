import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { toast } from 'react-toastify';
import { booksAPI } from '../utils/api';
import BookCard from '../components/BookCard';
import SearchAndFilter from '../components/SearchAndFilter';
import CustomPagination from '../components/Pagination';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    booksPerPage: 12
  });
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    genre: '',
    sortBy: 'created_at',
    sortOrder: 'DESC'
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.booksPerPage,
        ...filters
      };
      
      const response = await booksAPI.getAll(params);
      setBooks(response.data.books);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination.totalPages,
        totalBooks: response.data.pagination.totalBooks
      }));
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch books';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [pagination.currentPage, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      title: '',
      author: '',
      genre: '',
      sortBy: 'created_at',
      sortOrder: 'DESC'
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  if (loading && books.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh' 
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            textAlign: isMobile ? 'center' : 'left'
          }}
        >
          Discover Great Books
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ textAlign: isMobile ? 'center' : 'left' }}
        >
          Explore our collection and find your next favorite read
        </Typography>
      </Box>

      <SearchAndFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {books.length === 0 && !loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No books found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={isMobile ? 2 : 3} alignItems="stretch">
            {books.map((book) => (
              <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} key={book.id} display="flex" flexDirection="column">
                <BookCard book={book} sx={{ height: '100%', width: '100%' }} />
              </Grid>
            ))}
          </Grid>

          <CustomPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalBooks}
            itemsPerPage={pagination.booksPerPage}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {loading && books.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default Dashboard; 