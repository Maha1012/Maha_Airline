import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const FinalPage = () => {
  const [cookies, setCookie] = useCookies(['bookingData', 'selectedSeats']);
  const [bookingData, setBookingDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch booking details from cookies or any other source
    const storedBookingDetails = cookies.bookingData || null;
    setBookingDetails(storedBookingDetails);
  }, [cookies.bookingData]);

  const fetchUserIdAndUsername = () => {
    const userId = sessionStorage.getItem('userId');
    const username = sessionStorage.getItem('username');
    return { userId, username };
  };

  const handleSubmit = async () => {
    try {
      const { userId, username } = fetchUserIdAndUsername();
      const newPassengerCount = cookies.passengerCount || 0;

      // Retrieve seatDetails from the cookie
      const selectedSeats = cookies.bookingData.seatDetails
        .flatMap(details => details.seatDetails)
        .filter(seatNo => seatNo !== null);

      // Update seatDetails in the cookie
      setCookie('bookingData', {
        ...cookies.bookingData,
        seatDetails: cookies.bookingData.seatDetails.map(details => ({
          seatDetails: details.seatDetails.filter(seatNo => selectedSeats.includes(seatNo))
        }))
      });

      const combinedData = {
        status: 'booked',
        bookingType: 'oneway',
        userId: userId,
        username: username,
        seatDetails: selectedSeats.map((seat, index) => {
          const scheduleIdIndex = Math.floor(index / newPassengerCount);
          const seatIndex = index % newPassengerCount;
          const scheduleIdKey =
            scheduleIdIndex === 0 ? 'scheduleId' : `scheduleId${scheduleIdIndex}`;

          return {
            scheduleId: cookies.bookingData[scheduleIdKey],
            seatNo: seat,
            name: cookies.bookingData.passengerDetails[seatIndex]?.name || 'Unknown',
            age: cookies.bookingData.passengerDetails[seatIndex]?.age || 0,
            gender: cookies.bookingData.passengerDetails[seatIndex]?.gender || 'Unknown',
          };
        }),
      };

      console.log('Combined Data:', combinedData);

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

      const bookingDetails = await response.json();
      navigate('/finalPage', { state: { bookingDetails } });

    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  if (!bookingData) {
    // Handle the case where bookingDetails is not available in cookies
    return <p>No booking details found.</p>;
  }

  // Access the booking details and display them as needed
  const { status, bookingType, userId, scheduleId, seatDetails, passengerDetails } = bookingData;

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Booking Summary</h2>
      <div style={infoContainerStyle}>
        <div>
          <p style={infoStyle}>Status: {status}</p>
          <p style={infoStyle}>Booking Type: {bookingType}</p>
          <p style={infoStyle}>User ID: {userId}</p>
          <p style={infoStyle}>Schedule ID: {scheduleId}</p>
        </div>
        <div>
          <h3 style={subHeaderStyle}>Passenger Details</h3>
          <ul style={listStyle}>
            {passengerDetails.map((passenger, index) => (
              <li key={index} style={listItemStyle}>
                <p>Name: {passenger.name}</p>
                <p>Age: {passenger.age}</p>
                <p>Gender: {passenger.gender}</p>
              </li>
            ))}
          </ul>
        </div>
      
      </div>
      <button
        type="button"
        onClick={() => handleSubmit()}
        style={buttonStyle}
      >
        Continue
      </button>
    </div>
  );
};

const containerStyle = {
  maxWidth: '800px',
  margin: 'auto',
  padding: '20px',
  background: '#f4f4f4',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

const headerStyle = {
  textAlign: 'center',
  color: '#3498db',
};

const infoContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

const infoStyle = {
  fontSize: '16px',
  marginBottom: '10px',
};

const subHeaderStyle = {
  fontSize: '18px',
  color: '#3498db',
};

const listStyle = {
  listStyleType: 'none',
  padding: '0',
};

const listItemStyle = {
  marginBottom: '10px',
};

const buttonStyle = {
  marginTop: '20px',
  padding: '15px 20px',
  fontSize: '16px',
  fontWeight: 'bold',
  backgroundColor: '#3498db',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default FinalPage;
