import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { AccountCircle, ArrowBackIos, Flight, Mail, Info } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showBackToBookingButton, setShowBackToBookingButton] = useState(false);

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
    // Clear session storage
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Clear local storage
    localStorage.clear();

    setAnchorEl(null);
    navigate('/login');
    console.log('User logged out');
  };

  const handleGoBack = () => {
    navigate(-1); // Go back one step in the navigation stack
  };

  useEffect(() => {
    // Determine if the scroll button should be shown based on the current location
    setShowScrollButton(location.pathname === '/UserHomePage');

    // Determine if the "Back to Booking" button should be shown based on the current location
    setShowBackToBookingButton(location.pathname === '/UserHistory');
  }, [location.pathname]);

  const handleBackToBooking = () => {
    navigate('/UserHomePage');
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
          {showScrollButton && (
            <ScrollLink
              activeClass="active"
              to="bookTicketSection"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              <IconButton color="inherit">
                <Flight style={{ fontSize: 24 }} />
              </IconButton>
            </ScrollLink>
          )}
          {showBackToBookingButton && (
  <Typography variant="body1" style={{ color: 'white', cursor: 'pointer' }} onClick={handleBackToBooking}>
    Back to Booking
  </Typography>
)}

          {showScrollButton && (
            <ScrollLink
              activeClass="active"
              to="aboutUsSection"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              <IconButton color="inherit">
                <Info style={{ fontSize: 24 }} />
              </IconButton>
            </ScrollLink>
          )}
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

export default Header;
