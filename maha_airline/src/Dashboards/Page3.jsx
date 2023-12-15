import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import FinalPage from './FinalPage'; // Import the FinalPage component

const Page3 = () => {
  const [cookies, setCookie] = useCookies(['bookingData']);
  const storedData = cookies['bookingData'];
  const initialPassengerCount = cookies.passengerCount || 0;
  const [seatDetails, setSeatDetails] = useState(
    Array.from({ length: initialPassengerCount }, () => ({ seatNo: '' }))
  );
  const [availableSeats, setAvailableSeats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const newPassengerCount = cookies.passengerCount || 0;
    const numScheduleIds = Object.keys(storedData).filter((key) => key.startsWith('scheduleId')).length;

    // Fetch available seats for a specific scheduleId (e.g., scheduleId: 63)
    const fetchAvailableSeats = async () => {
      try {
        const response = await fetch(`https://localhost:7124/api/Seats/ByScheduleId/63`);
        const data = await response.json();

        // Assuming the response has a structure like { seats: [...] }
        setAvailableSeats(data.seats || []);
      } catch (error) {
        console.error('Error fetching available seats:', error);
      }
    };

    // Fetch available seats when the component mounts
    fetchAvailableSeats();
  }, [cookies.passengerCount, storedData]);

  const handleSeatNoChange = (index, value) => {
    setSeatDetails((prev) => [
      ...prev.slice(0, index),
      { ...prev[index], seatNo: value },
      ...prev.slice(index + 1),
    ]);
  };

  const handleSubmit = async () => {
    try {
      const newPassengerCount = cookies.passengerCount || 0;
  
      // Save seatDetails to cookies
      setCookie('bookingData', { ...storedData, seatDetails });
  
      // Assuming 'userId' is stored in the session storage
      const userId = sessionStorage.getItem('userId');
  
      // Create a single object to hold combined data for all passengers and seats
      const combinedData = {
        status: 'booked',
        bookingType: 'oneway',
        userId: userId,
        seatDetails: seatDetails.map((seat, index) => {
          const scheduleIdIndex = Math.floor(index / newPassengerCount);
          const seatIndex = index % newPassengerCount;
          const scheduleIdKey = scheduleIdIndex === 0 ? 'scheduleId' : `scheduleId${scheduleIdIndex}`;
  
          return {
            scheduleId: storedData[scheduleIdKey],
            seatNo: seat.seatNo,
            name: storedData.passengerDetails[seatIndex]?.name || 'Unknown',
            age: storedData.passengerDetails[seatIndex]?.age || 0,
            gender: storedData.passengerDetails[seatIndex]?.gender || 'Unknown',
          };
        }),
      };
  
      console.log('Combined Data:', combinedData);
  
      // Perform API request with the combined data
      const response = await fetch(
        'https://localhost:7124/api/BookingFlightTicket/PostBookingFlightTicket',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(combinedData),
        }
      );
  
      // Rest of the code...
    } catch (error) {
      console.error('Error during booking submission:', error);
    }
  };
  
  

  // Render the FinalPage component if it's available in the location state
  if (location.state && location.state.bookingDetails) {
    return <FinalPage bookingDetails={location.state.bookingDetails} />;
  }

  return (
    <div>
      <h2>Page 3</h2>
      <form>
        {seatDetails.map((seat, index) => (
          <div key={index}>
            <label>
              Seat No:
              <input
                type="text"
                value={seat.seatNo}
                onChange={(e) => handleSeatNoChange(index, e.target.value)}
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={handleSubmit}>
          Next
        </button>
      </form>
    </div>
  );
};

export default Page3;