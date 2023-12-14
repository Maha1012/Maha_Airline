import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Page1 = () => {
  const [sourceCity, setSourceCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [date, setDate] = useState('');
  const [passengerCount, setPassengerCount] = useState(0);
  const [bookingType, setBookingType] = useState('');
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [cookies, setCookie] = useCookies(['bookingData']);
  const navigate = useNavigate();

  // Define the fetchAirportId function here
  const fetchAirportId = async (city) => {
    try {
      const response = await fetch(
        `https://localhost:7124/api/Airports/GetAirportIdByCity?city=${city}`
      );
  
      if (response.ok) {
        const data = await response.json();
        return data; // Assuming the API returns the airportId directly
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
      try {
        const formattedDate = new Date(date).toISOString();
        console.log('Formatted Date:', formattedDate);
  
        const response = await fetch(
          `https://localhost:7124/api/FlightSchedules/schedules?sourceCity=${sourceCity}&destinationCity=${destinationCity}&date=${formattedDate}`
        );
  
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Flights:', data);
          setFlights(data.data); // Set the flights to the state
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
      // Save data to cookies, including the selected flight
      setCookie('bookingData', { ...selectedFlight, passengerCount, bookingType });
      navigate('/page2'); // Redirect to Page2
    } else {
      console.error('No flight selected');
    }
  };
 


  return (
    <div style={{ maxWidth: '400px', margin: 'auto', color: 'black' }}>
      <h2>Page 1</h2>
      <form>
        {/* ... other input fields */}
        <div style={{ marginBottom: '10px' }}>
          <label>
            Source City:
            <input
              type="text"
              value={sourceCity}
              onChange={(e) => setSourceCity(e.target.value)}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Destination City:
            <input
              type="text"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Date:
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Passenger Count:
            <input
              type="number"
              value={passengerCount}
              onChange={(e) => setPassengerCount(e.target.value)}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Booking Type:
            <input
              type="text"
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value)}
            />
          </label>
        </div>
        <button type="button" onClick={handleSearch}>
          Search for Flights
        </button>
        <div>
      <h3>Select a Flight</h3>
      <ul>
        {Array.isArray(flights) && flights.length > 0 ? (
          flights.map((data) => (
            <li key={data.scheduleId}>
              <label>
                <input
                  type="radio"
                  name="flight"
                  value={data.scheduleId}
                  onChange={() => setSelectedFlight(data)}
                />
                {`${data.flightName} - ${new Date(data.dateTime).toLocaleString()}`}
              </label>
            </li>
          ))
        ) : (
          <li></li>
        )}
      </ul>
    </div>
        <button type="button" onClick={handleNext}>
          Next
        </button>
      </form>
    </div>
  );
};

export default Page1;
