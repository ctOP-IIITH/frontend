import React from 'react';
import { Typography, Container } from '@mui/material';
import { APP_NAME } from '../constants';

function Home() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
        Welcome to {APP_NAME}
      </Typography>
    </Container>
  );
}
export default Home;
