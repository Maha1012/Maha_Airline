import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import axios from 'axios';

const ConnectingFlightsPage = () => {
  const [cookies, setCookie] = useCookies(['selectedConnectingFlight', 'secondConnectingFlight']);
  const [connectingFlights, setConnectingFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(0);
  const [availableFlights, setAvailableFlights] = useState([]);
  const [selectedAvailableFlight, setSelectedAvailableFlight] = useState('');
  const [isStateSet, setIsStateSet] = useState(false);
  const [finalIntegratedConnectingFlights,setFinalIntegratedConnectingFlights] = useState([]);
  //const integration = localStorage.getItem(connectionSchedules);
  // Assuming 'connectionSchedules' is the key used to store the data in localStorage
  // Assuming 'connectionSchedules' is the key used to store the data in localStorage
  const [firstConnectingFlights, setFirstConnectingFlights] = useState([]);
  const data = JSON.parse(localStorage.getItem('connectionSchedules')) || [];
  console.log(finalIntegratedConnectingFlights);


  
//finalIntegratedConnectingFlights = connectionSchedules;


  
  const navigate = useNavigate();
  //const [finalIntegratedConnectingFlights,setFinalIntegratedConnectingFlights] = useState([]);
  //setFinalIntegratedConnectingFlights(connectionSchedules); // Uncomment this line if you want to use this data in your application

  useEffect(() => {
    console.log('Effect 1 is running');


         
    const data = JSON.parse(localStorage.getItem('connectionSchedules')) || [];
    if(data){
      setFinalIntegratedConnectingFlights(data);
      setIsStateSet(true);
    }


    const fetchConnectingFlights = async () => {
      try {
        const response = await fetch(
          `https://localhost:7124/api/FlightSchedules/SchedulebySource?sourceAirportId=${cookies.source.airportId}&date=${cookies.date}`
        );
        console.log('source',cookies.source.airportId)

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Connecting Flights:', data);

          if (data.data.length === 0) {
            console.log('No connecting flights available.');
            return;
          }

          setConnectingFlights(data.data);
        } else {
          console.error('Failed to fetch connecting flights');
        }
      } catch (error) {
        console.error('Error fetching connecting flights:', error);
      }
    };
    console.log('Effect 1 has stooped');

   
    fetchConnectingFlights();
    console.log('this is fetchConnectingFlights',fetchConnectingFlights)
  }, [cookies.source, cookies.date]);



  const handleSelectConnectingFlight = (e) => {
    const selectedValue = e.target.value;
    console.log(e.target.value);

    setSelectedFlight(selectedValue);
    setCookie('selectedConnectingFlight', selectedValue);
  };



  useEffect(() => {
    if (isStateSet) {
      console.log('Effect 2 is running');
      console.log("Integrated Flight Details:", finalIntegratedConnectingFlights);
  
      const firstflightdata = finalIntegratedConnectingFlights.map(
        (connection) => connection.FirstFlight
      );
      const secondflightdata = finalIntegratedConnectingFlights
        .map((connection) => connection.SecondFlight)
        .flat();
  
      console.log("Before setSearchResults - finalIntegratedConnectingFlights:", finalIntegratedConnectingFlights);
  
      setAvailableFlights((prevAvailableFlights) => {
        console.log("Previous searchResults:", prevAvailableFlights);
        const updatedSearchResults = [...prevAvailableFlights, ...firstflightdata];
        console.log("Updated searchResults:", updatedSearchResults);
        return updatedSearchResults;
      });
  
      setFirstConnectingFlights((prevFirstConnectingFlights) => [
        ...prevFirstConnectingFlights,
        ...secondflightdata,
      ]);
  
      console.log("Updated inside searchResults:", availableFlights);
      console.log("Updated inside firstConnectingFlights:", firstConnectingFlights);
  
      console.log('Effect completed.');
    }
  }, [finalIntegratedConnectingFlights, isStateSet]);
  
  


  const handleConnectingFlightSelect = async () => {
    //getIntegratedFlightDetails(mahaairline, airlinesapi,destinationAirportId, destinationCityData.airportId, cookies.date)
    
    
    if (selectedFlight) {
      
      console.log("first")
      try {
        console.log('Selected Flight ID:', selectedFlight);

        // Fetch details of the connecting flight using scheduleId
        const flightDetailsResponse = await fetch(
          `https://localhost:7124/api/FlightSchedules/${selectedFlight}`
          
        );

        if (flightDetailsResponse.ok) {
          const flightDetails = await flightDetailsResponse.json();
          console.log('Flight Details:', flightDetails);

          // Extract source and destination from the connecting flight details
         
          const sourceAirportId = flightDetails.sourceAirportId;
          const destinationAirportId = flightDetails.destinationAirportId;

          console.log('Destination City in Cookies:', cookies.destination);

          // Fetch destination airportId using the destination city
          const destinationCityResponse = await fetch(
            `https://localhost:7124/api/Airports/${cookies.destination.airportId}`
          );

          console.log('destinationCityResponse',destinationCityResponse);

          if (destinationCityResponse.ok) {
            const destinationCityData = await destinationCityResponse.json();
            console.log('Destination City:', destinationCityData.city);
            //console.log('Source Airport ID:', sourceAirportId);
            console.log('Destination Airport ID:', destinationAirportId);


            console.log('source for fetching',cookies.destination.airportId)

            // Now fetch available flights based on the saved destination from cookies
            const availableFlightsResponse = await fetch(
              `https://localhost:7124/api/FlightSchedules/SchedulebySource?sourceAirportId=${cookies.destination.airportId}&date=${cookies.date}`
            );

            if (availableFlightsResponse.ok) {
              const availableFlightsData = await availableFlightsResponse.json();
              console.log('Available flights after connecting flight:', availableFlightsData);
            
              // Update the state or perform other actions with the available flights data
              setAvailableFlights(availableFlightsData.data);
            } else {
              console.error('Failed to fetch available flights after connecting flight');
            }
            //console.log('Availableflights',availableFlightsResponse);

           
            
           

            
            if (availableFlightsResponse.ok) {
              const availableFlightsData = await availableFlightsResponse.json();
              console.log('Destination City Response:', destinationCityData);
              console.log('Available flights after connecting flight:', availableFlightsData);
              setAvailableFlights(availableFlightsData.data);
            } else {
              console.error('Failed to fetch available flights after connecting flight');
            }
          } else {
            console.error('Failed to fetch destination city');
          }
        } else {
          console.error('Failed to fetch details of the connecting flight');
        }
      } catch (error) {
        console.error('Error handling connecting flight selection:', error);
      }
    
    } else {
      console.error('No connecting flight selected');
    }
    
  };
  

  const handleSelectAvailableFlight = (event) => {
    const selectedValue = event.target.value;
    setSelectedAvailableFlight(selectedValue);
  };

  const handleSaveAvailableFlightSelection = () => {
    if (selectedAvailableFlight && selectedFlight) {
      // Find the selected available flight in finalIntegratedConnectingFlights
      const selectedFlightDetails = finalIntegratedConnectingFlights.find(
        (connection) => connection.SecondFlight.some(
          (flight) => flight.scheduleId === selectedAvailableFlight
        )
      );
  
      if (selectedFlightDetails) {
        // Extract the apiPath from the selected flight details
        const apiPath = selectedFlightDetails.SecondFlight[0].apiPath;
  
        // Store the selected available flight information and API path in localStorage
        localStorage.setItem('ScheduleId', selectedFlight);
        localStorage.setItem('newScheduleId', selectedAvailableFlight);
        localStorage.setItem('apipath', apiPath);
  
        // Save the selected available flight information to the cookie
        const bookingData = {
          scheduleId: selectedFlight,
          scheduleId1: selectedAvailableFlight,
          apiPath: apiPath,
        };
  
        // Store bookingData in localStorage
        sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
  
        setCookie('bookingData', bookingData);
        console.log('Selected Available Flight:', selectedAvailableFlight);
        navigate('/Page2ConnectingFlights');
      } else {
        console.error('Selected available flight details not found in finalIntegratedConnectingFlights');
      }
    } else {
      console.error('No available flight selected');
    }
  };
  
  
  return (
    <>
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center', padding: '20px' }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Connecting Flights
      </Typography>

      {connectingFlights.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No connecting flights available for the provided source and date combination.
        </Typography>
      ) : (
        <div>
          <FormControl fullWidth style={{ marginBottom: '20px' }}>
            <InputLabel>Select a Connecting Flight</InputLabel>
            <Select
              value={selectedFlight}
              onChange={handleSelectConnectingFlight}
              label="Select a Connecting Flight"
            >
              {connectingFlights.map((flight) => (
                <MenuItem key={flight.scheduleId} value={flight.scheduleId}>
                  {`${flight.flightName} - ${new Date(flight.dateTime).toLocaleString()} `}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" onClick={handleConnectingFlightSelect}>
            Fetch Cities and Available Flights
          </Button>

        </div>
      )}

      {/* Display available flights */}
      {firstConnectingFlights.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <FormControl fullWidth style={{ marginBottom: '20px' }}>
            <InputLabel>Select an Available Flight</InputLabel>
            <Select
              value={selectedAvailableFlight}
              onChange={handleSelectAvailableFlight}
              label="Select an Available Flight"
            >
              {firstConnectingFlights.map((flight) => (
                <MenuItem key={flight.scheduleId} value={flight.scheduleId}>
                  {`${flight.flightName} - ${new Date(flight.dateTime).toLocaleString()} `}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAvailableFlightSelection}
          >
            Save Selection
          </Button>
        </div>
      )}
    </div>
    
    

    
</>
  );
};

export default ConnectingFlightsPage;