import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Rating,
  Box,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleViewDetails = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: isMobile ? 2 : 3 }}>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            lineHeight: 1.2,
            mb: 1
          }}
        >
          {book.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom
          sx={{ mb: 1 }}
        >
          by {book.author}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip 
            label={book.genre} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            mb: 2,
            lineHeight: 1.4
          }}
        >
          {book.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={book.average_rating || 0} 
            precision={0.5} 
            size="small" 
            readOnly 
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({book.review_count || 0} reviews)
          </Typography>
        </Box>

        {book.published_year && (
          <Typography variant="caption" color="text.secondary">
            Published: {book.published_year}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ p: isMobile ? 2 : 3, pt: 0 }}>
        <Button 
          size="small" 
          color="primary" 
          onClick={handleViewDetails}
          fullWidth
          variant="contained"
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default BookCard; 