// AirportManagement.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';

const AirportManagement = () => {
  const [airports, setAirports] = useState([]);
  const [newAirport, setNewAirport] = useState({
    airportId: '',
    airportName: '',
    city: '',
    state: '',
  });
  const [editingAirportId, setEditingAirportId] = useState(null);

  useEffect(() => {
    // Fetch airports when the component mounts
    axios.get('https://localhost:7124/api/Airports')
      .then(response => setAirports(response.data))
      .catch(error => console.error('Error fetching airports:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAirport({ ...newAirport, [name]: value });
  };

  const handleEditClick = (id) => {
    const airportToEdit = airports.find(airport => airport.airportId === id);
    setEditingAirportId(id);
    setNewAirport({ ...airportToEdit });
  };

  const handleCancelEdit = () => {
    setEditingAirportId(null);
    setNewAirport({
      airportId: '',
      airportName: '',
      city: '',
      state: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingAirportId) {
        // Update existing airport details
        await axios.put(`https://localhost:7124/api/Airports/${editingAirportId}`, newAirport);
      } else {
        // Post new airport details
        await axios.post('https://localhost:7124/api/Airports', newAirport);
      }

      // Refresh the airport list after posting/editing
      const response = await axios.get('https://localhost:7124/api/Airports');
      setAirports(response.data);

      // Reset the form fields
      setEditingAirportId(null);
      setNewAirport({
        airportId: '',
        airportName: '',
        city: '',
        state: '',
      });
    } catch (error) {
      console.error('Error posting/editing airport:', error);
    }
  };

  return (
    <Container component="main" maxWidth="md" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '8px' }}>
        <Typography variant="h4" gutterBottom>
          Airport Management
        </Typography>

        <div>
          <Typography variant="h6" gutterBottom>
            Airport List
          </Typography>
          <List>
            {airports.map(airport => (
              <ListItem key={airport.airportId}>
                {airport.airportId} - {airport.airportName}
                {airport.city} - {airport.city}
                {airport.state} - {airport.state}
                <Button onClick={() => handleEditClick(airport.airportId)} style={{ marginLeft: '10px' }}>
                  Edit
                </Button>
              </ListItem>
            ))}
          </List>
        </div>

        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6" gutterBottom>
            {editingAirportId ? 'Edit Airport' : 'Add New Airport'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Airport ID"
              type="text"
              name="airportId"
              value={newAirport.airportId}
              onChange={handleInputChange}
              disabled={editingAirportId !== null}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Airport Name"
              type="text"
              name="airportName"
              value={newAirport.airportName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="City"
              type="text"
              name="city"
              value={newAirport.city}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="State"
              type="text"
              name="state"
              value={newAirport.state}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            {/* Add other input fields if needed */}
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px', marginRight: '10px' }}>
              {editingAirportId ? 'Save Changes' : 'Add Airport'}
            </Button>
            {editingAirportId && (
              <Button type="button" onClick={handleCancelEdit} style={{ marginTop: '20px' }}>
                Cancel Edit
              </Button>
            )}
          </form>
        </div>
      </Paper>
    </Container>
  );
};

export default AirportManagement;
