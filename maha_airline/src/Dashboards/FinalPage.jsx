// FinalPage.js
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

const FinalPage = () => {
  const [cookies] = useCookies(['bookingData']);
  const bookingData = cookies['bookingData'];
  const bookingData1 = cookies['bookingData1'];
  const [submitting, setSubmitting] = useState(false);

  if (!bookingData || !bookingData1) {
    // Handle the case where there is no bookingData or bookingData1
    return <p>No booking data found.</p>;
  }

  // Assuming 'userId' is stored in the session storage
  const userId = sessionStorage.getItem('userId');

  // FinalPage.js
 // FinalPage.js
// ...
const handleSubmit = async () => {
  try {
    setSubmitting(true);

    // Assuming 'userId' is stored in the session storage
    const userId = sessionStorage.getItem('userId');

    // Create an array to hold individual data for each passenger and seat
    const combinedDataArray = [];

    // Map over each passenger in bookingData.passengerDetails
    bookingData.passengerDetails.forEach((passenger, index) => {
      // Extract relevant properties from each passenger
      const { name, age, gender, seatNo } = passenger;

      // Create an object with the expected payload structure for each passenger and seat
      const combinedData = {
        status: 'booked',
        bookingType: storedData.bookingType,
        userId,
        scheduleId: storedData.scheduleId, // You might want to confirm whether this should be the scheduleId from passenger or seat
        seatDetails: [
          {
            seatNo,
            name: passenger.name,
            age: passenger.age,
            gender: passenger.gender,
          },
        ],
      };

      // Push the combinedData to the array
      combinedDataArray.push(combinedData);
    });

    // Perform API request for each combined data
    for (const combinedData of combinedDataArray) {
      const response = await fetch('https://localhost:7124/api/BookingFlightTicket/PostBookingFlightTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedData),
      });

      if (response.ok) {
        console.log('Booking submitted successfully!');
        // Additional handling for success
      } else {
        const errorData = await response.json();
        console.error('Booking submission failed:', errorData);
        // Additional handling for failure
      }
    }
  } catch (error) {
    console.error('Error during booking submission:', error);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div>
      <h2>Booking Summary</h2>
      {/* Display booking details */}
      <p>Schedule ID: {bookingData.scheduleId}</p>
      {/* Display passenger count only if passengerDetails is defined */}
      {bookingData1 && bookingData1.passengerDetails && (
        <p>Passenger Count: {bookingData1.passengerDetails.length}</p>
      )}

      <h3>Passenger Details:</h3>
      {bookingData1.passengerDetails.map((passenger, index) => (
  <div key={index}>
    <p>
      Passenger {index + 1}:
      <br />
      name: {passenger.Name}, age: {passenger.Age}, gender: {passenger.Gender}
    </p>
  </div>
))}


      <h3>Seat Details:</h3>
      {bookingData.seatDetails.map((seat, index) => (
        <p key={index}>Passenger {index + 1} Seat No: {seat.seatNo}</p>
      ))}

      {/* Submit button */}
      <button type="button" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

export default FinalPage;
