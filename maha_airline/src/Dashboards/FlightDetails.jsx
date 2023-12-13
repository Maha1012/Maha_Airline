import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Select,
  MenuItem,
} from '@mui/material';

const FlightManagement = () => {
  const [flightDetails, setFlightDetails] = useState([]);
  const [newFlight, setNewFlight] = useState({
    flightCapacity: 0,
    isActive: false,
  });
  const [flightToUpdate, setFlightToUpdate] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    // Fetch flight details when the component mounts
    axios
      .get('https://localhost:7124/api/FlightDetail')
      .then((response) => setFlightDetails(response.data))
      .catch((error) => console.error('Error fetching flight details:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlight({ ...newFlight, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Post new flight details
      await axios.post(
        'https://localhost:7124/api/FlightDetail/PostFlightDetails',
        newFlight
      );

      // Refresh the flight details after posting
      const response = await axios.get(
        'https://localhost:7124/api/FlightDetail'
      );
      setFlightDetails(response.data);

      // Reset the form fields
      setNewFlight({
        flightCapacity: 0,
        isActive: false,
      });
    } catch (error) {
      console.error('Error posting new flight:', error);
    }
  };

  const handleUpdateFormToggle = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  const handleUpdate = async () => {
    try {
      // Put updated flight details
      await axios.put(
        `https://localhost:7124/api/FlightDetail/${flightToUpdate}`,
        newFlight
      );

      // Refresh the flight details after updating
      const response = await axios.get(
        'https://localhost:7124/api/FlightDetail'
      );
      setFlightDetails(response.data);

      // Reset the form fields
      setNewFlight({
        flightCapacity: 0,
        isActive: false,
      });

      // Hide the update form
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Error updating flight:', error);
    }
  };

  const handleEditClick = (flight) => {
    // Set the flight to update and populate the form fields
    setFlightToUpdate(flight.flightName);
    setNewFlight({
      flightCapacity: flight.flightCapacity,
      isActive: flight.isActive,
    });

    // Show the update form
    setShowUpdateForm(true);
  };

  return (
    <Container component="main" maxWidth="md" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '8px' }}>
        <Typography variant="h4" gutterBottom>
          Flight Management
        </Typography>

        <div style={{ marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Flight List
          </Typography>
          <List>
            {flightDetails.map((flight) => (
              <ListItem key={flight.flightName}>
                {flight.flightName} - {flight.flightCapacity} -{' '}
                {flight.isActive ? 'Active' : 'Inactive'}
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ marginLeft: '10px' }}
                  onClick={() => handleEditClick(flight)}
                >
                  Edit
                </Button>
              </ListItem>
            ))}
          </List>
        </div>

        <div>
          <Typography variant="h6" gutterBottom>
            Add New Flight
          </Typography>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              label="Flight Capacity"
              type="number"
              name="flightCapacity"
              value={newFlight.flightCapacity}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="isActive"
                  checked={newFlight.isActive}
                  onChange={() =>
                    setNewFlight({ ...newFlight, isActive: !newFlight.isActive })
                  }
                />
              }
              label="Is Active"
              style={{ marginBottom: '10px' }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '20px' }}
            >
              Add Flight
            </Button>
          </form>
        </div>

        <div>
          <Button
            variant="contained"
            color="primary"
            style={{
              marginTop: '20px',
            }}
            onClick={handleUpdateFormToggle}
          >
            Update Form
          </Button>

          {showUpdateForm && (
            <div>
              <Typography variant="h6" gutterBottom>
                Update Flight
              </Typography>
              <form style={{ display: 'flex', flexDirection: 'column' }}>
                <Select
                  label="Flight to Update"
                  value={flightToUpdate}
                  onChange={(e) => setFlightToUpdate(e.target.value)}
                  fullWidth
                  margin="normal"
                >
                  {flightDetails.map((flight) => (
                    <MenuItem key={flight.flightName} value={flight.flightName}>
                      {flight.flightName}
                    </MenuItem>
                  ))}
                </Select>
                {/* Add fields for updating flight details (e.g., flight capacity, isActive) */}
                <TextField
                  label="New Flight Capacity"
                  type="number"
                  name="flightCapacity"
                  value={newFlight.flightCapacity}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isActive"
                      checked={newFlight.isActive}
                      onChange={() =>
                        setNewFlight({ ...newFlight, isActive: !newFlight.isActive })
                      }
                    />
                  }
                  label="Is Active"
                  style={{ marginBottom: '10px' }}
                />
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px' }}
                  onClick={handleUpdate}
                >
                  Update Flight
                </Button>
              </form>
            </div>
          )}
        </div>
      </Paper>
    </Container>
  );
};

export default FlightManagement;
