import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { Person as PersonIcon, AssignmentInd as AssignmentIndIcon } from '@mui/icons-material';
import backgroundImg from 'C:/Users/mahalaxmi.ganesan/OneDrive - psiog.com/Desktop/Maha_Airline/maha_airline/homePage.jpg';

import Slideshow from './Slideshow'; // Import the Slideshow component

const Home = ({ isAuthenticated }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    margin: '0 auto',
    padding: '20px',
    backgroundImage: `url(${backgroundImg})`,  // Use backgroundImage property for the background image
    backgroundSize: 'cover',  // or 'contain' based on your preference
    backgroundPosition: 'center center',  // Adjust based on your preference
    color: '#fff',  // Set text color to white
    backdropFilter: 'blur(10px)',  // Adjust the blur value as needed
  };

  const headingStyle = {
    fontFamily: 'Helvetica-Bold',  // Change font family to a cursive or decorative style
    fontSize: '4rem',  // Increase font size
    marginBottom: '20px',  // Reduce margin for a more compact look
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',  // Add a subtle text shadow
  };

  const buttonStyle = {
    textDecoration: 'none',
    margin: '10px',
    fontSize: '1.5rem',
    borderRadius: '8px',  // Add border-radius for rounded corners
    cursor: 'pointer',
    //transition: 'background 0.3s ease',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',  // Change background color to white
    color: '#white',
    border: '1px solid #fff',  // Add a white border
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid #fff',  // Add a white border
  };

  const iconStyle = {
    marginRight: '8px',
  };

  return (
    <Container maxWidth="md">
      {/* Conditionally render the Slideshow component */}
      <Slideshow />

      <Box sx={containerStyle}>
        <Typography variant="h2" sx={headingStyle}>
          Welcome to MahaAirlines
        </Typography>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Button variant="contained" sx={primaryButtonStyle}>
            <PersonIcon sx={iconStyle} /> Login
          </Button>
        </Link>
        <Link to="/registration" style={{ textDecoration: 'none' }}>
          <Button variant="contained" sx={secondaryButtonStyle}>
            <AssignmentIndIcon sx={iconStyle} /> Register
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export default Home;
