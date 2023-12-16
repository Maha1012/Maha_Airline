// AdminHome.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import Layout from './Layout';

const AdminHome = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80vh',  // Adjusted height
    textAlign: 'center',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f0f0f0',  // Light gray background
    color: '#333',  // Dark text color
  };

  const headingStyle = {
    fontFamily: 'Pacifico',  // Fun and playful font
    fontSize: '3rem',  // Slightly smaller font size
    marginBottom: '20px',
    color: '#4285f4',  // Google Blue color
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#fff',
    margin: '10px',
    fontSize: '1.5rem',
  };

  const buttonStyle = {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',  // Gradient background
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Box sx={containerStyle}>
          <Typography variant="h2" sx={headingStyle}>
            Admin Home
          </Typography>
          <Link to="/FlightDetails" style={linkStyle}>
            <Button variant="contained" sx={buttonStyle}>
              Flight Details
            </Button>
          </Link>
          <Link to="/AirportManagement" style={linkStyle}>
            <Button variant="contained" sx={buttonStyle}>
              Airport Management
            </Button>
          </Link>
          <Link to="/FlightScheduleManagement" style={linkStyle}>
            <Button variant="contained" sx={buttonStyle}>
              Flight Schedule Management
            </Button>
          </Link>
        </Box>
      </Container>
    </Layout>
  );
};

export default AdminHome;
