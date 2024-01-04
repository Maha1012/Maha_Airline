// AirportManagement.jsx

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const AirportManagement = () => {
  const [airports, setAirports] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [newAirport, setNewAirport] = useState({
    airportId: '',
    airportName: '',
    city: '',
    state: '',
  });
  const [editingAirportId, setEditingAirportId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAirportList, setShowAirportList] = useState(false);

  useEffect(() => {
    // Fetch airports when the component mounts
    axios
      .get('https://localhost:7124/api/Airports')
      .then((response) => {
        setAirports(response.data);
        setFilteredAirports(response.data);
      })
      .catch((error) => console.error('Error fetching airports:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAirport({ ...newAirport, [name]: value });
  };

  const handleEditClick = (id) => {
    const airportToEdit = airports.find((airport) => airport.airportId === id);
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
        await axios.put(
          `https://localhost:7124/api/Airports/${editingAirportId}`,
          newAirport
        );
      } else {
        // Post new airport details
        await axios.post('https://localhost:7124/api/Airports', newAirport);
      }

      // Refresh the airport list after posting/editing
      const response = await axios.get('https://localhost:7124/api/Airports');
      setAirports(response.data);
      setFilteredAirports(response.data);

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

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = airports.filter(
      (airport) =>
        airport.airportName.toLowerCase().includes(term) ||
        airport.city.toLowerCase().includes(term) ||
        airport.state.toLowerCase().includes(term)
    );
    setFilteredAirports(filtered);
  };

  const toggleAirportList = () => {
    setShowAirportList(!showAirportList);
  };

  return (
    <Container component="main" maxWidth="md" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '8px' }}>
        <Typography variant="h4" gutterBottom>
          Airport Management
        </Typography>

        <div style={{ marginBottom: '20px' }}>
          <Accordion expanded={showAirportList} onChange={toggleAirportList}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Airport List</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ width: '100%' }}>
                <TextField
                  label="Search"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {showAirportList && (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Airport Code</TableCell>
                          <TableCell>Airport Name</TableCell>
                          <TableCell>City</TableCell>
                          <TableCell>State</TableCell>
                          
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredAirports.map((airport) => (
                          <TableRow key={airport.airportId}>
                            <TableCell>{airport.airportId}</TableCell>
                            <TableCell>{airport.airportName}</TableCell>
                            <TableCell>{airport.city}</TableCell>
                            <TableCell>{airport.state}</TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleEditClick(airport.airportId)}
                              >
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </div>
            </AccordionDetails>
          </Accordion>
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '20px', marginRight: '10px' }}
            >
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
