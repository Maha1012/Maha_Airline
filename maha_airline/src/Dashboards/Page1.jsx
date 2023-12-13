import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Page1 = () => {
  const [sourceAirportId, setSourceAirportId] = useState('');
  const [destinationAirportId, setDestinationAirportId] = useState('');
  const [date, setDate] = useState('');
  const [passengerCount, setPassengerCount] = useState(0);
  const [bookingType, setBookingType] = useState('');
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [cookies, setCookie] = useCookies(['bookingData']);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of flights based on source, destination, and date
    const fetchFlights = async () => {
      try {
        const response = await fetch(
          `https://localhost:7124/api/FlightSchedules?sourceAirportId=${sourceAirportId}&destinationAirportId=${destinationAirportId}&date=${date}`
        );

        if (response.ok) {
          const data = await response.json();
          setFlights(data);
        } else {
          console.error('Failed to fetch flights');
        }
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    if (sourceAirportId && destinationAirportId && date) {
      fetchFlights();
    }
  }, [sourceAirportId, destinationAirportId, date]);

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
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Page 1</h2>
      <form>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Source Airport Id:
            <input
              type="text"
              value={sourceAirportId}
              onChange={(e) => setSourceAirportId(e.target.value)}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Destination Airport Id:
            <input
              type="text"
              value={destinationAirportId}
              onChange={(e) => setDestinationAirportId(e.target.value)}
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
        <div>
          <h3>Select a Flight</h3>
          <ul>
            {flights.map((flight) => (
              <li key={flight.scheduleId}>
                <label>
                  <input
                    type="radio"
                    name="flight"
                    value={flight.scheduleId}
                    checked={selectedFlight && selectedFlight.scheduleId === flight.scheduleId}
                    onChange={() => setSelectedFlight(flight)}
                  />
                  {`${flight.flightName} - ${flight.dateTime}`}
                </label>
              </li>
            ))}
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
