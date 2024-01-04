import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import TopLayout from './Toplayout';

const RoundTripFinalPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['bookingData', 'selectedSeats']);
  const [bookingData, setBookingDetails] = useState(null);
  const navigate = useNavigate();
  const [isButtonClicked, setButtonClicked] = useState(false); // New state variable


  useEffect(() => {
    if (isButtonClicked) {
      // Disable the button
      document.getElementById('confirmButton').setAttribute('disabled', 'true');
    }
  }, [isButtonClicked]);
  
  // Helper function to access nested values explicitly
function getNestedValue(obj, keys) {
  const keysArray = keys.split('.');
  let value = obj;

  for (const key of keysArray) {
    if (value && value.hasOwnProperty(key)) {
      value = value[key];
    } else if (key === 'returnFlight' && value.hasOwnProperty('returnFlight')) {
      // Handle the case where 'returnFlight' is present
      value = value.returnFlight;
    } else {
      return undefined;
    }
  }

  return value;
}


  useEffect(() => {
    // Fetch booking details from cookies or any other source
    const storedBookingDetails = cookies.bookingData || null;
    setBookingDetails(storedBookingDetails);
  }, [cookies.bookingData]);

  const fetchUserIdAndUsername = () => {
    const userId = sessionStorage.getItem('userId');
    const username = sessionStorage.getItem('username');
    const userEmail = sessionStorage.getItem('userEmail'); // Add this line to retrieve user email
    return { userId, username, userEmail };
  };
  
  

  const handleSubmit = async () => {
    try {
      const { userId, username, userEmail } = fetchUserIdAndUsername();
  
      const newPassengerCount = cookies.passengerCount || 0;
  
      // Retrieve seatDetails from the cookie
      const selectedSeats = cookies.bookingData.seatDetails
        .flatMap(details => details.seatDetails)
        .filter(seatNo => seatNo !== null);
        setButtonClicked(true);
  
        setCookie('bookingData', {
          ...cookies.bookingData,
          seatDetails: cookies.bookingData.seatDetails.map((details, index) => {
            const returnFlight = cookies.bookingData.returnFlight;
            //const scheduleId = index === 0 ? details.scheduleId : (returnFlight ? returnFlight.scheduleId : undefined);
            //const scheduleId = index === 0 ? details.scheduleId : details.returnFlight.scheduleId;

            const scheduleId = index === 0 ? details.scheduleId : (details.returnFlight ? details.returnFlight.scheduleId : undefined);

            return {
              seatDetails: details.seatDetails.filter(seatNo => selectedSeats.includes(seatNo)),
              scheduleId: scheduleId,
            };
          }),
        });

        const scheduleIdFirst = cookies.bookingData.scheduleId; // Assuming scheduleId is directly in bookingData

const returnFlight = cookies.bookingData.returnFlight;
const scheduleIdSecond = returnFlight ? returnFlight.scheduleId : undefined;

setCookie('bookingData', {
  ...cookies.bookingData,
  seatDetails: cookies.bookingData.seatDetails.map((details, index) => ({
    seatDetails: details.seatDetails.filter(seatNo => selectedSeats.includes(seatNo)),
    scheduleId: index === 0 ? scheduleIdFirst : scheduleIdSecond,
  })),
});
        
const combinedData = {
  status: 'booked',
  bookingType: 'roundtrip',
  userId: userId,
  username: username,
  seatDetails: selectedSeats.map((seat, index) => {
    const scheduleIdIndex = Math.floor(index / newPassengerCount);
    const seatIndex = index % newPassengerCount;

    const scheduleId = index === 0 ? scheduleIdFirst : scheduleIdSecond;

    return {
      scheduleId: scheduleId !== undefined ? scheduleId : 'UNKNOWN',
      seatNo: seat,
      name: cookies.bookingData.passengerDetails[seatIndex]?.name || 'Unknown',
      age: cookies.bookingData.passengerDetails[seatIndex]?.age || 0,
      gender: cookies.bookingData.passengerDetails[seatIndex]?.gender || 'Unknown',
    };
  }),
};
        
  
      // Rest of your code...
      console.log('Combined Data:', combinedData);
  
      const token = sessionStorage.getItem('Token');
      const response = await fetch(
        'http://192.168.10.63:91/api/BookingFlightTicket/PostBookingFlightTicket',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`, // Add this line to include the token in the request headers
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(combinedData),
        }
      );
      


      const emailData = {
        email: userEmail,
        tickets: combinedData.seatDetails.length > 0
    ? combinedData.seatDetails.map(seatDetail => {
        const scheduleDetails = cookies.bookingData;
              console.log('Processing scheduleId:', scheduleId);
              console.log('cookies.bookingData:', cookies.bookingData);

      
              // Retrieve the schedule information directly from the booking data
              // const scheduleDetails = cookies.bookingData;

              console.log('scheduleDetails',scheduleDetails);
      
              if (!scheduleDetails) {
                console.warn(`Invalid or missing scheduleId: ${scheduleId}`);
                // Provide default ticket object by extracting data from your response structure
                return {
                  seat: seatDetail.seatNo,
                  passengerName: seatDetail.name || 'Unknown',
                  age: seatDetail.age || 0,
                  sourceAirport: scheduleDetails?.sourceAirportId || 'Unknown',
                  destinationAirport: scheduleDetails?.destinationAirportId || 'Unknown',
                  flightDate: scheduleDetails?.dateTime || 'Unknown',
                  flightTime:formatTicksToTime(scheduleDetails.flightDuration?.ticks || 0),
                    
                  
                };
              }
      
              console.log('Found valid scheduleDetails:', scheduleDetails);
      
              return {
                seat: seatDetail.seatNo,
                passengerName: seatDetail.name,
                age: seatDetail.age,
                sourceAirport: scheduleDetails.sourceAirportId || 'Unknown',
                destinationAirport: scheduleDetails.destinationAirportId || 'Unknown',
                flightDate: scheduleDetails.dateTime || 'Unknown',
                flightTime: formatTicksToTime(scheduleDetails.flightDuration?.ticks || 0),
              };
            }).filter(ticket => ticket !== null)
          : []
      };


      // Function to find schedule details by scheduleId (replace this with your actual implementation)

      
      
      console.log('emailData', emailData);

      if (response.ok) {
        // Send booking confirmation email
        const emailResponse = await fetch(
          'http://192.168.10.63:91/api/EmailService/SendBookingConfirmation',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
          }
        );
        

        if (emailResponse.ok) {
          console.log('Booking confirmation email sent successfully');
        } else {
          console.error('Booking confirmation email sending failed');
        }

        // If booking is successful, clear all data
        clearAllData();
      } else {
        console.error('Booking failed');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      setButtonClicked(false);
    }
  };

  function formatTicksToTime(ticks) {
    // Convert ticks to milliseconds
    const milliseconds = ticks / 10000;
  
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
  
    // Format the time string
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
    return formattedTime;
  }
  const clearAllData = () => {
    // Clear all items in session storage
    // sessionStorage.clear();

    // Clear all items in local storage
    localStorage.clear();

    // Clear all cookies
    Object.keys(cookies).forEach(cookieName => {
      removeCookie(cookieName);
    });

    // Navigate to UserHistory
    navigate('/UserHistory');
  };
  

  if (!bookingData) {
    // Handle the case where bookingDetails is not available in cookies
    return <p>No booking details found.</p>;
  }

  // Access the booking details and display them as needed
  const { status, bookingType, userId, scheduleId, seatDetails, passengerDetails } = bookingData;
  // Assuming scheduleId is the key to fetch additional details from your schedules table
  //const scheduleDetails = getScheduleDetails(scheduleId); // You need to implement this function

  return (
    <TopLayout>
    <div style={containerStyle}>
      <h2 style={headerStyle}>Booking Summary</h2>
      <div style={infoContainerStyle}>
        <div>
          {/* <p style={infoStyle}>Status: {status}</p> */}
          <p style={infoStyle}>Booking Type: {bookingType}</p>
          {/* Directly fetch and display flight details */}
          {cookies.schedules && cookies.schedules[scheduleId] && (
            <>
              <p style={infoStyle}>Flight Name: {cookies.schedules[scheduleId].flightName}</p>
              <p style={infoStyle}>Airport ID: {cookies.schedules[scheduleId].airportId}</p>
              <p style={infoStyle}>Departure ID: {cookies.schedules[scheduleId].departureId}</p>
            </>
          )}

          {seatDetails && seatDetails.length > 0 && (
  <>
    <h3 style={subHeaderStyle}>Seat Details</h3>
    <ul style={listStyle}>
      {seatDetails.map((seatDetail, index) => (
        <li key={index} style={listItemStyle}>
          <p>Seat No: {seatDetail.seatDetails[0]}</p>
          {/* Add additional seat details if needed */}
        </li>
      ))}
    </ul>
  </>
)}
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
      {status !== 'booked' && (
          <button
            id="confirmButton" // Add an id to the button
            type="button"
            onClick={() => handleSubmit()}
            style={buttonStyle}
            disabled={isButtonClicked} // Disable the button if it has been clicked
          >
            {isButtonClicked ? 'Booking Confirmed' : 'Confirm Booking'}
          </button>
        )}
    </div>
    </TopLayout>
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

export default RoundTripFinalPage;
