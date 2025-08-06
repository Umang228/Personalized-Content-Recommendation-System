import React from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { motion } from 'framer-motion';

function MovieList({ recommendations, selectedUser }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 700,
          textAlign: 'center',
          color: '#FFF',
          textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
          fontSize: { xs: '1.25rem', sm: '1.75rem' },
        }}
      >
        {selectedUser ? `Recommendations for User ${selectedUser}` : 'Recommended Movies'}
      </Typography>
      {recommendations.length === 0 ? (
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
          Select a user to see recommendations.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(auto-fill, minmax(180px, 1fr))',
              sm: 'repeat(auto-fill, minmax(220px, 1fr))',
            },
            gap: { xs: 1.5, sm: 2 },
            pb: 2,
          }}
        >
          {recommendations.map((movie, index) => (
            <motion.div
              key={movie.movie_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <Card
                sx={{
                  bgcolor: 'rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)',
                  color: '#FFF',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                <Box
                  sx={{
                    height: { xs: '100px', sm: '120px' },
                    background: 'linear-gradient(135deg, #4B0082 0%, #1E90FF 50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography sx={{ opacity: 0.6, fontStyle: 'italic', fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                    Poster
                  </Typography>
                </Box>
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      fontSize: { xs: '0.9rem', sm: '1.1rem' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {movie.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {movie.genres.map(genre => (
                      <Chip
                        key={genre}
                        label={genre}
                        size="small"
                        sx={{
                          background: 'linear-gradient(45deg, #FF6F61, #DE1D1D)',
                          color: '#FFF',
                          fontSize: { xs: '0.7rem', sm: '0.8rem' },
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default MovieList;