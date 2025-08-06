import React from 'react';
import { Autocomplete, TextField, Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

function UserSelector({ users, onSelect, selectedUser, onLoadMore, hasMore }) {
  const selectedUserData = users.find(user => user.user_id === selectedUser);

  return (
    <Box sx={{ mb: 4, px: { xs: 1, sm: 0 } }}>
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
        Select a User
      </Typography>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Autocomplete
          options={users}
          getOptionLabel={(user) =>
            `User ${user.user_id} (${user.age}, ${user.gender}, ${user.occupation})`
          }
          onChange={(event, newValue) => onSelect(newValue ? newValue.user_id : null)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Users"
              variant="outlined"
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                '& .MuiOutlinedInput-root': {
                  color: '#FFF',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FF6F61' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FF6F61' },
                '& .MuiAutocomplete-option': { color: '#FFF' },
              }}
            />
          )}
          sx={{ maxWidth: { xs: '100%', sm: '600px' }, mx: 'auto' }}
          popupIcon={<Box component="span" sx={{ color: 'rgba(255,255,255,0.7)' }}>▼</Box>}
        />
      </motion.div>
      {selectedUserData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ mt: 2, textAlign: 'center' }}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Selected: User {selectedUserData.user_id} ({selectedUserData.age}, {selectedUserData.gender}, {selectedUserData.occupation})
          </Typography>
        </motion.div>
      )}
      {hasMore && (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="contained"
            onClick={onLoadMore}
            sx={{
              background: 'linear-gradient(45deg, #FF6F61, #DE1D1D)',
              color: '#FFF',
              fontWeight: 600,
              borderRadius: '8px',
              px: 3,
              py: 1,
              '&:hover': { background: 'linear-gradient(45deg, #FF8A80, #F44336)' },
            }}
          >
            Load More Users
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default UserSelector;