import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const FilterButton = ({ onClick }) => {
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" onClick={onClick} 
      style={{
          backgroundColor: '#4da6ff',
          color: '#000',
          '&:hover': {
            backgroundColor: '#4da6ff', // Change this to the desired hover background color
          },
        }}
      >
        Filter Data
      </Button>
    </Stack>
  );
};

export default FilterButton;