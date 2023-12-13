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
import ApiHistoryDisplay from './ApiHistoryDisplay'; // Import the ApiHistoryDisplay component

const Header = () => {
  const navigate = useNavigate();
  const [apiHistoryVisible, setApiHistoryVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    // Clear the token and user information from local storage
    localStorage.removeItem('Token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');

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
          <IconButton color="inherit" edge="start" onClick={handleToggleApiHistory}>
            <MenuIcon />
          </IconButton>
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <IconButton color="inherit" size="large">
              <HomeIcon />
            </IconButton>
          </Link>
          <Typography variant="h6" style={{ flexGrow: 1, marginLeft: 10 }}>
            HealthCareStat
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
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: 'white' }}>
                <Button color="inherit">
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Login
                  </Typography>
                </Button>
              </Link>
              <Link to="/registration" style={{ textDecoration: 'none', color: 'white' }}>
                <Button color="inherit">
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Signup
                  </Typography>
                </Button>
              </Link>
            </>
          )}
      
        </Toolbar>
      </AppBar>

      {/* Drawer for displaying API history */}
      <Drawer anchor="left" open={apiHistoryVisible} onClose={handleToggleApiHistory}>
        <List>
          <ListItem>
            <ListItemText primary={<ApiHistoryDisplay />} />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Header;
