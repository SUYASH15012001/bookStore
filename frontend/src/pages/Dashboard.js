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
import { styled } from '@mui/material/styles';
import { booksAPI } from '../utils/api';
import BookCard from '../components/BookCard';
import SearchAndFilter from '../components/SearchAndFilter';
import CustomPagination from '../components/Pagination';
import { handleApiError } from '../utils/errorHandler';

const StyledContainer = styled(Container)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: 16,
  boxShadow: theme.shadows[2],
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(5),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(5),
  minHeight: '80vh',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  letterSpacing: '-0.5px',
  textAlign: 'left',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  textAlign: 'left',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8, 0),
  color: theme.palette.text.secondary,
  background: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: theme.shadows[1],
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

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

  const fetchBooks = React.useCallback(async () => {
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
      setError(error);
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.booksPerPage, filters]);

  useEffect(() => {
    fetchBooks();
  }, [pagination.currentPage, filters, fetchBooks]);

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
      <StyledContainer maxWidth="lg">
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
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      <HeaderSection>
        <Title variant="h4" component="h1" gutterBottom>
          Discover Great Books
        </Title>
        <Subtitle variant="body1">
          Explore our collection and find your next favorite read
        </Subtitle>
      </HeaderSection>

      <SearchAndFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {books.length === 0 && !loading ? (
        <EmptyState>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No books found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters
          </Typography>
        </EmptyState>
      ) : (
        <>
          <Grid container spacing={isMobile ? 2 : 3} alignItems="stretch" sx={{ mt: 1 }}>
            {books.map((book) => (
              <StyledGridItem size={{ xs: 12, sm: 6, md: 3, lg: 3 }} key={book.id}>
                <BookCard book={book} sx={{ height: '100%', width: '100%', borderRadius: 3, boxShadow: theme.shadows[1], background: theme.palette.background.default }} />
              </StyledGridItem>
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
    </StyledContainer>
  );
};

export default Dashboard; 