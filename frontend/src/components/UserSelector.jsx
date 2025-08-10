import React from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Button,
  Card,
  CardContent
} from '@mui/material';
import { motion } from 'framer-motion';

function UserSelector({ users, onSelect, selectedUser, onLoadMore, hasMore }) {
  const selectedUserData = users.find(user => user.user_id === selectedUser);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          bgcolor: '#fff',
          border: '1px solid #f0f0f0'
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#5e60ce',
              mb: 1.5
            }}
          >
            Select a User
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              mb: 2.5,
              maxWidth: 520,
              lineHeight: 1.5
            }}
          >
            Choose a user to view their personalized movie recommendations based on their profile
            and preferences.
          </Typography>

          {/* Search Autocomplete */}
          <Autocomplete
            fullWidth
            options={users}
            getOptionLabel={(user) =>
              `User ${user.user_id} (${user.age}, ${user.gender}, ${user.occupation})`
            }
            onChange={(e, val) => onSelect(val?.user_id || null)}
            value={users.find(u => u.user_id === selectedUser) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Users"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f9f9f9',
                  }
                }}
              />
            )}
            sx={{ maxWidth: 500, mb: 2 }}
          />

          {/* Selected User Info */}
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
                  bgcolor: '#f8f8f8',
                  p: 1,
                  borderRadius: 1.5,
                  border: '1px solid #e0e0e0',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                Selected: <strong>User {selectedUserData.user_id}</strong> ({selectedUserData.age},{' '}
                {selectedUserData.gender}, {selectedUserData.occupation})
              </Typography>
            </motion.div>
          )}

          {/* Load More Button */}
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
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #e71d73, #5e0a9a)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                  }
                }}
              >
                Load More Users
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default UserSelector;
