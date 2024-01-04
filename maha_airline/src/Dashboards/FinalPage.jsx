
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import TopLayout from './Toplayout';
import axios from 'axios';

const FinalPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['bookingData', 'selectedSeats']);
  const [bookingData, setBookingDetails] = useState(null);
  const [isButtonClicked, setButtonClicked] = useState(false); // New state variable
  const [timer, setTimer] = useState(30); // Initial timer value
  const navigate = useNavigate();
  
  

  useEffect(() => {
    // Fetch booking details from cookies or any other source
    const storedBookingDetails = cookies.bookingData || null;
    setBookingDetails(storedBookingDetails);
  }, [cookies.bookingData]);

  useEffect(() => {
    if (isButtonClicked) {
      // Disable the button
      document.getElementById('confirmButton').setAttribute('disabled', 'true');
    }
  }, [isButtonClicked]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    // If the timer reaches 0 and the button is not clicked, change seat status to 'Available'
    if (timer === 0 && !isButtonClicked) {
      clearInterval(countdown);
      handleTimerEnd();
    }

    return () => clearInterval(countdown);
  }, [timer, isButtonClicked]);

  const handleTimerEnd = async () => {
    try {
      await ChangeSeatStatus('Available', cookies.bookingData.seatDetails);
    } catch (error) {
      console.error('Error changing seat status after timer ends:', error);
    } finally {
      clearAllData();
    }
  };
  

  const clearAllData = () => {
    localStorage.clear();
    Object.keys(cookies).forEach(cookieName => {
      removeCookie(cookieName);
    });
    navigate('/UserHistory');
  };

  const ChangeSeatStatus = async (status, seatDetails) => {
    try {
      const userId = sessionStorage.getItem('userId');
      const selectedSeats = seatDetails
        .filter((seat) => seat.seatNo !== null)
        .map((seat) => seat.seatNo);
  
      const ScheduleId = localStorage.getItem('scheduleId');
      const token = sessionStorage.getItem('Token');
  
      const response = await axios.patch(
        `http://192.168.10.63:91/api/Integration/changeseatstatus/${ScheduleId}/${status}`,
        JSON.stringify(selectedSeats),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Seat status changed response:', response.data);
    } catch (error) {
      console.error('Error changing seat status:', error);
    }
  };
  


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
        // Set the state to indicate that the button has been clicked
      setButtonClicked(true);

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
            TicketStatus: 'Booked',
          };
        }),
      };

      console.log('Combined Data:', combinedData);
      //const { userId, username, userEmail } = fetchUserIdAndUsername();
      
      const accessToken = sessionStorage.getItem('Token'); // Replace with your actual key

const response = await fetch(
  'http://192.168.10.63:91/api/BookingFlightTicket/PostBookingFlightTicket',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
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
                  flightDate: scheduleDetails?.dateTime || '2024-01-02T07:47:00',
                  flightTime: formatTicksToTime(scheduleDetails.flightDuration?.ticks || '02:32:21'),
                    
                  
                };
              }
      
              console.log('Found valid scheduleDetails:', scheduleDetails);
      
              return {
                seat: seatDetail.seatNo,
                passengerName: seatDetail.name,
                age: seatDetail.age,
                sourceAirport: scheduleDetails.sourceAirportId || 'Unknown',
                destinationAirport: scheduleDetails.destinationAirportId || 'Unknown',
                flightDate: scheduleDetails.dateTime || '2024-01-02T07:47:00',
                flightTime: formatTicksToTime(scheduleDetails.flightDuration?.ticks || '02:32:21'),
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
                    // Add any additional headers if needed
                  },
                  body: JSON.stringify(emailData),
                  // Add any data you want to send in the body
                  // body: JSON.stringify({ key: 'value' }),
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
          const milliseconds = typeof ticks === 'number' ? ticks / 10000 : 0;
        
          if (milliseconds === 0) {
            return '02:32:21'; // Default time when undefined
          }
        
          // Calculate hours, minutes, and seconds
          const hours = Math.floor(milliseconds / 3600000);
          const minutes = Math.floor((milliseconds % 3600000) / 60000);
          const seconds = Math.floor((milliseconds % 60000) / 1000);
        
          // Format the time string
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
          return formattedTime;
        }
        
  // const clearAllData = () => {
  //   // Clear all items in session storage
  //   // sessionStorage.clear();

  //   // Clear all items in local storage
  //   localStorage.clear();

  //   // Clear all cookies
  //   Object.keys(cookies).forEach(cookieName => {
  //     removeCookie(cookieName);
  //   });

  //   // Navigate to UserHistory
  //   navigate('/UserHistory');
  // };
  

  if (!bookingData) {
    // Handle the case where bookingDetails is not available in cookies
    return <p>No booking details found.</p>;
  }

  // Access the booking details and display them as needed
  const { status, bookingType, userId, scheduleId, seatDetails, passengerDetails } = bookingData;
  // Assuming scheduleId is the key to fetch additional details from your schedules table
  //const scheduleDetails = getScheduleDetails(scheduleId); // You need to implement this function

  console.log(seatDetails);
  console.log(passengerDetails); 


  


  return (
    <TopLayout>
    <div style={containerStyle}>
      <h2 style={headerStyle}>Booking Summary</h2>
      <div style={infoContainerStyle}>
        <div>

          
          {/* <p style={infoStyle}>Status: {status}</p> */}
          {/* <p style={infoStyle}>Booking Type: {bookingType}</p> */}
          {/* Directly fetch and display flight details */}
          {cookies.schedules && cookies.schedules[cookies.bookingData.scheduleId] && (
              <>
                <p style={infoStyle}>
                  Flight Name: {cookies.schedules[cookies.bookingData.scheduleId].flightName}
                </p>
                <p style={infoStyle}>
                  Airport ID: {cookies.schedules[cookies.bookingData.scheduleId].airportId}
                </p>
                <p style={infoStyle}>
                  Departure ID: {cookies.schedules[cookies.bookingData.scheduleId].departureId}
                </p>
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
        <p style={timerStyle}>Time remaining: {timer} seconds</p>
      </div>
    </TopLayout>
  );
};

const timerStyle = {
  fontSize: '16px',
  color: '#777',
  margin: '10px',
};

const containerStyle = {
  maxWidth: '800px',
  margin: 'auto',
  padding: '20px',
  background: '#f4f4f4',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  marginTop:'10px',
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
