import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Rating,
  Typography,
  Box,
  Divider,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';

const ReviewList = ({ reviews, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading reviews...</Typography>
      </Box>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No reviews yet. Be the first to review this book!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mt: 2 }}>
      <Box sx={{ p: isMobile ? 2 : 3, pb: 1 }}>
        <Typography variant="h6" gutterBottom>
          Reviews ({reviews.length})
        </Typography>
      </Box>
      <List sx={{ p: 0 }}>
        {reviews.map((review, index) => (
          <React.Fragment key={review.id}>
            <ListItem 
              sx={{ 
                px: isMobile ? 2 : 3,
                py: 2,
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Box sx={{ width: '100%', mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {review.reviewer_name}
                  </Typography>
                  <Rating 
                    value={review.rating} 
                    size="small" 
                    readOnly 
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(review.created_at).toLocaleDateString()}
                </Typography>
              </Box>
              <ListItemText
                primary={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {review.comment}
                  </Typography>
                }
                sx={{ m: 0 }}
              />
            </ListItem>
            {index < reviews.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ReviewList; 