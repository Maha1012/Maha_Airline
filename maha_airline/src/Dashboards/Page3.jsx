import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Page3 = () => {
  const [cookies, setCookie] = useCookies(['bookingData']);
  const storedData = cookies['bookingData'];
  const initialPassengerCount = storedData?.passengerCount || 0;
  const [seatDetails, setSeatDetails] = useState(
    Array.from({ length: initialPassengerCount }, () => ({ seatNo: '' }))
  );
  const navigate = useNavigate();

  useEffect(() => {
    const newPassengerCount = storedData?.passengerCount || 0;
    if (newPassengerCount !== seatDetails.length) {
      setSeatDetails(Array.from({ length: newPassengerCount }, () => ({ seatNo: '' })));
    }
  }, [storedData?.passengerCount, seatDetails.length]);

  const handleSeatNoChange = (index, value) => {
    setSeatDetails((prev) => [
      ...prev.slice(0, index),
      { ...prev[index], seatNo: value },
      ...prev.slice(index + 1),
    ]);
  };

  const handleSubmit = async () => {
    try {
      // Save seatDetails to cookies
      setCookie('bookingData', { ...storedData, seatDetails });

      // Assuming 'userId' is stored in the session storage
      const userId = sessionStorage.getItem('userId');

      // Create a single object to hold combined data for all passengers and seats
      const combinedData = {
        status: 'booked',
        bookingType: 'oneway',
        userId: userId, // You may replace this with the actual userId
        scheduleId: storedData.scheduleId, // Use the scheduleId from storedData
        seatDetails: seatDetails.map((seat, index) => ({
          scheduleId: storedData.scheduleId,
          seatNo: seat.seatNo,
          name: storedData.passengerDetails[index].name,
          age: storedData.passengerDetails[index].age,
          gender: storedData.passengerDetails[index].gender,
        })),
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

      if (response.ok) {
        console.log('Booking submitted successfully!');
        // Additional handling for success
        navigate('/FinalPage'); // Redirect to the final page
      } else {
        const errorData = await response.json();
        console.error('Booking submission failed:', errorData);
        // Additional handling for failure
      }
    } catch (error) {
      console.error('Error during booking submission:', error);
    }
  };

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
