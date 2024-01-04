// UserHomePage.js
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';
import backgroundImage from 'C:/Users/mahalaxmi.ganesan/OneDrive - psiog.com/Desktop/Maha_Airline/maha_airline/Userhomepage.jpg'; // Update the path


const UserHomePage = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  

  const handleUserHistory = () => {
    navigate('/userHistory');
  };

  const handleBookTicket = () => {
    navigate('/BookingForm');
  };

  const handleChangePassword = () => {
    navigate('/ChangePassword');
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setAnchorEl(null);
    console.log('User logged out');
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <AppBar position="static" style={{ backgroundColor: 'black', boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: 'white' }}>
            Maha's Airline
          </Typography>
          <IconButton color="inherit" onClick={handleMenuClick}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" style={{ textAlign: 'center', color: '#fff', marginBottom: '20px' }}>
        
          <Typography variant="h4" gutterBottom style={{ marginBottom: "300px" }}>
            Welcome to Maha's Airline
          </Typography>
          <Typography variant="body1" style={{ marginBottom: '20px' }}>
            Your gateway to exciting journeys and unforgettable adventures!
          </Typography>
          
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button variant="contained" color="primary" onClick={handleUserHistory}>
              User History
            </Button>
            <Button variant="contained" color="primary" onClick={handleBookTicket}>
              Book Ticket
            </Button>
          </div>
        
      </Container>
    </div>
  );
};

export default UserHomePage;
