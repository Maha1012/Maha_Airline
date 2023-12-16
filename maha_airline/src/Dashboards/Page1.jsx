import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';

const Page1 = () => {
  const [sourceCity, setSourceCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [date, setDate] = useState('');
  const [passengerCount, setPassengerCount] = useState(0);
  const [bookingType, setBookingType] = useState('');
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [sourceCities, setSourceCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [cookies, setCookie] = useCookies(['bookingData']);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch('https://localhost:7124/api/Airports');
      
      if (response.ok) {
        const data = await response.json();
        
        console.log('Airport Data:', data);

        // Extract city names from the response
        const sourceCitiesData = data.map((airport) => airport.city);

        console.log('Source Cities:', sourceCitiesData);

        setSourceCities(sourceCitiesData);
        setDestinationCities(sourceCitiesData); // You can set the same cities for both source and destination
      } else {
        console.error('Failed to fetch airports');
      }
    } catch (error) {
      console.error('Error fetching airports:', error);
    }
  };

  const fetchAirportId = async (city) => {
    try {
      const response = await fetch(
        `https://localhost:7124/api/Airports/GetAirportIdByCity?city=${city}`
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error(`Failed to fetch airport for city ${city}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching airport for city ${city}:`, error);
      return null;
    }
  };

  const handleSearch = async () => {
    const sourceAirportId = await fetchAirportId(sourceCity);
    const destinationAirportId = await fetchAirportId(destinationCity);

    console.log('Source Airport ID:', sourceAirportId);
    console.log('Destination Airport ID:', destinationAirportId);
    console.log('Date:', date);

    if (sourceAirportId && destinationAirportId && date) {
      setCookie('source', sourceCity);
      setCookie('destination', destinationCity);
      setCookie('date', date);
      setCookie('passengerCount', passengerCount);
      try {
        const formattedDate = new Date(date).toISOString();
        console.log('Formatted Date:', formattedDate);

        const response = await fetch(
          `https://localhost:7124/api/FlightSchedules/schedules?sourceCity=${sourceCity}&destinationCity=${destinationCity}&date=${formattedDate}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Flights:', data);
          if (data.data.length === 0) {
            navigate('/ConnectingFlightsPage');
            return;
          }

          setFlights(data.data);
        } else {
          console.error('Failed to fetch flights');
        }
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    }
  };

  const handleNext = () => {
    if (selectedFlight) {
      setCookie('bookingData', { ...selectedFlight, passengerCount, bookingType });
      navigate('/page2');
    } else {
      console.error('No flight selected');
    }
  };



  return (
    <div style={{ maxWidth: '400px', margin: 'auto', color: '#333' }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Start Searching for flights
      </Typography>
      <form>
        <FormControl fullWidth style={{ marginBottom: '10px' }}>
          <InputLabel>Source City</InputLabel>
          <Select
            value={sourceCity}
            onChange={(e) => setSourceCity(e.target.value)}
            label="Source City"
          >
            {sourceCities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: '10px' }}>
          <InputLabel>Destination City</InputLabel>
          <Select
            value={destinationCity}
            onChange={(e) => setDestinationCity(e.target.value)}
            label="Destination City"
          >
            {destinationCities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Date"
          type="date"
          variant="outlined"
          fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Passenger Count"
          type="number"
          variant="outlined"
          fullWidth
          value={passengerCount}
          onChange={(e) => setPassengerCount(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Booking Type"
          variant="outlined"
          fullWidth
          value={bookingType}
          onChange={(e) => setBookingType(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
          Search for Flights
        </Button>
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Select a Flight</Typography>
          <RadioGroup>
            {Array.isArray(flights) && flights.length > 0 ? (
              flights.map((data) => (
                <FormControlLabel
                  key={data.scheduleId}
                  value={data.scheduleId.toString()}
                  control={<Radio />}
                  label={`${data.flightName} - ${new Date(data.dateTime).toLocaleString()}`}
                  onChange={() => setSelectedFlight(data)}
                />
              ))
            ) : (
              <Typography variant="body2">No flights available</Typography>
            )}
          </RadioGroup>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          fullWidth
          style={{ marginTop: '20px' }}
        >
          Next
        </Button>
      </form>
    </div>
  );
};


export default Page1;
