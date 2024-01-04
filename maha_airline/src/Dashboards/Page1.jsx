import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { airlinesapi, mahaairline } from '../constants';
import Layout from './Layout';


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
  Box,
  Card,
  CardContent,
} from '@mui/material';
import axios from 'axios';

const Page1 = () => {
  const [sourceCity, setSourceCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [date, setDate] = useState('');
  const [passengerCount, setPassengerCount] = useState(0);
  //const [bookingType, setBookingType] = useState('');
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [sourceCities, setSourceCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [cookies, setCookie] = useCookies(['bookingData']);
  const [finalIntegratedConnectingFlights,setFinalIntegratedConnectingFlights] = useState([]);
  const navigate = useNavigate();
  const [isStateSet, setIsStateSet] = useState(false);
  const [bookingType, setBookingType] = useState('oneway');
  const [searchPerformed, setSearchPerformed] = useState(false);  // New state
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);  // New state

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      // Retrieve the access token from session storage
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

  const getIntegratedFlightDetails = async (
    firstAirlines,
    secondAirlines,
    source,
    destination,
    dateTime
  ) => {
    const connectionSchedules = [];
    console.log(    firstAirlines,
      secondAirlines,
      source,
      destination,
      dateTime);
    await Promise.all(
      Object.entries(firstAirlines).map(
        async ([firstAirlineName, firstAirline]) => {
          try {
            console.log(firstAirline.apiPath, dateTime);
            const firstResponse = await axios.get(
              `${firstAirline.apiPath}Integration/connectingflight/${source}/${destination}/${dateTime}`
            );
            console.log(firstResponse);
            const firstFlights = firstResponse.data.map((firstFlight) => ({
              ...firstFlight,
              airlineName: firstAirlineName,
              apiPath: firstAirline.apiPath,
            }));
            console.log(firstFlights);
            if (firstFlights && firstFlights.length > 0) {
              await Promise.all(
                firstFlights.map(async (firstFlight) => {
                  await Promise.all(
                    Object.entries(secondAirlines).map(
                      async ([secondAirlineName, secondAirline]) => {
                        console.log(secondAirline);
                        try {
                          const secondResponse = await axios.get(
                            `${secondAirline.apiPath}Integration/directflight/${firstFlight.destinationAirportId}/${destination}/${firstFlight.dateTime}`
                          );
                          console.log(secondResponse);
                          const secondFlights = secondResponse.data.map(
                            (secondFlight) => ({
                              ...secondFlight,
                              airlineName: secondAirlineName,
                              apiPath: secondAirline.apiPath,
                            })
                          );
                          if (secondFlights && secondFlights.length > 0) {
                            console.log(secondFlights);
                            secondFlights.forEach((secondFlight) => {
                              const connectionSchedule = {
                                FirstFlight: firstFlight,
                                SecondFlight: secondFlights,
                              };
                              console.log(connectionSchedule);
                              connectionSchedules.push(connectionSchedule);
                            });
                          }
                        } catch (error) {
                          console.error(error);
                        }
                      }
                    )
                  );
                })
              );
            }
          } catch (error) {
            console.error(error);
          }
        }
      )
    );
    console.log(connectionSchedules)
    setFinalIntegratedConnectingFlights(connectionSchedules);
    // Assuming 'connectionSchedules' is the key used to store the data in localStorage
localStorage.setItem('connectionSchedules', JSON.stringify(connectionSchedules));

    //console.log()
    setIsStateSet(true);
    // Uncomment this line if you want to use this data in your application
  };

  const handleSearch = async () => {
    // Check if the date is not in the past

  console.log("first")
  const currentDate = new Date();
  const selectedDate = new Date(date);

  if (selectedDate < currentDate) {
    // Date is in the past, show an error message or take appropriate action
    toast.error('Selected date is in the past');
    return;
  }
  // Validate Passenger Count
  if (passengerCount < 0 || passengerCount > 10) {
    // Show an error message for invalid passenger count
    toast.error('Passenger count should be between 0 and 10');
    return;
  }
    const formattedDate = new Date(date).toISOString().split(".")[0];
    const sourceAirportId = await fetchAirportId(sourceCity);
    const destinationAirportId = await fetchAirportId(destinationCity);
    console.log('hello')
    getIntegratedFlightDetails(mahaairline, airlinesapi,sourceAirportId.airportId, destinationAirportId.airportId, formattedDate)
    console.log('Source Airport ID:', sourceAirportId);
    console.log('Destination Airport ID:', destinationAirportId);
    console.log('Date:', date);

    if (sourceAirportId && destinationAirportId && date) {
      setCookie('source', sourceAirportId);
      setCookie('destination', destinationAirportId);
      setCookie('date', date);
      setCookie('passengerCount', passengerCount);
      try {
        const formattedDate = new Date(date).toISOString().split(".")[0];
        console.log('Formatted Date:', formattedDate);
        console.log(sourceAirportId);
        console.log(destinationAirportId);


        getIntegratedFlightDetails(mahaairline, airlinesapi,sourceAirportId.airportId, destinationAirportId.airportId, formattedDate)

        console.log(sourceAirportId.airportId)
        const response = await fetch(
          `http://192.168.10.63:91/api/FlightSchedules/schedulesById?sourceAirportId=${sourceAirportId.airportId}&destinationAirportId=${destinationAirportId.airportId}&date=${formattedDate}`
        );
        console.log(response.data)

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Flights:', data);
          if (data.data.length === 0) {
            navigate('/ConnectingFlightsPage');
            return;
          }

          setFlights(data.data);
          setIsNextButtonEnabled(true);

         

        } else {
          console.error('Failed to fetch flights');
        }
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
      // try{
      //   // case 1: firstflight urs.....
      //   console.log('hello',getIntegratedFlightDetails)
      //   getIntegratedFlightDetails(mahaairline, airlinesapi,sourceAirportId.airportId, destinationAirportId.airportId, formattedDate)
      //   //getIntegratedFlightDetails( airlinesapi,sanjayairline, source, destination, dateTime)
   
      // }catch(error){
       
      // }

    }
  };

  const handleNext = async () => {
    // const { scheduleId } = cookies.bookingData || {};
  
    const sourceAirportIdPromise = fetchAirportId(sourceCity);
    const destinationAirportIdPromise = fetchAirportId(destinationCity);
  
    try {
      const [sourceAirportId, destinationAirportId] = await Promise.all([
        sourceAirportIdPromise,
        destinationAirportIdPromise,
      ]);
  
      if (sourceAirportId && destinationAirportId) {
        const scheduleId = selectedFlight?.scheduleId;
        localStorage.setItem('scheduleId', scheduleId);
        setCookie('source', sourceAirportId);
        setCookie('destination', destinationAirportId);
        setCookie('date', date);
        setCookie('passengerCount', passengerCount);
        //scheduleId= localStorage.setItem('scheduleId', scheduleId);
        
        if (bookingType === 'roundtrip') {
          navigate('/roundtrip');
    }
    if (selectedFlight) {
      setCookie('bookingData', { ...selectedFlight, passengerCount, bookingType });
      navigate('/page2');
    } 
    else {
      console.error('No flight selected');
    }
  }
  }
    catch (error) {
      console.error('Error fetching airport details:', error);
    }
  };


  const handleCardClick = (data) => {
    setSelectedFlight(data);
  };


  return (
    <Layout>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        padding="20px"
         // Light blue background color
      >
        <Box
          maxWidth="400px"
          width="100%"
          color="black"
          backgroundColor="#ffffff" // White background for the form container
          padding="20px"
          borderRadius="8px"
          boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
        >
          <Typography
  variant="h4"
  color="black"
  gutterBottom
  style={{ textAlign: 'center' }}
>
  Let's Find Your Flight!
</Typography>

        <form>
          <Box display="flex" flexDirection="row" justifyContent="space-between">
            <FormControl style={{ marginBottom: '10px', marginRight: '10px', width: '100%' }}>
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
            <FormControl style={{ marginBottom: '10px', marginLeft: '10px', width: '100%' }}>
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
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="space-between">
            <TextField
              type="date"
              variant="outlined"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ marginBottom: '10px', marginRight: '10px', width: '100%' }}
            />
            <TextField
              label="Passenger Count"
              type="number"
              variant="outlined"
              fullWidth
              value={passengerCount}
              onChange={(e) => setPassengerCount(e.target.value)}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </Box>
          <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              fullWidth
              style={{ marginTop: '20px', backgroundColor: 'black' }}
            >
              Search for Flights
            </Button>
            <div style={{ marginTop: '20px' }}>
        <Typography variant="h6"></Typography>
        {Array.isArray(flights) && flights.length > 0 ? (
          flights.map((data) => (
            <Card
              key={data.scheduleId}
              style={{
                marginBottom: '10px',
                cursor: 'pointer',
                backgroundColor: selectedFlight === data ? '#e0f7fa' : 'white', // Change the background color for selected card
                border: selectedFlight === data ? '2px solid #009688' : '1px solid #ccc', // Change the border for selected card
              }}
              onClick={() => handleCardClick(data)}
            >
              <CardContent>
                <Typography variant="h6">{data.flightName}</Typography>
                <Typography variant="body2">
                  {new Date(data.dateTime).toLocaleString()} - Source: {data.sourceAirportId} - Destination: {data.destinationAirportId}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2">No flights available</Typography>
        )}
      </div>
          <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              fullWidth
              style={{ marginTop: '20px' }}
              disabled={!isNextButtonEnabled}
            >
              Next
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/ConnectingFlightsPage')}
              fullWidth
              style={{ marginTop: '20px' }}
              disabled={!isNextButtonEnabled}
            >
              Search for Connecting Flights
            </Button>
          </form>
        </Box>
        <ToastContainer />
      </Box>
    </Layout>
  );
};

export default Page1;