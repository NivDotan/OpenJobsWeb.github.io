import React from 'react';
import { Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)({
  backgroundColor: '#4da6ff',
  color: '#000',
  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
  border: 'none',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#3399ff',
    //color: '#fff',
  },
});

const ScraperListingsFilterButton = ({ onClick }) => {
  return (
    <Stack direction="row" spacing={2}>
      <CustomButton variant="contained" onClick={onClick}>
        Most Updated jobs
      </CustomButton>
    </Stack>
  );
};

export default ScraperListingsFilterButton;