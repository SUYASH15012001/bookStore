import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

const SearchAndFilter = ({ filters, onFilterChange, onClearFilters }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (field) => (event) => {
    onFilterChange({ ...filters, [field]: event.target.value });
  };

  const handleClear = () => {
    onClearFilters();
  };

  return (
    <Paper sx={{ p: isMobile ? 2 : 3, mb: 3 }}>
      <Grid container spacing={2} direction={isMobile ? 'column' : 'row'} wrap="wrap" alignItems="center">
        <Grid item xs={12} sm={6} md={2.4} lg={2}>
          <TextField
            fullWidth
            label="Search by title"
            value={filters.title || ''}
            onChange={handleChange('title')}
            size="small"
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4} lg={2}>
          <TextField
            fullWidth
            label="Filter by author"
            value={filters.author || ''}
            onChange={handleChange('author')}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              value={filters.genre === undefined ? '' : filters.genre}
              label="Genre"
              onChange={handleChange('genre')}
            >
              <MenuItem value=""><em>All Genres</em></MenuItem>
              <MenuItem value="Fiction">Fiction</MenuItem>
              <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
              <MenuItem value="Mystery">Mystery</MenuItem>
              <MenuItem value="Science Fiction">Science Fiction</MenuItem>
              <MenuItem value="Fantasy">Fantasy</MenuItem>
              <MenuItem value="Romance">Romance</MenuItem>
              <MenuItem value="Thriller">Thriller</MenuItem>
              <MenuItem value="Biography">Biography</MenuItem>
              <MenuItem value="History">History</MenuItem>
              <MenuItem value="Self-Help">Self-Help</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="sortby-label">Sort By</InputLabel>
            <Select
              labelId="sortby-label"
              value={filters.sortBy || 'created_at'}
              label="Sort By"
              onChange={handleChange('sortBy')}
            >
              <MenuItem value="created_at">Date Added</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="author">Author</MenuItem>
              <MenuItem value="genre">Genre</MenuItem>
              <MenuItem value="average_rating">Rating</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="sortorder-label">Sort Direction</InputLabel>
            <Select
              labelId="sortorder-label"
              value={filters.sortOrder || 'DESC'}
              label="Sort Direction"
              onChange={handleChange('sortOrder')}
            >
              <MenuItem value="DESC">Descending</MenuItem>
              <MenuItem value="ASC">Ascending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={12} lg={2}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: isMobile ? 'flex-start' : 'flex-end', height: '100%' }}>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClear}
              size="small"
              fullWidth={isMobile}
            >
              Clear Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SearchAndFilter; 