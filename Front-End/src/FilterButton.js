import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const FilterButton = ({ onClick }) => {
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" onClick={onClick}>
        Filter Data
      </Button>
    </Stack>
  );
};

export default FilterButton;