import React, { useState } from 'react';
import { TextField, Button, Container, Grid, Typography, Paper, Link, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Import specific Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import axios from 'axios';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-yjt-nrmrBFFui5ltAunfTAoLkN_qNB4",
  authDomain: "fir-2d923.firebaseapp.com",
  //databaseURL: "https://fir-2d923-default-rtdb.firebaseio.com",
  projectId: "fir-2d923",
  storageBucket: "fir-2d923.appspot.com",
  messagingSenderId: "941681873815",
  appId: "1:941681873815:web:e5e4604e7a0fb01abfead2",
  measurementId: "G-CGWJY2PDV1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Registration = () => {
  const navigate = useNavigate();
  const [name, setname] = useState('');
  const [username, setusername] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [role, setrole] = useState('');

  const handleRegistration = async () => {
    const userData = {
      name,
      username,
      email,
      password,
      role: "User",
    };

    try {
      // 1. Register user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // 2. Send email verification
      await sendEmailVerification(user);
  
      // 3. Store user details in SSMS using your existing API
      const response = await axios.post('https://localhost:7124/api/Authorization/Registration', userData);
  
      console.log('Registration successful', response.data);
  
      // 4. Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  const handleGoBack = () => {
    navigate('/login');
  };

  
  return (
    <Container component="main" maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <IconButton color="primary" onClick={handleGoBack} style={{ marginBottom: 20 }}>
        <ArrowBackIcon />
      </IconButton>
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px', width: '100%' }}>
        <Typography variant="h5" align="center" color="primary">
          Welcome to HealthCareStat
        </Typography>
        <form>
          <TextField
            label="Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setname(e.target.value)}
            margin="normal"
            autoComplete="off"
          />
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            margin="normal"
            autoComplete="off"
          />
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            margin="normal"
            autoComplete="off"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            style={{ marginTop: '20px' }}
            onClick={handleRegistration}
          >
            Register
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link onClick={() => navigate('/login')} variant="body2">
                Already have an account? Sign In
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Registration;
