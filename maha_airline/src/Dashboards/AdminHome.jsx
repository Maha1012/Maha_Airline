// AdminHome.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import Layout from './Layout';
import backgroundImage from 'C:/Users/mahalaxmi.ganesan/OneDrive - psiog.com/Desktop/Maha_Airline/maha_airline/pexels-jess-bailey-designs-1655985.jpg'; // Update the path

const AdminHome = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', // Full viewport height
    textAlign: 'center',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    margin: '0 auto',
    padding: '20px',
    color: '#fff', // Set text color to white
    backgroundImage: `url(${backgroundImage})`, // Set background image
    backgroundSize: 'cover', // Cover the entire container
    backgroundPosition: 'center', // Center the background image
  };

  const headingStyle = {
    fontFamily: 'Pacifico',
    fontSize: '3rem',
    fontWeight: 'bold', // Make it bold
    marginBottom: '20px',
    color: 'black', // Change the color to black
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#fff',
    margin: '10px',
    fontSize: '1.5rem',
  };

  const buttonStyle = {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    borderRadius: '8px',
    border: 0,
    color: 'white',
    height: '56px',
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, 0.3)',
  };

  const userHistoryButtonStyle = {
    textDecoration: 'none',
    color: '#fff',
    margin: '10px',
    fontSize: '1.5rem',
  };

  return (
    <Layout>
      <Box sx={containerStyle}>
        <Typography variant="h2" sx={headingStyle}>
          Welcome to Admin Dashboard
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
        {/* User History Button */}
        <Link to="/UserHistoryForAdmin" style={userHistoryButtonStyle}>
          <Button variant="contained" sx={buttonStyle}>
            User History
          </Button>
        </Link>
      </Box>
    </Layout>
  );
};

export default AdminHome;
