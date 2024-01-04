// Footer.js

import React from 'react';
import { Typography, Container, IconButton } from '@mui/material';
import { Email, Instagram } from '@mui/icons-material';

const Footer = () => {
  const handleInstagramClick = () => {
    window.location.href = 'https://www.instagram.com/';
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:contact@example.com';
  };

  return (
    <footer style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#f0f0f0', padding: '5px' }}>
      <Container style={{ display: 'flex', alignItems: 'center' }}>
      <Typography
  variant="body2"
  color="textSecondary"
  style={{ marginLeft: 'auto', marginRight: '350px' }}
>
  © 2024 Maha Airline. All rights reserved.
</Typography>
        <div>
          <IconButton color="inherit" onClick={handleEmailClick}>
            <Email />
          </IconButton>
          <IconButton color="inherit" onClick={handleInstagramClick}>
            <Instagram />
          </IconButton>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
