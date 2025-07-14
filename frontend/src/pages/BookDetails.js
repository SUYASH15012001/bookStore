import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Rating,
  Chip,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowBack, Add } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { booksAPI, reviewsAPI } from '../utils/api';
import { useAuth } from '../utils/AuthContext';
import ReviewList from '../components/ReviewList';
import { handleApiError } from '../utils/errorHandler';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [commentError, setCommentError] = useState('');

  const fetchBook = React.useCallback(async () => {
    try {
      const response = await booksAPI.getById(id);
      setBook(response.data.book);
    } catch (error) {
      setError(error);
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchReviews = React.useCallback(async () => {
    try {
      const response = await reviewsAPI.getByBookId(id);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBook();
    fetchReviews();
  }, [id, fetchBook, fetchReviews]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const trimmed = reviewForm.comment.trim();
    if (!trimmed) {
      setCommentError('Please enter a review comment');
      toast.error('Please enter a review comment');
      return;
    }
    if (trimmed.length < 10) {
      setCommentError('Comment must be at least 10 characters');
      toast.error('Comment must be at least 10 characters');
      return;
    }
    if (trimmed.length > 1000) {
      setCommentError('Comment must be at most 1000 characters');
      toast.error('Comment must be at most 1000 characters');
      return;
    }
    setCommentError('');
    setSubmittingReview(true);
    
    try {
      const response = await reviewsAPI.create(id, reviewForm);
      setReviews(prev => [response.data.review, ...prev]);
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
      toast.success('Review submitted successfully!');
      
      // Refresh book data to update average rating
      fetchBook();
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmittingReview(false);
    }
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

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning" sx={{ mt: 3 }}>
          Book not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Grid container spacing={isMobile ? 2 : 4}>
        {/* Book Information */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: isMobile ? 2 : 3, mb: 3 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {book.title}
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              gutterBottom
            >
              by {book.author}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={book.genre} color="primary" />
              {book.published_year && (
                <Chip label={`Published ${book.published_year}`} variant="outlined" />
              )}
              {book.isbn && (
                <Chip label={`ISBN: ${book.isbn}`} variant="outlined" />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Rating 
                value={book.average_rating || 0} 
                precision={0.5} 
                size="large" 
                readOnly 
              />
              <Typography variant="body1" sx={{ ml: 2 }}>
                {book.average_rating ? Number(book.average_rating).toFixed(1) : '0'} 
                ({book.review_count || 0} reviews)
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap'
              }}
            >
              {book.description}
            </Typography>
          </Paper>

          {/* Reviews Section */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                Reviews
              </Typography>
              {isAuthenticated && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  Add Review
                </Button>
              )}
            </Box>

            {showReviewForm && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Write a Review
                </Typography>
                <Box component="form" onSubmit={handleReviewSubmit}>
                  <Box sx={{ mb: 2 }}>
                    <Typography component="legend">Rating</Typography>
                    <Rating
                      name="rating"
                      value={reviewForm.rating}
                      onChange={(event, newValue) => {
                        setReviewForm(prev => ({ ...prev, rating: newValue }));
                      }}
                      size="large"
                    />
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Review"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your thoughts about this book..."
                    sx={{ mb: 2 }}
                    slotProps={{ input: { minLength: 10, maxLength: 1000 } }}
                    error={!!commentError}
                    helperText={commentError || `${reviewForm.comment.length}/1000`}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submittingReview}
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setShowReviewForm(false)}
                      disabled={submittingReview}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Paper>
            )}

            <ReviewList reviews={reviews} loading={reviewsLoading} />
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: isMobile ? 2 : 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Book Details
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Genre
              </Typography>
              <Typography variant="body1">
                {book.genre}
              </Typography>
            </Box>

            {book.published_year && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Published
                </Typography>
                <Typography variant="body1">
                  {book.published_year}
                </Typography>
              </Box>
            )}

            {book.isbn && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ISBN
                </Typography>
                <Typography variant="body1">
                  {book.isbn}
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Added
              </Typography>
              <Typography variant="body1">
                {new Date(book.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookDetails; 