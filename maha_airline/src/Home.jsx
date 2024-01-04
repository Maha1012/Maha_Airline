import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { Person as PersonIcon, AssignmentInd as AssignmentIndIcon } from '@mui/icons-material';
import Slideshow from './Slideshow';
import ReactPlayer from 'react-player';
import backgroundVideo from 'C:/Users/mahalaxmi.ganesan/OneDrive - psiog.com/Desktop/Maha_Airline/maha_airline/pexels-vlada-karpovich-7429833 (Original)-jOEYYKIo-jOEYYKIo-jOEYYKIo-jOEYYKIo-jOEYYKIo-jOEYYKIo-jOEYYKIo.mp4';
const Home = ({ isAuthenticated }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    border: '1px solid #ccc',
    borderRadius: '10px',
    overflow: 'hidden', // Ensure the video doesn't overflow the container
    position: 'relative',
  };

  const videoStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Ensure the video covers the entire container
  };

  const textContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
    textAlign: 'center',
    color: 'black',
  };

  const headingStyle = {
    fontFamily: 'Helvetica-Bold',
    fontSize: '4rem',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    whiteSpace: 'nowrap',
  };

  const buttonStyle = {
    textDecoration: 'none',
    margin: '10px',
    fontSize: '1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '200px',
    color: 'inherit', // Use 'inherit' to maintain the inherited text color
    '&:hover': {
      color: '#888', // Set the color you want on hover (light grey in this case)
    },
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: 'black',
    border: '1px solid #fff',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: 'black',
    border: '1px solid #fff',
  };

  const iconStyle = {
    marginRight: '8px',
  };

  return (
    <>
      <style>
        {`
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: 'Helvetica, Arial, sans-serif'; // Change the font family as needed
          }
        `}
      </style>
      {/* Conditionally render the Slideshow component */}
      <Slideshow />

      <Box sx={containerStyle}>
        {/* Use ReactPlayer component to embed the video */}
        <ReactPlayer url={backgroundVideo} playing loop muted width="100%" height="100%" style={videoStyle} />

        {/* Text container on top of the video */}
        <Box sx={textContainerStyle}>
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
      </Box>
    </>
  );
};

export default Home;
