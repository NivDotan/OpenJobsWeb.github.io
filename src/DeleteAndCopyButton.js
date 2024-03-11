import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const DeleteButton = ({ onClick }) => {
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" onClick={onClick} style={{ backgroundColor: '#ffffff' }}>
        Delete Data
      </Button>
    </Stack>
  );
};

export default DeleteButton;