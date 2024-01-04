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
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import Layout from './Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FlightCard = ({ flightData, selected, onChange }) => (
  <Card
    style={{
      cursor: 'pointer',
      border: selected ? '2px solid #3f51b5' : '2px solid transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',  // Center the content horizontally
      justifyContent: 'center',  // Center the content vertically
    }}
    onClick={() => onChange(flightData)}
  >
    <CardContent>
      <Typography variant="h6">{flightData.flightName}</Typography>
      <Typography variant="body2">
        {`Departure: ${new Date(flightData.dateTime).toLocaleString()}`}
      </Typography>
      <Typography variant="body2">
        {`Source: ${flightData.sourceAirportId} - Destination: ${flightData.destinationAirportId}`}
      </Typography>
    </CardContent>
  </Card>
);

const ReturnFlightCard = ({ returnData, selected, onChange }) => (
  <Card
    style={{
      cursor: 'pointer',
      border: selected ? '2px solid #3f51b5' : '2px solid transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',  // Center the content horizontally
      justifyContent: 'center',  // Center the content vertically
      marginLeft:'10px',
    }}
    onClick={() => onChange(returnData)}
  >
    <CardContent>
      <Typography variant="h6">{returnData.flightName}</Typography>
      <Typography variant="body2">
        {`Departure: ${new Date(returnData.dateTime).toLocaleString()}`}
      </Typography>
      <Typography variant="body2">
        {`Source: ${returnData.sourceAirportId} - Destination: ${returnData.destinationAirportId}`}
      </Typography>
    </CardContent>
  </Card>
);

const Roundtrip = () => {
  const [sourceCity, setSourceCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [date, setDate] = useState('');
  const [passengerCount, setPassengerCount] = useState(0);
  // const [bookingType, setBookingType] = useState('');
  const [returnData, setReturnDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [sourceCities, setSourceCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [cookies, setCookie] = useCookies(['bookingData']);
  const navigate = useNavigate();
  const navigateToPage2 = useNavigate();
  const [bookingType, setBookingType] = useState('roundtrip');
  const [flightsVisible, setFlightsVisible] = useState(false);
  const [returnFlightsVisible, setReturnFlightsVisible] = useState(false);

  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const accessToken = sessionStorage.getItem('Token'); // Replace with your actual key

    if (!accessToken) {
      console.error('Access token not found in session storage');
      return;
    }

    const response = await fetch('http://192.168.10.63:91/api/Airports', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        // You can add other headers if needed
      },
    });

      if (response.ok) {
        const data = await response.json();

        console.log('Airport Data:', data);

        const sourceCitiesData = data.map((airport) => airport.city);

        console.log('Source Cities:', sourceCitiesData);

        setSourceCities(sourceCitiesData);
        setDestinationCities(sourceCitiesData);
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
        `http://192.168.10.63:91/api/Airports/GetAirportIdByCity?city=${city}`
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

    if (passengerCount < 0 || passengerCount > 10) {
      console.error('Passenger count must be between 0 and 10');
      toast.error('Passenger count must be between 0 and 10.');
      return;
    }
    // Validate that the entered date is not in the past
    const currentDate = new Date();
    const selectedDate = new Date(date);

    if (selectedDate < currentDate) {
      console.error('Selected date is in the past');
      // Display a toast notification
      toast.error('Selected date is in the past.');
      return;
    }

    if (sourceAirportId && destinationAirportId && date) {
      setCookie('source', sourceAirportId);
      setCookie('destination', destinationAirportId);
      setCookie('date', date);
      setCookie('passengerCount', passengerCount);
      setCookie('returnDate', returnData);

      try {
        const formattedDate = new Date(date).toISOString();
        console.log('Formatted Date:', formattedDate);

        const token = sessionStorage.getItem('Token'); // Retrieve the token from sessionStorage

      const outboundFlightsPromise = fetch(
        `http://192.168.10.63:91/api/FlightSchedules/GetFlightsUsingId?sourceAirportId=${sourceAirportId.airportId}&DestinationAirportId=${destinationAirportId.airportId}&date=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            
          },
        }
      );

      const returnFlightsPromise = fetch(
        `http://192.168.10.63:91/api/FlightSchedules/GetFlightsUsingId?sourceAirportId=${destinationAirportId.airportId}&DestinationAirportId=${sourceAirportId.airportId}&date=${returnData}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );


        const [outboundResponse, returnResponse] = await Promise.all([
          outboundFlightsPromise,
          returnFlightsPromise,
        ]);

        if (outboundResponse.ok && returnResponse.ok) {
          const outboundData = await outboundResponse.json();
          const returnFlightsData = await returnResponse.json();

          console.log('Fetched Outbound Flights:', outboundData);
          console.log('Fetched Return Flights:', returnFlightsData);

          setFlights(outboundData.data);
          setReturnFlights(returnFlightsData.data);
        } else {
          console.error('Failed to fetch flights');
        }
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    }
  };

  const handleNext = async () => {
    if (selectedFlight && returnFlights.length > 0) {
    const outboundFlight = selectedFlight;
    const returnFlight = returnFlights[0]; // Assuming there is only one return flight

    setCookie('bookingData', {
      ...outboundFlight,
      returnFlight,
      passengerCount,
      bookingType,
    });

      const sourceAirportId = cookies.source;
      const destinationAirportId = cookies.destination;

      try {
        const token = sessionStorage.getItem('Token');
        const response = await fetch(
          `http://192.168.10.63:91/api/FlightSchedules/GetFlightsUsingId?sourceAirportId=${destinationAirportId.airportId}&DestinationAirportId=${sourceAirportId.airportId}&date=${returnData}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Return Flights:', data);
          //setCookie('bookingData', { ...selectedFlight, returnFlight: data.data[0], passengerCount, bookingType });
          // setCookie('bookingData', {  selectedFlight, passengerCount, bookingType });

          localStorage.setItem('scheduleId', selectedFlight.scheduleId);
          localStorage.setItem('newScheduleId', data.data[0].scheduleId);
          localStorage.setItem('airlineName', data.data[0].airlineName);
  
          setReturnFlights(data.data);
          navigateToPage2('/RoundTripPage2');
        } else {
          console.error('Failed to fetch return flights');
        }
      } catch (error) {
        console.error('Error fetching return flights:', error);
      }
    } else {
      console.error('No flight selected');
    }
  };

  return (
    <Layout>
      <Paper elevation={3} style={{ maxWidth: '600px', margin: 'auto', padding: '60px' }}>
        <Typography variant="h5" color="primary" gutterBottom>
          Find the Best Flights
        </Typography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>From</InputLabel>
                <Select
                  value={sourceCity}
                  onChange={(e) => setSourceCity(e.target.value)}
                  label="From"
                >
                  {sourceCities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>To</InputLabel>
                <Select
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  label="To"
                >
                  {destinationCities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
  <TextField
    label="Departure Date"
    type="date"
    variant="outlined"
    fullWidth
    InputLabelProps={{ shrink: true }}
    inputProps={{ style: { minWidth: '200px' } }}  // Adjust the minWidth as needed
    value={date}
    onChange={(e) => setDate(e.target.value)}
  />
</Grid>
<Grid item xs={12} sm={6}>
  <TextField
    label="Return Date"
    type="date"
    variant="outlined"
    fullWidth
    InputLabelProps={{ shrink: true }}
    inputProps={{ style: { minWidth: '200px' } }}  // Adjust the minWidth as needed
    value={returnData}
    onChange={(e) => setReturnDate(e.target.value)}
  />
</Grid>
            <Grid item xs={12}>
              <TextField
                label="Passenger Count"
                type="number"
                variant="outlined"
                fullWidth
                value={passengerCount}
                onChange={(e) => setPassengerCount(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
  variant="contained"
  color="primary"
  onClick={handleSearch}
  fullWidth
  style={{ marginTop: '20px',background:'black' }} // Add margin to the top
>
  Search for Flights
</Button>

<div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Select Your Flight</Typography>
          <Grid container spacing={2}justifyContent="center">
            {Array.isArray(flights) && flights.length > 0 ? (
              flights.map((data) => (
                <Grid item key={data.scheduleId} xs={12} sm={6} md={4}>
                  <FlightCard
                    flightData={data}
                    selected={selectedFlight === data}
                    onChange={(selected) => setSelectedFlight(selected)}
                  />
                </Grid>
              ))
            ) : (
              <Typography variant="body2">No flights available</Typography>
            )}
          </Grid>
        </div>

        {/* Display return flights */}
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Select Your Return Flight</Typography>
          <Grid container spacing={2}justifyContent="center">
            {Array.isArray(returnFlights) && returnFlights.length > 0 ? (
              returnFlights.map((returnData) => (
                <Grid item key={returnData.scheduleId} xs={12} sm={6} md={4}>
                  <ReturnFlightCard
                    returnData={returnData}
                    selected={selectedReturnFlight === returnData}
                    onChange={(selected) => setSelectedReturnFlight(selected)}
                  />
                </Grid>
              ))
            ) : (
              <Typography variant="body2" style={{ marginTop: '20px' }}>No return flights available</Typography>
            )}
          </Grid>
        </div>
          
          {/* <div style={{ marginTop: '20px' }}>
            <Typography variant="h6">Select a Flight</Typography>
            <RadioGroup>
            {Array.isArray(flights) && flights.length > 0 ? (
              flights.map((data) => (
                <FormControlLabel
                  key={data.scheduleId}
                  value={data.scheduleId.toString()}
                  control={<Radio />}
                  // label={`${data.flightName} - ${new Date(data.dateTime).toLocaleString()}`}
                  label={`${data.flightName} - ${new Date(data.dateTime).toLocaleString()} - Source: ${data.sourceAirportId} - Destination: ${data.destinationAirportId}`}
                  onChange={() => setSelectedFlight(data)}
                />
              ))
            ) : (
              <Typography variant="body2">No flights available</Typography>
            )}
          </RadioGroup>
        </div> */}
        {/* Display return flights */}
        {/* <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Select a Return Flight</Typography>
          <RadioGroup>
            {Array.isArray(returnFlights) && returnFlights.length > 0 ? (
              returnFlights.map((returnData) => (
                <FormControlLabel
                  key={returnData.scheduleId}
                  value={returnData.scheduleId.toString()}
                  control={<Radio />}
                  //label={`${returnData.flightName} - ${new Date(returnData.dateTime).toLocaleString()}`}
                  label={`${returnData.flightName} - ${new Date(returnData.dateTime).toLocaleString()} - Source: ${returnData.sourceAirportId} - Destination: ${returnData.destinationAirportId}`}
                  onChange={() => console.log('Return flight selected:', returnData)}
                />
              ))
            ) : (
              <Typography variant="body2">No return flights available</Typography>
            )}
          </RadioGroup>
        </div> */}
        <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            fullWidth
            style={{ marginTop: '20px',background:'black' }}
          >
            Next
          </Button>
        </form>
        <ToastContainer/>
        {/* <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Select a Flight</Typography>
          <Grid container spacing={2}>
            {Array.isArray(flights) && flights.length > 0 ? (
              flights.map((data) => (
                <Grid item key={data.scheduleId} xs={12} sm={6} md={4}>
                  <Card
                    style={{ cursor: 'pointer', border: selectedFlight === data ? '2px solid #3f51b5' : '2px solid transparent' }}
                    onClick={() => setSelectedFlight(data)}
                  >
                    <CardContent>
                      <Typography variant="h6">{data.flightName}</Typography>
                      <Typography variant="body2">
                        {`Departure: ${new Date(data.dateTime).toLocaleString()}`}
                      </Typography>
                      <Typography variant="body2">
                        {`Source: ${data.sourceAirportId} - Destination: ${data.destinationAirportId}`}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body2">No flights available</Typography>
            )}
          </Grid>
        </div> */}

        {/* Display return flights */}
        {/* <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Select a Return Flight</Typography>
          <Grid container spacing={2}>
            {Array.isArray(returnFlights) && returnFlights.length > 0 ? (
              returnFlights.map((returnData) => (
                <Grid item key={returnData.scheduleId} xs={12} sm={6} md={4}>
                  <Card
                    style={{ cursor: 'pointer', border: '2px solid transparent' }}
                    onClick={() => console.log('Return flight selected:', returnData)}
                  >
                    <CardContent>
                      <Typography variant="h6">{returnData.flightName}</Typography>
                      <Typography variant="body2">
                        {`Departure: ${new Date(returnData.dateTime).toLocaleString()}`}
                      </Typography>
                      <Typography variant="body2">
                        {`Source: ${returnData.sourceAirportId} - Destination: ${returnData.destinationAirportId}`}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body2">No return flights available</Typography>
            )}
          </Grid>
        </div> */}

        {/* <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          fullWidth
          style={{ marginTop: '20px', background: 'black' }}
        >
          Next
        </Button> */}
      </Paper>
    </Layout>
  );
};

export default Roundtrip;



