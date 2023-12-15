import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';


const ConnectingFlightsPage = () => {
  const [cookies, setCookie] = useCookies(['selectedConnectingFlight', 'secondConnectingFlight']);
  // const navigate = useNavigate();
  const [connectingFlights, setConnectingFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState('');
  const [availableFlights, setAvailableFlights] = useState([]);
  const [selectedAvailableFlight, setSelectedAvailableFlight] = useState('');
  const [selectedSecondConnectingFlight, setSelectedSecondConnectingFlight] = useState('');
  const [secondConnectingFlights, setSecondConnectingFlights] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnectingFlights = async () => {
      try {
        const response = await fetch(
          `https://localhost:7124/api/FlightSchedules/Roundtrip?sourceCity=${cookies.source}&date=${cookies.date}`
        );

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

    fetchConnectingFlights();
  }, [cookies.source, cookies.date]);

  const handleSelectConnectingFlight = (event) => {
    const selectedValue = event.target.value;
    setSelectedFlight(selectedValue);
  };

  const handleSaveSelection = () => {
    if (selectedFlight) {
      // Save the selected connecting flight information to the cookie
      setCookie('selectedConnectingFlight', selectedFlight);
      console.log('Selected Connecting Flight:', selectedFlight);
    } else {
      console.error('No connecting flight selected');
    }
  };

  const handleConnectingFlightSelect = async () => {
    if (selectedFlight) {
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
            `https://localhost:7124/api/Airports/GetAirportIdByCity?city=${cookies.destination}`
          );

          if (destinationCityResponse.ok) {
            const destinationCityData = await destinationCityResponse.json();
            console.log('Destination City:', destinationCityData.city);

            // Now fetch available flights based on the saved destination from cookies
            const availableFlightsResponse = await fetch(
              `https://localhost:7124/api/FlightSchedules/schedulesUsingId?sourceAirportId=${destinationAirportId}&destinationAirportId=${destinationCityData.airportId}&date=${cookies.date}`
            );

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
      // Save the selected available flight information to the cookie
      const bookingData = {
        scheduleId: selectedFlight,
        scheduleId1: selectedAvailableFlight,
      };
  
      setCookie('bookingData', bookingData);
      console.log('Selected Available Flight:', selectedAvailableFlight);
      navigate('/Page2ConnectingFlights');
    } else {
      console.error('No available flight selected');
    }
  };
  

  return (
    <div>
      <h2>Connecting Flights</h2>
      {connectingFlights.length === 0 ? (
        <p>No connecting flights available for the provided source and date combination.</p>
      ) : (
        <div>
          <label>
            Select a Connecting Flight:
            <select onChange={handleSelectConnectingFlight} value={selectedFlight}>
              <option value="" disabled>
                -- Select a Flight --
              </option>
              {connectingFlights.map((flight) => (
                <option key={flight.scheduleId} value={flight.scheduleId}>
                  {`${flight.flightName} - ${new Date(flight.dateTime).toLocaleString()}`}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={handleConnectingFlightSelect}>
            Fetch Cities and Available Flights
          </button>
          <button type="button" onClick={handleSaveSelection}>
            Save Selection
          </button>
        </div>
      )}

      {/* Display available flights */}
      {availableFlights.length > 0 && (
        <div>
          <label>
            Select an Available Flight:
            <select onChange={handleSelectAvailableFlight} value={selectedAvailableFlight}>
              <option value="" disabled>
                -- Select a Flight --
              </option>
              {availableFlights.map((flight) => (
                <option key={flight.scheduleId} value={flight.scheduleId}>
                  {`${flight.flightName} - ${new Date(flight.dateTime).toLocaleString()}`}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={handleSaveAvailableFlightSelection}>
            Save Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectingFlightsPage;