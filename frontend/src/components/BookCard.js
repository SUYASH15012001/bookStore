import React from 'react';
import { Card, CardContent, Typography, Button, Rating, Box, Chip, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import BookIcon from '@mui/icons-material/Book';
import PersonIcon from '@mui/icons-material/Person';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const getBookColor = (title) => {
  const colors = [
    '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6',
    '#8b5cf6', '#059669', '#d97706', '#06b6d4', '#7c3aed',
  ];
  const hash = title.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
};

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: theme.shadows[3],
  background: theme.palette.background.default,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: theme.shadows[8],
    '& .book-cover': {
      transform: 'scale(1.08)',
    },
    '& .view-button': {
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      transform: 'translateY(-2px)',
    }
  }
}));

const BookCover = styled(Box)(({ theme, bgcolor }) => ({
  height: 120,
  background: `linear-gradient(135deg, ${bgcolor} 0%, ${theme.palette.primary.light} 100%)`,
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderTopLeftRadius: theme.shape.borderRadius * 2,
  borderTopRightRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
}));

const GenreChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 14,
  right: 14,
  background: theme.palette.background.paper,
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: '0.75rem',
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  letterSpacing: 0.5,
  zIndex: 2,
}));

const ViewButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
  fontWeight: 600,
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontSize: '0.97rem',
  letterSpacing: 0.1,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: theme.palette.background.paper,
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  '&:hover': {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  }
}));

const BookCard = ({ book, sx = {} }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const bookColor = getBookColor(book.title);

  const handleViewDetails = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <StyledCard sx={sx}>
      <BookCover bgcolor={bookColor} className="book-cover">
        <BookIcon 
          sx={{ 
            fontSize: 54, 
            color: 'white',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.18))',
            zIndex: 1,
            transform: 'translateY(-8px) scale(1.1)',
            transition: 'transform 0.3s',
          }} 
        />
        {book.genre && (
          <GenreChip label={book.genre} size="small" />
        )}
      </BookCover>
      <CardContent sx={{ flexGrow: 1, p: isMobile ? 2.5 : 3, pb: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          component="h2" 
          sx={{ 
            fontWeight: 700,
            lineHeight: 1.3,
            mb: 1,
            color: 'text.primary',
            fontSize: isMobile ? '1.1rem' : '1.25rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            letterSpacing: '-0.5px',
          }}
        >
          {book.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 500,
              fontSize: '0.9rem',
              letterSpacing: 0.1,
            }}
          >
            {book.author}
          </Typography>
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
            mb: 2.5,
            lineHeight: 1.5,
            fontSize: '0.93rem',
            flexGrow: 1,
            letterSpacing: 0.1,
          }}
        >
          {book.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Rating 
            value={book.average_rating || 0} 
            precision={0.5} 
            size="small" 
            readOnly 
          />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              ml: 1,
              fontWeight: 500,
              fontSize: '0.8rem',
              letterSpacing: 0.1,
            }}
          >
            {book.average_rating ? Number(book.average_rating).toFixed(1) : '0'} 
            <span style={{ color: '#9ca3af' }}> • </span>
            {book.review_count || 0} reviews
          </Typography>
        </Box>
        {book.published_year && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontWeight: 500,
                fontSize: '0.75rem',
                letterSpacing: 0.1,
              }}
            >
              Published {book.published_year}
            </Typography>
          </Box>
        )}
      </CardContent>
      <Box sx={{ px: isMobile ? 2.5 : 3, pt: 0, pb: 2.5, mt: 'auto' }}>
        <ViewButton
          variant="outlined"
          onClick={handleViewDetails}
          fullWidth
          startIcon={<VisibilityIcon />}
          className="view-button"
        >
          View Details
        </ViewButton>
      </Box>
    </StyledCard>
  );
};

export default BookCard; 