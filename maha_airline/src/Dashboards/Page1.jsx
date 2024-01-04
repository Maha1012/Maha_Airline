import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { airlinesapi, mahaairline } from '../constants';

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
import axios from 'axios';

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
  const [finalIntegratedConnectingFlights,setFinalIntegratedConnectingFlights] = useState([]);
  const navigate = useNavigate();
  const [isStateSet, setIsStateSet] = useState(false);
  

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
        //getIntegratedFlightDetails(mahaairline, airlinesapi,sourceAirportId.airportId, destinationAirportId.airportId, formattedDate)

        console.log(sourceAirportId.airportId)
        const response = await fetch(
          `https://localhost:7124/api/FlightSchedules/schedulesById?sourceAirportId=${sourceAirportId.airportId}&destinationAirportId=${destinationAirportId.airportId}&date=${formattedDate}`
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
    const sourceAirportIdPromise = fetchAirportId(sourceCity);
    const destinationAirportIdPromise = fetchAirportId(destinationCity);
  
    try {
      const [sourceAirportId, destinationAirportId] = await Promise.all([
        sourceAirportIdPromise,
        destinationAirportIdPromise,
      ]);
  
      if (sourceAirportId && destinationAirportId) {
        setCookie('source', sourceAirportId);
        setCookie('destination', destinationAirportId);
        setCookie('date', date);
        setCookie('passengerCount', passengerCount);
  
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



  return (
    <>
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
          //label="Date"
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
       <FormControl fullWidth style={{ marginBottom: '10px' }}>
            <InputLabel>Booking Type</InputLabel>
            <Select
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value)}
              label="Booking Type"
            >
              <MenuItem value="oneway">One Way</MenuItem>
              <MenuItem value="roundtrip">Round Trip</MenuItem>
            </Select>
          </FormControl>
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
    <ToastContainer />
    </>
  );
};


export default Page1;