import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { TextField, Button, Container, Grid, Typography, Link, Paper, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true); 
    const loginData = {
      username: email,
      password: password,
    };

    try {
      const response = await fetch('http://192.168.10.63:91/api/Authorization/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
  console.log('Response data:', data);

      if (data.statusCode == 1) {
        // const data = await response.json();
        console.log(data.role);

        if (data.role == 'Admin') {
          navigate('/AdminHome');
        } else if (data.role == 'User') {
          navigate('/UserHomePage');
        }

        sessionStorage.setItem('userId', data.userId);
        sessionStorage.setItem('username', email);
        sessionStorage.setItem('Token', data.token);
        sessionStorage.setItem('Role', data.role);
        sessionStorage.setItem('userEmail', data.userEmail);

        toast.success('Login successful!');
      } else {
        toast.error('Login failed: Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
    finally {
      setLoading(false); // Set loading to false when login process completes
    }
  };

  

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <Container component="main" maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' ,padding: '60px'}}>
      <IconButton color="primary" onClick={handleGoBack} style={{ marginBottom: 20 }}>
        <ArrowBackIcon />
      </IconButton>
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px', width: '100%', textAlign: 'center' }}>
        <FlightTakeoffIcon style={{ fontSize: 50, color: 'black' }} />
        <Typography variant="h5" align="center" color="black" style={{ marginBottom: '20px' }}>
          Welcome to MahaAirline's
        </Typography>
        <form>
          <TextField
            label="Username"
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
  style={{
    marginTop: '20px',
    backgroundColor: 'black',
    '&:hover': {
      backgroundColor: 'black', // Change to the desired color on hover
    },
  }}
  onClick={handleLogin}
>
  Let's Fly!
</Button>

<Grid container justifyContent="flex-end" style={{ marginTop: '20px' }}>
  <Grid item>
    <Button
      component={RouterLink}
      to="/registration"
      variant="contained"
      color="primary"
      style={{
        background: 'transparent',
        border: '1px solid #000',
        color: '#000', // Text color
        borderRadius: '10px', // Adjust as needed
      }}
    >
      Sign Up
    </Button>
  </Grid>
</Grid>


        </form>
      </Paper>
    </Container>
  );
};

export default Login;
