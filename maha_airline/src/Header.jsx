import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const navigate = useNavigate();
  const [apiHistoryVisible, setApiHistoryVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    console.log('Logging out...');
    // Clear the token and user information from session storage
    sessionStorage.removeItem('Token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
  
    // Redirect to the login page or any other route after logout
    navigate('/login');
  };
  const handleGoBack = () => {
    navigate(-1); // Navigate back using the navigate function
  };

  const handleToggleApiHistory = () => {
    setApiHistoryVisible(!apiHistoryVisible);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          {/* <IconButton color="inherit" edge="start" onClick={handleToggleApiHistory}>
            <MenuIcon />
          </IconButton> */}
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <IconButton color="inherit" size="large">
              <HomeIcon />
            </IconButton>
          </Link>
          <Typography variant="h6" style={{ flexGrow: 1, marginLeft: 10 }}>
            MahaAirline's
          </Typography>
          {localStorage.getItem('Token') ? (
            <>
              <Button
                color="inherit"
                aria-controls="user-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
              >
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  {localStorage.getItem('username')}
                </Typography>
              </Button>
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout} endIcon={<ExitToAppIcon />}>
                  Logout
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/ChangePassword"
                  onClick={handleMenuClose}
                >
                  Change Password
                </MenuItem>
              </Menu>
              <Button color="inherit" component={RouterLink} to="/ChangePassword">
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Change Password
                </Typography>
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                Logout
              </Typography>
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for displaying API history */}
    </>
  );
};

export default Header;