import React, { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Tabs, Tab, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import UserSelector from './components/UserSelector';
import MovieList from './components/MovieList';
import ClusterDisplay from './components/ClusterDisplay';

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
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
      });
    
    fetch('http://127.0.0.1:5000/api/clusters')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch clusters');
        return response.json();
      })
      .then(data => setClusters(data))
      .catch(error => {
        console.error('Error fetching clusters:', error);
        setError('Failed to load clusters. Please try again later.');
      });
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetch(`http://127.0.0.1:5000/api/recommend/${selectedUser}`)
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch recommendations');
          return response.json();
        })
        .then(data => setRecommendations(data))
        .catch(error => {
          console.error('Error fetching recommendations:', error);
          setError('Failed to load recommendations. Please try again later.');
        });
    } else {
      setRecommendations([]);
    }
  }, [selectedUser]);

  const paginatedUsers = users.slice(0, page * usersPerPage);

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', boxSizing: 'border-box' }}>
      <AppBar
        position="sticky"
        sx={{
          background: 'linear-gradient(90deg, rgba(75,0,130,0.9) 0%, rgba(30,144,255,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '1.5rem', sm: '2rem' },
            }}
          >
            MovieLens Explorer
          </Typography>
        </Toolbar>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          centered
          sx={{
            bgcolor: 'transparent',
            '& .MuiTab-root': {
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 500,
              fontSize: { xs: '0.9rem', sm: '1rem' },
            },
            '& .Mui-selected': {
              color: '#FF6F61',
              fontWeight: 700,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#FF6F61',
            },
          }}
        >
          <Tab label="Recommendations" />
          <Tab label="User Clusters" />
        </Tabs>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {tab === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <UserSelector
              users={paginatedUsers}
              onSelect={setSelectedUser}
              selectedUser={selectedUser}
              onLoadMore={() => setPage(page + 1)}
              hasMore={page * usersPerPage < users.length}
            />
            <MovieList recommendations={recommendations} selectedUser={selectedUser} />
          </motion.div>
        )}
        {tab === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ClusterDisplay clusters={clusters} />
          </motion.div>
        )}
      </Container>
    </Box>
  );
}

export default App;