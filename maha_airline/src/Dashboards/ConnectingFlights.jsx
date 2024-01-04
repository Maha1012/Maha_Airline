import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import Layout from './Layout';

import { Container, Paper, Grid, Box, Divider } from '@mui/material'; // Additional Material-UI components
import FlightIcon from '@mui/icons-material/Flight';

import axios from 'axios';
import { airlinesapi, mahaairline } from '../constants';

const ConnectingFlightsPage = () => {
  const [cookies, setCookie] = useCookies(['selectedConnectingFlight', 'secondConnectingFlight']);
  const [connectingFlights, setConnectingFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(0);
  const [availableFlights, setAvailableFlights] = useState([]);
  const [selectedAvailableFlight, setSelectedAvailableFlight] = useState('');
  const [isStateSet, setIsStateSet] = useState(false);
  const [finalIntegratedConnectingFlights,setFinalIntegratedConnectingFlights] = useState([]);
  const [getIntegratedFlightDetails,setgetIntegratedFlightDetails] = useState([]);
  const [selectedFirstFlight, setSelectedFirstFlight] = useState(null);
  const [selectedConnectingFlight, setSelectedConnectingFlight] = useState(null);
  const [displaySelectedFlights, setDisplaySelectedFlights] = useState(false);
  const [selectedFirstFlightDetails, setSelectedFirstFlightDetails] = useState(null);
  const [selectedConnectingFlightDetails, setSelectedConnectingFlightDetails] = useState(null);
  
  
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
    const fetchFlightDetails = async (scheduleId) => {
      try {
        const response = await fetch(`http://192.168.10.63:91/api/FlightSchedules/${scheduleId}`);
        if (response.ok) {
          const flightDetails = await response.json();
          return flightDetails;
        } else {
          console.error('Failed to fetch flight details');
          return null;
        }
      } catch (error) {
        console.error('Error fetching flight details:', error);
        return null;
      }
    };

    if (selectedFirstFlight) {
      fetchFlightDetails(selectedFirstFlight)
        .then((details) => setSelectedFirstFlightDetails(details));
    }

    if (selectedConnectingFlight) {
      fetchFlightDetails(selectedConnectingFlight)
        .then((details) => setSelectedConnectingFlightDetails(details));
    }
  }, [selectedFirstFlight, selectedConnectingFlight]);


  useEffect(() => {
    // Reset selectedFlight when connectingFlights change
    setSelectedFlight(0);
  }, [connectingFlights]);


  useEffect(() => {
    console.log('Effect 1 is running');


    setFinalIntegratedConnectingFlights([]);
    setIsStateSet(false);
    const data = JSON.parse(localStorage.getItem('connectionSchedules')) || [];
    if(data){
      setFinalIntegratedConnectingFlights(data);
      setIsStateSet(true);
    }


    const fetchConnectingFlights = async () => {
      try {
        const response = await fetch(
          `http://192.168.10.63:91/api/FlightSchedules/SchedulebySource?sourceAirportId=${cookies.source.airportId}&date=${cookies.date}`
        );
        console.log('source', cookies.source.airportId);
      
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Connecting Flights:', data);
      
          if (data.data.length === 0) {
            console.log('No connecting flights available.');
            return;
          }
      
          setConnectingFlights(data.data);
          console.log('for first', data.data);
        } else {
          console.error('Failed to fetch connecting flights');
        }
      } catch (error) {
        console.error('Error fetching connecting flights:', error);
      }
    };
    console.log('Effect 1 has stooped');

   
    const reloadPage = () => {
      window.location.reload();
    };
    fetchConnectingFlights();
    

  //   // Reload the page after 30 seconds
  // const reloadPage = () => {
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 30000); // 30 seconds
  // };

  // // Call the reload function
  // reloadPage();
    console.log('this is fetchConnectingFlights',fetchConnectingFlights)
    const timerId = setTimeout(reloadPage, 20000);

    // Clean up the timer when the component is unmounted or when cookies.source or cookies.date change
    return () => clearTimeout(timerId);
  }, [cookies.source, cookies.date]);



  // const handleSelectConnectingFlight = (e) => {
  //   const selectedValue = e.target.value;
  //   console.log(e.target.value);

  //   setSelectedFlight(selectedValue);
  //   setCookie('selectedConnectingFlight', selectedValue);
  // };

  const handleSelectConnectingFlight = (selectedValue) => {
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
  
      // Reset firstConnectingFlights before updating it
      setFirstConnectingFlights([]);
      
      // Update firstConnectingFlights with the new data
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
    if (selectedFlight) {
      try {
        console.log('Selected Flight ID:', selectedFlight);
  
        // Fetch details of the connecting flight using scheduleId
        const flightDetailsResponse = await fetch(
          `http://192.168.10.63:91/api/FlightSchedules/${selectedFlight}`
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
            `http://192.168.10.63:91/api/Airports/${cookies.destination.airportId}`
          );
  
          if (destinationCityResponse.ok) {
            const destinationCityData = await destinationCityResponse.json();
            console.log('Destination City:', destinationCityData.city);
            console.log('Destination Airport ID:', destinationAirportId);
  
            // Check if there is a corresponding second flight based on destinationAirportId
            const correspondingSecondFlight = finalIntegratedConnectingFlights.find(
              (connection) => connection.SecondFlight.some(
                (flight) => flight.sourceAirportId === destinationAirportId
              )
            );
  
            if (correspondingSecondFlight) {
              // Check if the selected first flight's destination matches the source of the second flight
              if (flightDetails.destinationAirportId === correspondingSecondFlight.SecondFlight[0].sourceAirportId) {
                // Now fetch available flights based on the saved destination from cookies
                const availableFlightsResponse = await fetch(
                  `http://192.168.10.63:91/api/FlightSchedules/GetFlightsUsingId?sourceAirportId=${destinationAirportId}&DestinationAirportId=${cookies.destination}&date=${cookies.date}`
                );
  
                if (availableFlightsResponse.ok) {
                  const availableFlightsData = await availableFlightsResponse.json();
                  console.log('Available flights after connecting flight:', availableFlightsData);
  
                  // Update the state or perform other actions with the available flights data
                  setAvailableFlights(availableFlightsData.data);
                } else {
                  console.error('Failed to fetch available flights after connecting flight');
                }
  
                // Call the function with the defined destinationAirportId
                getIntegratedFlightDetails(
                  mahaairline,
                  airlinesapi,
                  destinationAirportId,
                  destinationCityData.airportId,
                  cookies.date
                );
  
                // Set the selected flight and corresponding available flights
                setSelectedFlight(selectedFlight);
                setFirstConnectingFlights(correspondingSecondFlight.SecondFlight);
              } else {
                console.error('Selected first flight destination does not match with the source of the second flight.');
                // Handle the mismatch condition, such as showing an error message or preventing further processing.
              }
            } else {
              console.error('No corresponding second flight found.');
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
    const selectedValue = event; // Use event directly as it should contain the flight.scheduleId
    console.log('selectedValue:', selectedValue);
  
    if (selectedValue !== undefined) {
      setSelectedAvailableFlight(selectedValue);
    }
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
        const firstFlightDetails = connectingFlights.find(
          (flight) => flight.scheduleId === selectedFlight
        );
        if (firstFlightDetails) {
          const firstFlightDestination = firstFlightDetails.destinationAirportId;
          const connectingFlightSource = selectedFlightDetails.SecondFlight[0].sourceAirportId;
          console.log(firstFlightDestination);
          console.log(connectingFlightSource);
  
          // Validate that the destination of the first flight matches the source of the connecting flight
          if (firstFlightDestination === connectingFlightSource) {
          // The validation passed, proceed with saving the selection
          const apiPath = selectedFlightDetails.SecondFlight[0].apiPath;
          const airlineName = selectedFlightDetails.SecondFlight[0].airlineName;
          const sourceAirportId = selectedFlightDetails.SecondFlight[0].sourceAirportId;
          const destinationAirportId = selectedFlightDetails.SecondFlight[0].destinationAirportId;
          const flightName = selectedFlightDetails.SecondFlight[0].flightName;
          const dateTime = selectedFlightDetails.SecondFlight[0].dateTime;
  
          console.log('Selected Flight Details:', selectedFlightDetails);
          console.log('API Path:', apiPath);
          console.log('Airline Name:', airlineName);
          console.log('Source Airport ID:', sourceAirportId);
          console.log('Destination Airport ID:', destinationAirportId);
          console.log('Flight Name:', flightName);
          console.log('Date and Time:', dateTime);
  
          // Store the selected available flight information and API path in localStorage
          localStorage.setItem('scheduleId', selectedFlight);
          localStorage.setItem('newScheduleId', selectedAvailableFlight);
          localStorage.setItem('apipath', apiPath);
          localStorage.setItem('airlineName', airlineName);
  
          // Save the selected available flight information to the cookie
          const bookingData = {
            scheduleId: selectedFlight,
            scheduleId1: selectedAvailableFlight,
            apiPath: apiPath,
            airlineName: airlineName,
            sourceAirportId: sourceAirportId,
            destinationAirportId: destinationAirportId,
            flightName: flightName,
            datetime: dateTime,
          };
  
          // Store bookingData in localStorage
          sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
  
          setCookie('bookingData', bookingData);
          console.log('Selected Available Flight:', selectedAvailableFlight);
          // Set the selected first and connecting flights
          setSelectedFirstFlight(selectedFlight);
          setSelectedConnectingFlight(selectedAvailableFlight);
          navigate('/Page2ConnectingFlights');
        } else {
          // Validation failed, show an error message or take appropriate action
          toast.error('Error: The destination of the first flight does not match the source of the connecting flight.');
        }
      } else {
        console.error('Selected first flight details not found.');
      }
    } else {
      console.error('Selected flight details not found.');
    }
  } else {
    toast.error('Error: Please select an available flight.');
  }
};
  
const handleDisplaySelectedFlights = () => {
  setDisplaySelectedFlights(true);
};


const renderSelectedFlights = () => {
    console.log('Rendering selected flights...');
    return (
      <div>
        <Typography variant="h6" color="primary" gutterBottom>
          Selected Flights
        </Typography>
        {selectedFirstFlightDetails && (
          <div>
            <Typography variant="body1" gutterBottom>
              First Flight Details:
            </Typography>
            <pre>{JSON.stringify(selectedFirstFlightDetails, null, 2)}</pre>
          </div>
        )}
        {selectedConnectingFlightDetails && (
          <div>
            <Typography variant="body1" gutterBottom>
              Connecting Flight Details:
            </Typography>
            <pre>{JSON.stringify(selectedConnectingFlightDetails, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  };

  const renderConnectingFlights = () => {
  return connectingFlights.map((flight) => {
    const isSelected = selectedFlight === flight.scheduleId;

    // Check if there is a relevant connection flight
    const hasRelevantConnection = finalIntegratedConnectingFlights.some(
      (connection) => connection.FirstFlight.scheduleId === flight.scheduleId
    );

    return (
      <Button
        key={flight.scheduleId}
        variant="contained"
        color={isSelected ? "success" : "primary"}
        onClick={() => {
          handleSelectConnectingFlight(flight.scheduleId);
          handleConnectingFlightSelect(); // Call handleConnectingFlightSelect when a connecting flight is selected
        }}
        disabled={!hasRelevantConnection}
        sx={{
          marginBottom: '10px',
          width: '100%',
          backgroundColor: isSelected ? 'blue' : 'black',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ flex: 1, color: 'white' }}>
            {`${flight.flightName}`}
          </Typography>
          <FlightIcon sx={{ fontSize: 30 }} />
        </Box>
        <Typography variant="caption" sx={{ textAlign: 'left', display: 'block', color: 'white' }}>
          {`Departure: ${new Date(flight.dateTime).toLocaleString()}`}
        </Typography>
        <Typography variant="caption" sx={{ textAlign: 'left', display: 'block', color: 'white' }}>
          {`From: ${flight.sourceAirportId || 'N/A'}, To: ${flight.destinationAirportId || 'N/A'}`}
        </Typography>
      </Button>
    );
  });
};

  const renderAvailableFlights = () => {
    return firstConnectingFlights.map((flight) => {
      const isSelected = selectedAvailableFlight === flight.scheduleId;
  
      return (
        <Button
          key={flight.scheduleId}
          variant="contained"
          color={isSelected ? "success" : "secondary"}
          onClick={() => handleSelectAvailableFlight(flight.scheduleId)}
          sx={{
            marginBottom: '10px',
            width: '100%',
            backgroundColor: isSelected ? 'blue' : 'black',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ flex: 1, color: 'white' }}>
              {`${flight.flightName}`}
            </Typography>
            <FlightIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant="caption" sx={{ textAlign: 'left', display: 'block', color: 'white' }}>
            {`Departure: ${new Date(flight.dateTime).toLocaleString()}`}
          </Typography>
          <Typography variant="caption" sx={{ textAlign: 'left', display: 'block', color: 'white' }}>
            {`From: ${flight.sourceAirportId || 'N/A'}, To: ${flight.destinationAirportId || 'N/A'}`}
          </Typography>
        </Button>
      );
    });
  };
  
  return (
    <Layout>
      
      <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4, backgroundColor: '#f0f0f0',padding:'60px' }}>
      <Typography variant="h4" color="primary" gutterBottom sx={{ marginTop: '20px' }}>
      Choose Your Air Travel
</Typography>

        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom>
            Select Your First Flight
</Typography>
              {renderConnectingFlights()}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>  
              Select Your Connecting Flight
              </Typography>
              {renderAvailableFlights()}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />



          <Grid container spacing={2} style={{ textAlign: 'center' }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center',marginLeft:'200px' }}>
  <Button
    variant="contained"
    color="primary"
    onClick={handleSaveAvailableFlightSelection}
    sx={{ width: '100%' }}
  >
    Save Selection
  </Button>
</Grid>
  {/* New button to display selected flights */}
  <Grid item xs={12} md={6}>
            {/* <Button
              variant="contained"
              color="secondary"
              onClick={handleDisplaySelectedFlights}
              sx={{ width: '100%' }}
            >
              Display Selected Flights
            </Button> */}
          </Grid>
        {/* </Grid> */}
</Grid>

        </Paper>
      </Container>
      {displaySelectedFlights && renderSelectedFlights()}
      <ToastContainer />
    </Layout>
  );
};

export default ConnectingFlightsPage;

