import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { Person as PersonIcon, AssignmentInd as AssignmentIndIcon } from '@mui/icons-material';
import backgroundImg from "C:/Users/mahalaxmi.ganesan/source/repos/WebApplication1/medical-banner-with-doctor-wearing-coat.jpg";
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
    color: '#000',
    backdropFilter: 'blur(10px)',  // Adjust the blur value as needed
  };

  const headingStyle = {
    fontFamily: 'Roboto',
    fontSize: '3.5rem',
    marginBottom: '300px',
  };

  const buttonStyle = {
    textDecoration: 'none',
    color: '#fff',
    margin: '10px',
    //padding: '15px 30px',
    fontSize: '1.5rem',
    //borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#000'
    
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#000'
    
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
          Welcome to HealthCareStat
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
