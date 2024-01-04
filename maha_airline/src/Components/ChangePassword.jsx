import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ChangePassword = () => {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const navigate = useNavigate();
  

  const handleChangePassword = async () => {
    const changePasswordData = {
      username,
      currentPassword,
      newPassword,
      confirmNewPassword,
    };

    try {
      const response = await fetch('https://localhost:7124/api/Authorization/ChangePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changePasswordData),
      });

      console.log('Change Password Response Status:', response.status);

      if (response.status === 200) {
        // Password change successful, you can handle the response here
        console.log('Password change successful');
        // Redirect to the login page or any other route after password change
        navigate('/login');
      } else {
        // Display an error message to the user
        alert('Password change failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Password change failed', error);
    }
  };

  
  const handleGoBack = () => {
    navigate(-1); // Navigate back using the navigate function
  };

  return (
    <Container component="main" maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px', width: '100%' }}>
        <Typography variant="h5" align="center" color="primary">
          Change Password
        </Typography>
        <form>
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            style={{ marginTop: '20px' }}
            onClick={handleChangePassword}
          >
            Change Password
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ChangePassword;
