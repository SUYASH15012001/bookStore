import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { booksAPI } from '../utils/api';
import CustomPagination from '../components/Pagination';
import { validateBookForm, clearFieldError, isFormValid } from '../utils/validation';
import { showSuccessMessage, withFormHandling, handleApiError } from '../utils/errorHandler';
import { MESSAGES, GENRES, PAGINATION } from '../constants/api';

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: PAGINATION.DEFAULT_PAGE,
    totalPages: 1,
    totalBooks: 0,
    booksPerPage: PAGINATION.DEFAULT_LIMIT
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchBooks = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit: pagination.booksPerPage
      };
      const response = await booksAPI.getAll(params);
      setBooks(response.data.books);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: response.data.pagination.totalPages,
        totalBooks: response.data.pagination.totalBooks
      }));
    } catch (error) {
      setError(error);
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(1);
    // eslint-disable-next-line
  }, []);

  const validateForm = () => {
    const validationErrors = validateBookForm(formData);
    setFormErrors(validationErrors);
    return isFormValid(validationErrors);
  };

  const handleOpenDialog = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        genre: '',
        description: '',
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      genre: '',
      description: '',
    });
    setFormErrors({});
  };

  const handleSubmit = withFormHandling(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (editingBook) {
      await booksAPI.update(editingBook.id, formData);
      showSuccessMessage(MESSAGES.BOOK_UPDATED);
    } else {
      await booksAPI.create(formData);
      showSuccessMessage(MESSAGES.BOOK_CREATED);
    }
    
    handleCloseDialog();
    fetchBooks();
  }, setSubmitting);

  const handleDelete = (bookId) => {
    setBookToDelete(bookId);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!bookToDelete) return;
    try {
      await booksAPI.delete(bookToDelete);
      showSuccessMessage(MESSAGES.BOOK_DELETED);
      fetchBooks();
    } catch (error) {
      // Error handling is done by the API interceptor
    } finally {
      setDeleteDialogOpen(false);
      setBookToDelete(null);
    }
  };
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    clearFieldError(formErrors, setFormErrors, name);
  };

  const handlePageChange = (page) => {
    fetchBooks(page);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ fontWeight: 600 }}
          >
            Admin Panel
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            size={isMobile ? "small" : "medium"}
          >
            Add Book
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Manage books in the library
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={isMobile ? 2 : 3}>
        {books.map((book) => (
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }} key={book.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  by {book.author}
                </Typography>
                <Typography variant="body2" color="primary" gutterBottom>
                  {book.genre}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.4
                  }}
                >
                  {book.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(book)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(book.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
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

      {books.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No books found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add your first book to get started
          </Typography>
        </Box>
      )}

      {/* Add/Edit Book Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingBook ? 'Edit Book' : 'Add New Book'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  disabled={submitting}
                  required
                  slotProps={{ input: { minLength: 2, maxLength: 200 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  error={!!formErrors.author}
                  helperText={formErrors.author}
                  disabled={submitting}
                  required
                  slotProps={{ input: { minLength: 2, maxLength: 100 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={!!formErrors.genre} required>
                  <InputLabel>Genre</InputLabel>
                  <Select
                    name="genre"
                    value={formData.genre}
                    label="Genre"
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    {GENRES.map((genre) => (
                      <MenuItem key={genre} value={genre}>
                        {genre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  disabled={submitting}
                  slotProps={{ input: { minLength: 10, maxLength: 1000 } }}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (editingBook ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this book? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel; 