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

  const handleNext = () => {
    if (selectedFlight) {
      setCookie('bookingData', { ...selectedFlight, passengerCount, bookingType });
      navigate('/page2');
    } else {
      console.error('No flight selected');
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
    {/* <div className="m-5">
          {finalIntegratedConnectingFlights.length > 0 ? (
            finalIntegratedConnectingFlights.map((connection, index) => (
              <div key={index} className="flex justify-between">
                <div className="">
                  {connection.SecondFlight.map((flight, i) => (
                    <div
                      key={i}
                      className="flex flex-row-reverse border p-2 hover:cursor-pointer m-5"
                      onClick={() =>
                        onClick(flight, connection.FirstFlight, "connectingTrip")
                      }
                    >
                      <div className="p-5">
                        <ul>
                          <li>{flight.flightName}</li>
                          <li>{flight.sourceAirportId}</li>
                          <li>{flight.destinationAirportId}</li>
                          <li>Flight Duration: {flight.flightDuration}</li>
                          <li>
                            DepartureDate: {flight.dateTime.split("T")[0]}
                          </li>
                          <li>
                            DepartureTime: {flight.dateTime.split("T")[1]}
                          </li>
                        </ul>
                      </div>
                      <div className="p-5">
                        <ul>
                          <li>{connection.FirstFlight.flightName}</li>
                          <li>{connection.FirstFlight.sourceAirportId}</li>
                          <li>{connection.FirstFlight.destinationAirportId}</li>
                          <li>
                            Flight Duration: {connection.FirstFlight.flightDuration}
                          </li>
                          <li>
                            DepartureDate: {connection.FirstFlight.dateTime.split("T")[0]}
                          </li>
                          <li>
                            DepartureTime: {connection.FirstFlight.dateTime.split("T")[1]}
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <Typography variant="body2">No connecting flights available</Typography>
          )}
        </div> */}
    </>
  );
};


export default Page1;