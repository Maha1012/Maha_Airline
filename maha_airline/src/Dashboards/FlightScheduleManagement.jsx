// FlightScheduleManagement.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from '@mui/material/Select';

import {
  Container,
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Autocomplete,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FlightScheduleManagement = () => {
  const [flightSchedules, setFlightSchedules] = useState([]);
  const [filteredFlightSchedules, setFilteredFlightSchedules] = useState([]);
  const [flightDetails, setFlightDetails] = useState([]);
  const [airports, setAirports] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    flightName: '',
    sourceAirportId: '',
    destinationAirportId: '',
    flightDuration: '',
    dateTime: '',
  });
  const [showFlightList, setShowFlightList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch flight schedules when the component mounts
    axios
      .get('https://localhost:7124/api/FlightSchedules')
      .then((response) => {
        setFlightSchedules(response.data);
        setFilteredFlightSchedules(response.data);
      })
      .catch((error) => console.error('Error fetching flight schedules:', error));

    // Fetch flight details when the component mounts
    axios
      .get('https://localhost:7124/GetFlightDetails')
      .then((response) => setFlightDetails(response.data))
      .catch((error) => console.error('Error fetching flight details:', error));

    // Fetch airports when the component mounts
    axios
      .get('https://localhost:7124/api/Airports')
      .then((response) => setAirports(response.data))
      .catch((error) => console.error('Error fetching airports:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule({ ...newSchedule, [name]: value });
  };

  const handleAirportChange = (name, selectedOption) => {
    // Extract airportId from the selected option
    const airportId = selectedOption ? selectedOption.airportId : '';

    // Update the corresponding state
    setNewSchedule({ ...newSchedule, [name]: airportId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Data to be sent:', newSchedule);

      // Extract the start date and time from the form data
      const startDate = new Date(newSchedule.dateTime);
      const startTime = startDate.getTime(); // Get time in milliseconds

      // Create flight schedules for each day in the next month
      const schedules = [];
      const numberOfDays = 30; // You can adjust this based on your needs

      for (let i = 0; i < numberOfDays; i++) {
        // Calculate the date for the current iteration
        const currentDate = new Date(startTime + i * 24 * 60 * 60 * 1000);

        // Create a new schedule with the current date
        const newScheduleEntry = {
          ...newSchedule,
          dateTime: currentDate.toISOString(), // Convert date to ISO string format
        };

        schedules.push(newScheduleEntry);
      }

      // Post multiple flight schedules
      const responses = await Promise.all(
        schedules.map((schedule) =>
          axios.post(
            'https://localhost:7124/api/FlightSchedules/CreateSchedule',
            schedule
          )
        )
      );

      console.log('Responses:', responses.map((response) => response.data));

      // Reset the form fields
      setNewSchedule({
        flightName: '',
        sourceAirportId: '',
        destinationAirportId: '',
        flightDuration: '',
        dateTime: '',
      });
    } catch (error) {
      console.error('Error posting new flight schedule:', error);
    }
  };

  const handleToggleFlightList = () => {
    setShowFlightList(!showFlightList);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = flightSchedules.filter(
      (schedule) =>
        schedule.flightName.toLowerCase().includes(term) ||
        schedule.flightDuration.toLowerCase().includes(term) ||
        new Date(schedule.dateTime).toLocaleString().toLowerCase().includes(term)
    );
    setFilteredFlightSchedules(filtered);
  };

  return (
    <Container component="main" maxWidth="md" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '8px' }}>
        <Typography variant="h4" gutterBottom>
          Flight Schedule Management
        </Typography>

        <div style={{ marginBottom: '20px' }}>
          <Accordion expanded={showFlightList} onChange={handleToggleFlightList}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Flight Schedule List</Typography>
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
                {showFlightList && (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Flight Name</TableCell>
                          <TableCell>Flight Duration</TableCell>
                          <TableCell>Date and Time</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredFlightSchedules.map((schedule) => (
                          <TableRow key={schedule.scheduleId}>
                            <TableCell>{schedule.flightName}</TableCell>
                            <TableCell>{schedule.flightDuration}</TableCell>
                            <TableCell>
                              {new Date(schedule.dateTime).toLocaleString()}
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

        <div>
          <Typography variant="h6" gutterBottom>
            Add New Flight Schedule
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <Select
              label="Flight Name"
              name="flightName"
              value={newSchedule.flightName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            >
              {flightDetails.map((flight) => (
                <MenuItem key={flight.flightName} value={flight.flightName}>
                  {flight.flightName} - Capacity: {flight.flightCapacity} -{' '}
                  {flight.isActive ? 'Active' : 'Inactive'}
                </MenuItem>
              ))}
            </Select>
            <Autocomplete
              options={airports}
              getOptionLabel={(option) => option.airportName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Source Airport Name"
                  name="sourceAirportId"
                  value={newSchedule.sourceAirportId}
                  onChange={(e) => handleInputChange(e)}
                  fullWidth
                  margin="normal"
                />
              )}
              onChange={(e, value) =>
                handleAirportChange('sourceAirportId', value)
              }
            />

            <Autocomplete
              options={airports}
              getOptionLabel={(option) => option.airportName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Destination Airport Name"
                  name="destinationAirportId"
                  value={newSchedule.destinationAirportId}
                  onChange={(e) => handleInputChange(e)}
                  fullWidth
                  margin="normal"
                />
              )}
              onChange={(e, value) =>
                handleAirportChange('destinationAirportId', value)
              }
            />
            <TextField
              label="Flight Duration"
              name="flightDuration"
              value={newSchedule.flightDuration}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date and Time"
              type="datetime-local"
              name="dateTime"
              value={newSchedule.dateTime}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '20px' }}
            >
              Add Flight Schedule
            </Button>
          </form>
        </div>
      </Paper>
    </Container>
  );
};

export default FlightScheduleManagement;
