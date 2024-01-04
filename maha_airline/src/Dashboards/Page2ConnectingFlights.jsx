import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import Layout from './Layout';

const Page2 = () => {
  const [cookies, setCookie] = useCookies(['passengerCount']);
  const navigate = useNavigate();
  const [passengerDetails, setPassengerDetails] = useState([]);

  useEffect(() => {
    const count = cookies.passengerCount || 0;
    const initialPassengerDetails = Array.from({ length: count }, (_, index) => ({
      name: '',
      age: '',
      gender: '',
    }));
    setPassengerDetails(initialPassengerDetails);
  }, [cookies.passengerCount]);

  const handleNext = () => {
    // Validate passenger details before proceeding
    if (passengerDetails.some((details) => !details.name || !details.age || !details.gender)) {
      console.error('Please fill in all passenger details');
      return;
    }

    // Fetch the existing booking data from the cookie
    const existingBookingData = cookies['bookingData'];

    // Update the passenger details
    const updatedPassengerDetails = passengerDetails.map((details) => ({
      name: details.name,
      age: details.age,
      gender: details.gender,
    }));

    // Merge the existing booking data with the updated passenger details
    const updatedBookingData = {
      ...existingBookingData,
      passengerDetails: updatedPassengerDetails,
    };

    // Update the cookie with the merged data
    setCookie('bookingData', updatedBookingData);

    // Redirect to Page3
    navigate('/page3');
  };

  return (
    <Layout>
    <Container component="main" maxWidth="md">
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>
          Enter Your Personal Details
        </Typography>
        <form>
          <Grid container spacing={2}>
            {passengerDetails.map((passenger, index) => (
              <Grid item xs={12} key={index}>
                <Typography variant="h6" color="primary">
                  Passenger {index + 1}
                </Typography>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id={`name${index}`}
                  label="Name"
                  name="name"
                  value={passenger.name}
                  onChange={(e) =>
                    setPassengerDetails((prev) =>
                      updateArray(prev, index, { ...prev[index], name: e.target.value })
                    )
                  }
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id={`age${index}`}
                  label="Age"
                  name="age"
                  type="number"
                  value={passenger.age}
                  onChange={(e) =>
                    setPassengerDetails((prev) =>
                      updateArray(prev, index, { ...prev[index], age: e.target.value })
                    )
                  }
                />
                <FormControl variant="outlined" fullWidth margin="normal" required>
                  <InputLabel id={`gender${index}-label`}>Gender</InputLabel>
                  <Select
                    labelId={`gender${index}-label`}
                    id={`gender${index}`}
                    label="Gender"
                    value={passenger.gender}
                    onChange={(e) =>
                      setPassengerDetails((prev) =>
                        updateArray(prev, index, { ...prev[index], gender: e.target.value })
                      )
                    }
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={handleNext}
            style={{ marginTop: 20 }}
          >
            Next
          </Button>
        </form>
      </Paper>
    </Container>
    </Layout>
  );
};

export default Page2;

// Helper function to update an element in an array
function updateArray(arr, index, newItem) {
  return arr.map((item, i) => (i === index ? newItem : item));
}
