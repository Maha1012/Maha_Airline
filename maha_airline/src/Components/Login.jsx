import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { TextField, Button, Container, Grid, Typography, Link, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const loginData = {
      username: email,
      password: password,
    };
  
    try {
      const response = await fetch('https://localhost:7124/api/Authorization/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      console.log('Response status:', response.status); // Log the response status
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.role);
  
        // Check if the role is Admin
        if (data.role == 'Admin') {
          // Navigate to the FlightDetails page for Admin
          navigate('/AdminHome');
        } if (data.role == 'User') {
          // Navigate to the OverallDashboard for other roles
          navigate('/BookingForm');
        }
  
        // Store other user information in local storage
        sessionStorage.setItem('userId', data.userId);
        sessionStorage.setItem('username', email);
        sessionStorage.setItem('Token', data.token);
        sessionStorage.setItem('Role', data.role);

      } else {
        // Display an error message to the user
        toast.error('Login failed: Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };
  
  return (
    <Container component="main" maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px', width: '100%' }}>
        <Typography variant="h5" align="center" color="primary">
          Welcome to HealthCareStat
        </Typography>
        <form>
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            style={{ marginTop: '20px' }}
            onClick={handleLogin}
          >
            Login
          </Button>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Link component={RouterLink} to="/registration" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
            
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;