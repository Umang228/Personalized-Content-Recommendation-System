import React from 'react';
import { Box, Typography, Card, CardContent, Chip, LinearProgress, IconButton, Tooltip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
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
  SciFi: ['#43cea2', '#185a9d'],
  Thriller: ['#4568DC', '#B06AB3'],
  default: ['#5e60ce', '#4361ee']
};

function MovieList({ recommendations, selectedUser }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 700,
          textAlign: 'center',
          color: '#5e60ce',
          textShadow: '1px 1px 3px rgba(94,96,206,0.08)',
        }}
      >
        {selectedUser ? `Recommendations for User ${selectedUser}` : 'Recommended Movies'}
      </Typography>

      {recommendations.length === 0 ? (
        <Typography
          sx={{
            color: '#888',
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1.15rem' },
          }}
        >
          {selectedUser
            ? 'No recommendations found for this user.'
            : 'Select a user to see recommendations.'}
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(auto-fill, minmax(200px, 1fr))',
              sm: 'repeat(auto-fill, minmax(240px, 1fr))',
            },
            gap: { xs: 2, sm: 3 },
          }}
        >
          {recommendations.map((movie, index) => {
            const mainGenre = movie.genres[0] || 'default';
            const colors = genreColors[mainGenre] || genreColors.default;
            return (
              <motion.div
                key={movie.movie_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  {/* Gradient genre banner with optional IMDb link */}
                  <Box
                    sx={{
                      background: `linear-gradient(45deg, ${colors}, ${colors})`,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 2,
                      py: 1.2
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {mainGenre}
                    </Typography>
                    {movie.imdb_url && (
                      <Tooltip title="View on IMDb">
                        <IconButton
                          size="small"
                          href={movie.imdb_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: '#fff' }}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#7209b7',
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {movie.title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {movie.genres.map((genre) => (
                        <Chip
                          key={genre}
                          label={genre}
                          size="small"
                          sx={{
                            background: 'linear-gradient(45deg, #f72585, #7209b7)',
                            color: '#fff',
                            fontSize: '0.75rem'
                          }}
                        />
                      ))}
                    </Box>
                    {/* Example predicted score if available */}
                    {movie.score && (
                      <>
                        <Typography variant="caption" color="text.secondary">
                          Match Score: {(movie.score * 100).toFixed(1)}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={movie.score * 100}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            mt: 0.5,
                            backgroundColor: '#eee',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(45deg, #5e60ce, #4361ee)',
                            },
                          }}
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

export default MovieList;
