// FinalPage.jsx
import React from 'react';
import { useCookies } from 'react-cookie';

const FinalPage = () => {
  const [cookies] = useCookies(['bookingData']);
  const bookingDetails = cookies['bookingData'];

  if (!bookingDetails) {
    // Handle the case where bookingDetails is not available in cookies
    return <p>No booking details found.</p>;
  }

  // Access the booking details and display them as needed
  const { status, bookingType, userId, scheduleId, seatDetails } = bookingDetails;

  return (
    <div>
      <h2>Final Page</h2>
      <p>Status: {status}</p>
      <p>Booking Type: {bookingType}</p>
      <p>User ID: {userId}</p>
      <p>Schedule ID: {scheduleId}</p>

      <h3>Seat Details</h3>
      <ul>
        {seatDetails.map((seat, index) => (
          <li key={index}>
            <p>Seat No: {seat.seatNo}</p>
            <p>Name: {seat.name}</p>
            <p>Age: {seat.age}</p>
            <p>Gender: {seat.gender}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FinalPage;
