import React from 'react';
import { Autocomplete, TextField, Box, Typography, Button, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

function UserSelector({ users, onSelect, selectedUser, onLoadMore, hasMore }) {
  const selectedUserData = users.find(user => user.user_id === selectedUser);

  return (
    <Card
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        bgcolor: '#fff',
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: '#5e60ce', mb: 2 }}
        >
          Select a User
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: '#666', mb: 2, maxWidth: 500 }}
        >
          Choose a user to view their personalized movie recommendations based on their profile and preferences.
        </Typography>
        <Autocomplete
          fullWidth
          options={users}
          getOptionLabel={(user) => `User ${user.user_id} (${user.age}, ${user.gender}, ${user.occupation})`}
          onChange={(e, val) => onSelect(val?.user_id || null)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Users"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#f9f9f9',
                },
              }}
            />
          )}
          sx={{ maxWidth: 500, mb: 2 }}
        />
        {selectedUserData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Typography
              sx={{
                fontSize: '0.95rem',
                color: '#444',
                bgcolor: '#f0f0f0',
                p: 1,
                borderRadius: 1,
              }}
            >
              Selected: User {selectedUserData.user_id} ({selectedUserData.age}, {selectedUserData.gender}, {selectedUserData.occupation})
            </Typography>
          </motion.div>
        )}
        {hasMore && (
          <Box mt={2}>
            <Button
              onClick={onLoadMore}
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #f72585, #7209b7)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(45deg, #e71d73, #5e0a9a)',
                },
              }}
            >
              Load More Users
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default UserSelector;