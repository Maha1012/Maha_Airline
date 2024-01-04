import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { AccountCircle, ArrowBackIos, Cookie } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TopHeader = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChangePassword = () => {
    navigate('/ChangePassword');
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // const handleLogout = () => {
  //   sessionStorage.clear();
  //   Cookie.clear();
  //   localStorage.clear();
  //   setAnchorEl(null);
  //   navigate('/login');
  //   console.log('User logged out');
  // };

  const handleLogout = () => {
    // Clear cookies
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
    });
  
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
  
    // Close the menu and navigate
    setAnchorEl(null);
    // Show toast notification
    toast.success('User logged out', {
      position: 'top-right',
      autoClose: 3000, // 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Navigate to login page
    navigate('/login');
  };

  const handleGoBack = () => {
    // Check if seatDetails array is present in the bookingData cookie
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const bookingDataCookie = cookies.find(cookie => cookie.startsWith('bookingData='));
  
    if (bookingDataCookie) {
      try {
        const decodedBookingData = decodeURIComponent(bookingDataCookie.split('=')[1]);
        const bookingData = JSON.parse(decodedBookingData) || {};
        console.log("inside this");
  
        // Remove the seatDetails array from the bookingData cookie
        delete bookingData.seatDetails;
  
        // Update the cookie with the modified bookingData
        document.cookie = `bookingData=${encodeURIComponent(JSON.stringify(bookingData))}; path=/`;
  
        console.log("this has happened");
      } catch (error) {
        console.error('Error parsing JSON from the cookie:', error);
      }
    }
  
    navigate(-1); // Go back one step in the navigation stack
  };
  
  

  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: 'black', boxShadow: 'none' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleGoBack}>
            <ArrowBackIos style={{ color: 'white', fontSize: 24 }} />
          </IconButton>
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
    </div>
  );
};

export default TopHeader;
