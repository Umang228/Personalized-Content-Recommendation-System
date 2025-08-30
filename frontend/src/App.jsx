import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Tabs, Tab, Container, Alert, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import UserSelector from './components/UserSelector';
import MovieList from './components/MovieList';
import ClusterDisplay from './components/ClusterDisplay';
import PopularMovies from './components/PopularMovies';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState(null);
  const usersPerPage = 20;

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setError('Failed to load users.'));

    fetch('http://127.0.0.1:5000/api/clusters')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setClusters)
      .catch(() => setError('Failed to load clusters.'));
  }, []);

  useEffect(() => {
    if (!selectedUser) return setRecommendations([]);
    fetch(`http://127.0.0.1:5000/api/recommend/${selectedUser}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setRecommendations)
      .catch(() => setError('Failed to load recommendations.'));
  }, [selectedUser]);

  const paginatedUsers = users.slice(0, page * usersPerPage);

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', bgcolor: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      {/* Enhanced AppBar */}
      <AppBar
        position="sticky"
        sx={{
          background: 'linear-gradient(to right, #5e60ce, #4361ee)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Toolbar sx={{ flexWrap: 'wrap', py: 1 }}>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: 1,
              color: '#fff',
            }}
          >
            🎬 MovieLens Explorer
          </Typography>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            textColor="inherit"
            TabIndicatorProps={{ style: { backgroundColor: '#f72585', height: 3 } }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '1rem',
                px: 3,
                '&:hover': {
                  color: '#f72585',
                  transition: 'color 0.3s ease',
                },
              },
            }}
          >
            <Tab label="Recommendations" />
            <Tab label="Popular Movies" />
            <Tab label="Clusters" />
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, textAlign: { xs: 'center', md: 'left' } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#5e60ce',
              mb: 2,
              letterSpacing: -1,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            Discover Your Next Favorite Movie
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#444',
              mb: 4,
              maxWidth: 700,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              lineHeight: 1.6,
            }}
          >
            MovieLens Explorer uses advanced algorithms to provide personalized movie recommendations and insightful user clusters. Select a user to explore tailored movie suggestions or dive into patterns of viewer preferences.
          </Typography>
        </motion.div>
      </Container>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, pb: 6 }}>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          </motion.div>
        )}

        {tab === 0 && (
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              p: { xs: 2, sm: 3 },
              mb: 4,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#7209b7',
                  mb: 2,
                }}
              >
                Personalized Recommendations
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  mb: 3,
                  maxWidth: 600,
                }}
              >
                Choose a user to view movie recommendations tailored to their preferences, based on age, gender, and occupation.
              </Typography>
              <UserSelector
                users={paginatedUsers}
                onSelect={setSelectedUser}
                selectedUser={selectedUser}
                onLoadMore={() => setPage(p => p + 1)}
                hasMore={page * usersPerPage < users.length}
              />
              <MovieList recommendations={recommendations} selectedUser={selectedUser} />
            </motion.div>
          </Box>
        )}

        {tab === 1 && (
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              p: { xs: 2, sm: 3 },
              mb: 4,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PopularMovies />
            </motion.div>
          </Box>
        )}

        {tab === 2 && (
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              p: { xs: 2, sm: 3 },
              mb: 4,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#7209b7',
                  mb: 2,
                }}
              >
                User Clusters
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  mb: 3,
                  maxWidth: 600,
                }}
              >
                Explore groups of users with similar movie tastes, visualized through advanced clustering techniques. Discover patterns in viewer preferences!
              </Typography>
              <ClusterDisplay clusters={clusters} />
            </motion.div>
          </Box>
        )}
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: '#5e60ce',
          color: '#fff',
          py: 3,
          mt: 'auto',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            © 2025 MovieLens Explorer | Powered by AI-driven insights
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Built to help you find movies you love and understand viewer trends.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default App;