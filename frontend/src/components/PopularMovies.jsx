import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { motion } from 'framer-motion';

// Genre color map for visual variety
const genreColors = {
  Action: ['#FF6B6B', '#FF8E53'],
  Adventure: ['#36D1DC', '#5B86E5'],
  Animation: ['#F6D365', '#FDA085'],
  Children: ['#FFD194', '#70e1f5'],
  Comedy: ['#FF9A9E', '#FAD0C4'],
  Crime: ['#667db6', '#0082c8'],
  Documentary: ['#B24592', '#F15F79'],
  Drama: ['#C33764', '#1D2671'],
  Fantasy: ['#DA22FF', '#9733EE'],
  Romance: ['#ff758c', '#ff7eb3'],
  'Sci-Fi': ['#43cea2', '#185a9d'],
  Thriller: ['#4568DC', '#B06AB3'],
  default: ['#5e60ce', '#4361ee']
};

function PopularMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('rating_count');
  const [stats, setStats] = useState({});

  const fetchPopularMovies = async (sortOption = 'rating_count') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/popular-movies?sort_by=${sortOption}&limit=20&min_ratings=20`);
      if (!response.ok) throw new Error('Failed to fetch popular movies');
      const data = await response.json();
      setMovies(data.movies);
      setStats({
        totalMovies: data.total_movies,
        globalMeanRating: data.global_mean_rating,
        sortBy: data.sort_by
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularMovies(sortBy);
  }, [sortBy]);

  const handleSortChange = (event, newSortBy) => {
    if (newSortBy !== null) {
      setSortBy(newSortBy);
    }
  };

  const getSortIcon = (sort) => {
    switch(sort) {
      case 'rating_count': return <ThumbUpIcon fontSize="small" />;
      case 'avg_rating': return <StarIcon fontSize="small" />;
      case 'weighted_score': return <TrendingUpIcon fontSize="small" />;
      default: return <ThumbUpIcon fontSize="small" />;
    }
  };

  const getSortLabel = (sort) => {
    switch(sort) {
      case 'rating_count': return 'Most Rated';
      case 'avg_rating': return 'Highest Rated';
      case 'weighted_score': return 'Best Overall';
      default: return 'Most Rated';
    }
  };

  const getMovieRank = (index) => {
    return `#${index + 1}`;
  };

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#5e60ce',
            mb: 2,
            textAlign: 'center',
            letterSpacing: -0.5
          }}
        >
          🎭 Popular Movies
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            textAlign: 'center',
            mb: 3,
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Discover the most beloved movies in the MovieLens database. Sort by different criteria to explore various aspects of movie popularity.
        </Typography>

        {/* Sort Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ToggleButtonGroup
            value={sortBy}
            exclusive
            onChange={handleSortChange}
            aria-label="sort criteria"
            sx={{
              gap: 1,
              '& .MuiToggleButton-root': {
                px: 3,
                py: 1.5,
                border: '2px solid #5e60ce',
                borderRadius: 2,
                color: '#5e60ce',
                fontWeight: 600,
                textTransform: 'none',
                marginRight: 1,
                '&:hover': {
                  backgroundColor: 'rgba(94, 96, 206, 0.08)'
                },
                '&.Mui-selected': {
                  backgroundColor: '#5e60ce',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#4c4fb8'
                  }
                }
              }
            }}
          >
            <ToggleButton value="rating_count">
              <ThumbUpIcon sx={{ mr: 1 }} />
              Most Rated
            </ToggleButton>
            <ToggleButton value="avg_rating">
              <StarIcon sx={{ mr: 1 }} />
              Highest Rated
            </ToggleButton>
            <ToggleButton value="weighted_score">
              <TrendingUpIcon sx={{ mr: 1 }} />
              Best Overall
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Stats Summary */}
        {stats.totalMovies && (
          <Paper
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: 'rgba(94, 96, 206, 0.05)',
              border: '1px solid rgba(94, 96, 206, 0.2)'
            }}
          >
            <Grid container spacing={2} sx={{ textAlign: 'center' }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ color: '#5e60ce', fontWeight: 600 }}>
                  {stats.totalMovies}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Qualified Movies
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ color: '#5e60ce', fontWeight: 600 }}>
                  {stats.globalMeanRating?.toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Average Rating
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={40} sx={{ color: '#5e60ce' }} />
        </Box>
      )}

      {/* Movies Grid */}
      {!loading && movies.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(auto-fill, minmax(280px, 1fr))',
              sm: 'repeat(auto-fill, minmax(320px, 1fr))',
            },
            gap: { xs: 2, sm: 3 },
          }}
        >
          {movies.map((movie, index) => {
            const mainGenre = movie.genres[0] || 'default';
            const colors = genreColors[mainGenre] || genreColors.default;
            
            return (
              <motion.div
                key={movie.movie_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    border: index < 3 ? '2px solid #f72585' : '1px solid #f0f0f0',
                    position: 'relative'
                  }}
                >
                  {/* Genre Header with Rank Badge */}
                  <Box
                    sx={{
                      background: `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 2,
                      py: 1.5,
                      position: 'relative'
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {mainGenre}
                    </Typography>
                    
                    {/* Rank Badge - positioned in header */}
                    <Box
                      sx={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        color: '#fff',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        minWidth: 40,
                        textAlign: 'center'
                      }}
                    >
                      {getMovieRank(index)}
                    </Box>
                  </Box>

                  <CardContent sx={{ pb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#7209b7',
                        mb: 2,
                        lineHeight: 1.3,
                        minHeight: '2.6em',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {movie.title}
                    </Typography>

                    {/* Genres */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {movie.genres.slice(0, 3).map((genre) => (
                        <Chip
                          key={genre}
                          label={genre}
                          size="small"
                          sx={{
                            background: 'linear-gradient(45deg, #f72585, #7209b7)',
                            color: '#fff',
                            fontSize: '0.7rem'
                          }}
                        />
                      ))}
                      {movie.genres.length > 3 && (
                        <Chip
                          label={`+${movie.genres.length - 3}`}
                          size="small"
                          sx={{
                            backgroundColor: '#e0e0e0',
                            fontSize: '0.7rem'
                          }}
                        />
                      )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Statistics */}
                    <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                      <Grid item xs={4}>
                        <Typography variant="h6" sx={{ color: '#5e60ce', fontWeight: 600, fontSize: '1rem' }}>
                          {movie.rating_count}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                          Ratings
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ color: '#ffa726', fontSize: '1rem' }} />
                          <Typography variant="h6" sx={{ color: '#5e60ce', fontWeight: 600, fontSize: '1rem' }}>
                            {movie.avg_rating?.toFixed(1)}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                          Avg Rating
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="h6" sx={{ color: '#5e60ce', fontWeight: 600, fontSize: '1rem' }}>
                          {movie.weighted_score?.toFixed(1)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                          Score
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </Box>
      )}

      {/* Empty State */}
      {!loading && movies.length === 0 && !error && (
        <Typography
          sx={{
            color: '#888',
            textAlign: 'center',
            fontSize: '1.1rem',
            py: 4
          }}
        >
          No popular movies found.
        </Typography>
      )}
    </Box>
  );
}

export default PopularMovies;
