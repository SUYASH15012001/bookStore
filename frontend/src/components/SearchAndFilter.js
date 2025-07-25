import React, { useRef, useState } from 'react';
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
import { GENRES, SORT_CONFIG } from '../constants/api';

const SearchAndFilter = ({ filters, onFilterChange, onClearFilters }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Local state for immediate UI updates
  const [localFilters, setLocalFilters] = useState({
    title: filters.title || '',
    author: filters.author || ''
  });

  const debounceRef = useRef();
  
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    
    // Update local state immediately for smooth UI
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Debounce API call
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFilterChange({ ...filters, [field]: value });
    }, 500);
  };

  const handleClear = () => {
    // Clear both local state and API filters
    setLocalFilters({ title: '', author: '' });
    onClearFilters();
  };

  return (
    <Paper sx={{ p: isMobile ? 2 : 3, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 6, md: 2}}>
          <TextField
            fullWidth
            label="Search by title"
            value={localFilters.title}
            onChange={handleChange('title')}
            size="small"
            slotProps={{
              input: {
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }} >
          <TextField
            fullWidth
            label="Filter by author"
            value={localFilters.author}
            onChange={handleChange('author')}
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              value={filters.genre === undefined ? '' : filters.genre}
              label="Genre"
              onChange={handleChange('genre')}
            >
              <MenuItem value=""><em>All Genres</em></MenuItem>
              {GENRES.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="sortby-label">Sort By</InputLabel>
            <Select
              labelId="sortby-label"
              value={filters.sortBy || SORT_CONFIG.DEFAULT_FIELD}
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
        <Grid size={{ xs: 12, sm: 6, md: 2 }} >
          <FormControl fullWidth size="small">
            <InputLabel id="sortorder-label">Sort Direction</InputLabel>
            <Select
              labelId="sortorder-label"
              value={filters.sortOrder || SORT_CONFIG.DEFAULT_ORDER}
              label="Sort Direction"
              onChange={handleChange('sortOrder')}
            >
              <MenuItem value="DESC">Descending</MenuItem>
              <MenuItem value="ASC">Ascending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }} >
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