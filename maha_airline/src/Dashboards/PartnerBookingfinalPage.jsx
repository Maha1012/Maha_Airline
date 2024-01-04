import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopLayout from './Toplayout';

 
const PartnerBookingFinalPage = () => {
  const { remove } = useCookies(['bookingData', 'selectedSeats']);
  const [cookies, setCookie] = useCookies(['bookingData', 'selectedSeats']);
  const [bookingData, setBookingDetails] = useState(null);
  const navigate = useNavigate();
  const [isButtonClicked, setButtonClicked] = useState(false); // New state variable
  const [timer, setTimer] = useState(30); // Initial timer value
  // const apipath = localStorage.getItem('apipath')

 
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
  
      // Handle the response as needed
      console.log('Response from seat status update:', response);
    } catch (error) {
      console.error('Error changing seat status:', error);
    }
  };
  
  
  

  const clearAllData = () => {
    localStorage.clear();
    Object.keys(cookies).forEach(cookieName => {
      remove(cookieName); // Use the remove function to remove the cookie
    });
    navigate('/UserHistory');
  };

  const handleTimerEnd = async () => {
    try {
      await ChangeSeatStatus('Available', cookies.bookingData.seatDetails);
    } catch (error) {
      console.error('Error changing seat status after timer ends:', error);
    } finally {
      clearAllData();
    }
  };
  

  
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


  

  // const clearAllData = () => {
  //   localStorage.clear();
  //   Object.keys(cookies).forEach(cookieName => {
  //     remove(cookieName); // Use the remove function to remove the cookie
  //   });
  //   navigate('/UserHistory');
  // };



 
  const fetchUserIdAndUsername = () => {
    const userId = sessionStorage.getItem('userId');
    const username = sessionStorage.getItem('username');
    return { userId, username };
  };
 
  const postDataToDatabase = async (bookingData) => {
    try {
      // Retrieve the token from session storage
      const token = sessionStorage.getItem('Token');
  
      const response = await fetch('http://192.168.10.63:91/api/BookingsPartner/CreateBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(bookingData),
      });
  
 
      const responseData = await response.json();
      console.log('Response from server:', responseData);
 
      // Check if the first API call was successful
      if (response.ok) {
        console.log('hi');
        // Extract relevant data from the response to send to the second API
        // Extract relevant data from the response to send to the second API
const connectionTickets = responseData.ticket.map(ticket => ({
  bookingId: responseData.booking.bookingId,
  ticketNo: ticket.ticketNo,
  name: ticket.name,
  age: ticket.age,
  gender: ticket.gender,
  seatNo: ticket.seatNo,
  flightName: ticket.flightName,
  sourceAirportId: ticket.sourceAirportId,
  destinationAirportId: ticket.destinationAirportId,
  airlineName: "mahaairline",
  dateTime: ticket.dateTime,
  status: "Booked",
}));

console.log('secondapicallresponse', connectionTickets);
       

        const apipath = localStorage.getItem('apipath');

        await axios.post(`${apipath}Integration/partnerbooking`, connectionTickets, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          },
        })
        .then((res)=>{
          console.log(res)
        // Check if the response status is okay (status code 2xx)
        if (res.status >= 200 && res.status < 300) {
          // Show a success toast with onClose callback
          toast.success('Booking confirmed successfully!', {
            onClose: () => {
              // Assuming you are using React Router, you can navigate to the "UserHistory" page
              // Replace '/UserHistory' with the actual path to the UserHistory page
              navigate('/UserHistory');
            },
          });
        } else {
          console.error("Unexpected response status:", res.status);
        }
      })
      .catch((err) => {
        // Show an error toast
        toast.error('Error confirming booking.');
    
        console.error(err);
      });
 
        // const secondAPIResponseData = await secondAPIResponse.json();
        // console.log('Second API Response:', secondAPIResponseData);
 
        // Check if the second API call was successful
        // if (secondAPIResponse.ok) {
        //   // Navigate to the final page or perform other actions
        //   navigate('/finalPage');
        // } else {
        //   // Handle the case where the second API call was not successful
        //   console.error('Second API call failed:', secondAPIResponseData);
        // }
      } else {
        // Handle the case where the first API call was not successful
        console.error('First API call failed:', responseData);
      }
    } catch (error) {
      console.error('Error posting data to the server:', error);
      // Handle the error as needed
    }
  };
 
  const handleSubmit = async () => {
    try {
      const { userId } = fetchUserIdAndUsername();
      const newPassengerCount = cookies.passengerCount || 0;
  
      // Retrieve seatDetails from the cookie
      const selectedSeats = cookies.bookingData.seatDetails
        .flatMap(details => details.seatDetails)
        .filter(seatNo => seatNo !== null);

        setButtonClicked(true);
  
      const bookingDataForApi = {
        booking: {
          status: 'booked',
          userId: userId,
          bookingType: 'oneway',
        },
  
        // Initialize an empty array to store tickets
        flightTickets: [],
  
        // Iterate over each seat to create flight tickets
...selectedSeats.reduce((tickets, seat, index) => {
  const scheduleIdIndex = Math.floor(index / newPassengerCount);
  const seatIndex = index % newPassengerCount;
  const scheduleIdKey = scheduleIdIndex === 0 ? 'scheduleId' : `scheduleId${scheduleIdIndex}`;

  // Check if the current scheduleIdKey is equal to 'scheduleId'
  const isMainScheduleId = scheduleIdKey === 'scheduleId';

  const newTicket = {
    scheduleId: isMainScheduleId ? cookies.bookingData[scheduleIdKey] : undefined,
    seatNo: seat,
    name: cookies.bookingData.passengerDetails[seatIndex]?.name || 'Unknown',
    age: cookies.bookingData.passengerDetails[seatIndex]?.age || 0,
    gender: cookies.bookingData.passengerDetails[seatIndex]?.gender || 'Unknown',
  };

  // Handle the case where scheduleId is undefined for the second flight
  if (!newTicket.scheduleId && scheduleIdIndex === 1) {
    newTicket.scheduleId = cookies.bookingData.scheduleId1;
  }

  // Find the existing tickets for the current scheduleId and append the new ticket
  const existingTickets = tickets.find(t => t.scheduleId === newTicket.scheduleId);
  if (existingTickets) {
    existingTickets.tickets.push(newTicket);
  } else {
    tickets.push({ scheduleId: newTicket.scheduleId, tickets: [newTicket] });
  }

  return tickets;
}, []),
  
connectionFlightTickets: selectedSeats.slice(newPassengerCount).map((seat, index) => {
  const seatIndex = index % newPassengerCount;
  return {
    name: cookies.bookingData.passengerDetails[seatIndex]?.name || 'Unknown',
    age: cookies.bookingData.passengerDetails[seatIndex]?.age || 0,
    gender: cookies.bookingData.passengerDetails[seatIndex]?.gender || 'Unknown',
    seatNo: seat,
    airlineName: cookies.bookingData.airlineName,
    sourceAirportId: cookies.bookingData.sourceAirportId,
    destinationAirportId: cookies.bookingData.destinationAirportId,
    dateTime: cookies.bookingData.datetime,
    flightName: cookies.bookingData.flightName,
    scheduleId: cookies.bookingData.scheduleId1, // Use scheduleId1 for connectionFlightTickets
  };
}),

      };
  
     
      console.log('Combined Data:', bookingDataForApi);
      
  
      // Make the first API call and post data to the second API
      await postDataToDatabase(bookingDataForApi);
      clearAllData();
  
    } catch (error) {
      console.error('Error during form submission:', error);
      setButtonClicked(false);
    }
  };
  
 
  if (!bookingData) {
    // Handle the case where bookingDetails is not available in cookies
    return <p>No booking details found.</p>;
  }
 
  const { status, bookingType, userId, scheduleId, passengerDetails } = bookingData;
 
  return (
    <TopLayout>
    <div style={containerStyle}>
      <h2 style={headerStyle}>Booking Summary</h2>
      <div style={infoContainerStyle}>
        <div>
          {/* <p style={infoStyle}>Status: {status}</p> */}
          {/* <p style={infoStyle}>Booking Type: {bookingType}</p> */}
          {/* <p style={infoStyle}>User ID: {userId}</p> */}
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

const timerStyle = {
  fontSize: '16px',
  marginBottom: '10px',
};
 
export default PartnerBookingFinalPage;
 