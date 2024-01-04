import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { airlinesapi } from '../constants';
import Layout from './Layout';
import { Button, Grid, Paper, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';


const Page3 = () => {
  const [cookies, setCookie] = useCookies(['bookingData', 'selectedSeats']);
  const storedData = cookies['bookingData'];
  const [availableSeats, setAvailableSeats] = useState([]);
  const [seatDetails, setSeatDetails] = useState([]);
  const [timer, setTimer] = useState(30); // 300 seconds = 5 minutes
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);
  const navigate = useNavigate();
  const scheduleIds = Object.keys(storedData).filter(key => key.startsWith('scheduleId'));
  const [seatsFetched, setSeatsFetched] = useState(false);
  // const [FirstAvailableSeats,setFirstAvailableSeats] = useState([]);

  useEffect(() => {
    if (storedData.scheduleId && !seatsFetched) {
      setCurrentScheduleIndex(currentScheduleIndex + 1);
      fetchAvailableSeats();
    }
  }, [storedData.scheduleId, seatsFetched]);

  const fetchAvailableSeats = async () => {
    try {
      const scheduleId = localStorage.getItem('scheduleId');
  
      if (currentScheduleIndex === 0) {
        const token = sessionStorage.getItem('Token');
  
        const response = await axios.get(`http://192.168.10.63:91/api/Seats/ByScheduleId/${scheduleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        const initialSeats = response.data;
        console.log('initialSeats', initialSeats);
  
        setAvailableSeats(initialSeats || []);
        setSeatDetails(Array.from({ length: initialSeats.length }, () => ({ seatNo: null })));
        setSeatsFetched(true);
  
        console.log(`Seats for scheduleId ${scheduleId}:`, initialSeats);
      }
  
      // Fetch seats for the new scheduleId if available and after clicking the "Next" button
      const newScheduleId = localStorage.getItem('newScheduleId');
      console.log(`Fetching seats for newScheduleId: ${newScheduleId}`);
  
      if (newScheduleId && currentScheduleIndex !== 0) {
        const airlineName = localStorage.getItem('airlineName');
        console.log(airlineName);
        let partnerSeatsUrl;
  
        switch (airlineName) {
          case 'mahaairline':
            partnerSeatsUrl = `http://192.168.10.63:91/api/Seats/ByScheduleId/${newScheduleId}`;
            break;
          case 'hariniairline':
            // Assuming Harnia Airline also uses a bearer token for authorization
            partnerSeatsUrl = `http://192.168.10.78:89/api/integration/seats/${newScheduleId}`;
            break;
          case 'dhanushiyaairline':
            // Assuming Dhanushiya Airline also uses a bearer token for authorization
            partnerSeatsUrl = `http://192.168.10.75:8080/api/integration/seats/${newScheduleId}`;
            break;
          case 'vishalairline':
            // Assuming Vishal Airline also uses a bearer token for authorization
            partnerSeatsUrl = `http://192.168.10.51:85/api/integration/seats/${newScheduleId}`;
            break;
            case 'sanjayairline':
            // Assuming Vishal Airline also uses a bearer token for authorization
            partnerSeatsUrl = `http://192.168.10.54:88/api/integration/seats/${newScheduleId}`;
            break;
            case 'thillaiiairline':
            // Assuming Vishal Airline also uses a bearer token for authorization
            partnerSeatsUrl = `http://192.168.10.88:86/api/integration/seats/${newScheduleId}`;
            break;
            case 'rethuairline':
            // Assuming Vishal Airline also uses a bearer token for authorization
            partnerSeatsUrl = `http://192.168.10.74:93/api/integration/seats/${newScheduleId}`;
            break;
            case 'chetnaairline':
            // Assuming Vishal Airline also uses a bearer token for authorization
            partnerSeatsUrl = `http://192.168.10.59:96/api/integration/seats/${newScheduleId}`;
            break;
            case 'sundariairline':
            // Assuming Vishal Airline also uses a bearer token for authorization
            partnerSeatsUrl = `http://192.168.10.55:93/api/integration/seats/${newScheduleId}`;
            break;
            case 'airvoyager':
            // Assuming Vishal Airline also uses a bearer token for authorization
            partnerSeatsUrl = `http://192.168.10.72:86/api/integration/seats/${newScheduleId}`;
            break;
            case 'suriyaairline':
            // Assuming Vishal Airline also uses a bearer token for authorization
            partnerSeatsUrl = `http://192.168.10.70:98/api/integration/seats/${newScheduleId}`;
            break;
            case 'akshayairline':
            // Assuming Vishal Airline also uses a bearer token for authorization
            partnerSeatsUrl = `http://192.168.10.82:92/api/integration/seats/${newScheduleId}`;
            break;
            case 'sprityairline':
            // Assuming Vishal Airline also uses a bearer token for authorization
            partnerSeatsUrl = `http://192.168.10.67:90/api/integration/seats/${newScheduleId}`;
            break;
          // Add cases for other airlines
          default:
            console.log('Invalid airlineName');
        }
        const token = sessionStorage  .getItem('Token');
        console.log('Token:', token);
  
        if (partnerSeatsUrl) {
          // Include the bearer token in the headers for authorization
          const partnerResponse = await axios.get(partnerSeatsUrl, {
            headers: {
              'Authorization': `Bearer ${token}`, // Use the same token as for the initial request
              'Content-Type': 'application/json',
            },
          });
  
          console.log('Seats for partner flight:', partnerResponse.data);
  
          // Update the state with seats for the newScheduleId
          setAvailableSeats(partnerResponse.data);
          setSeatDetails(Array.from({ length: partnerResponse.data.length }, () => ({ seatNo: null })));
        } else {
          console.log('Invalid partnerSeatsUrl');
        }
      }
    } catch (error) {
      console.error('Error fetching available seats:', error);
    }
  };
  
  
  // const handleTimerEnd = async () => {
  //   try {
  //     await ChangeSeatStatus('Available');
  //   } catch (error) {
  //     console.error('Error changing seat status after timer ends:', error);
  //   } finally {
  //     // Clear all cookies
  //     Object.keys(cookies).forEach((cookie) => {
  //       setCookie(cookie, '', { path: '/', maxAge: 0 });
  //     });

  //     // Clear local storage
  //     localStorage.clear();
  //     // Navigate to Page1
  //     navigate('/page1');
  //   }
  // };

  // useEffect(() => {
  //   const countdown = setInterval(() => {
  //     setTimer((prev) => prev - 1);
  //   }, 1000);

  //   if (timer === 0) {
  //     clearInterval(countdown);
  //     handleTimerEnd();
  //   }

  //   return () => clearInterval(countdown);
  // }, [timer, cookies, setCookie, navigate]);

  const handleBookingCompletion = async () => {
    try {
      await ChangeSeatStatus('Booked');
      setCurrentScheduleIndex(currentScheduleIndex + 1);

      if (currentScheduleIndex < scheduleIds.length) {
        fetchAvailableSeats();
      }

      const selectedSeats = seatDetails
        .filter((seat) => seat.seatNo !== null)
        .map((seat) => seat.seatNo);

      const currentScheduleIdKey = scheduleIds[currentScheduleIndex - 1];
      const updatedBookingData = {
        ...storedData,
        seatDetails: [
          ...(storedData.seatDetails || []),
          { seatDetails: selectedSeats },
        ],
      };

      setCookie('bookingData', updatedBookingData);

      if (currentScheduleIndex === scheduleIds.length) {
        const airlineName = localStorage.getItem('airlineName');

        console.log('Airline Name:', airlineName);

        if (airlineName === 'mahaairline') {
          navigate('/finalPage');
        } else {
          navigate('/PartnerBookingfinalPage');
          console.log('Invalid airlineName or no airlineName specified.');
        }
      }
    } catch (error) {
      console.error('Error during booking completion:', error);
    }
  };

  useEffect(() => {
    const newPassengerCount = cookies.passengerCount || 0;
    setSeatDetails((prev) =>
      Array.from({ length: availableSeats.length }, (_, index) => prev[index] || { seatNo: null })
    );
  }, [cookies.passengerCount, storedData, availableSeats]);

//   const ChangeSeatStatus = async (status, airlineKey) => {
//     try {
//       const userId = sessionStorage.getItem('userId');
//       const selectedSeats = seatDetails
//         .filter((seat) => seat.seatNo !== null)
//         .map((seat) => seat.seatNo);
  
//       const currentScheduleId = localStorage.getItem('scheduleId');
//       const newScheduleId = localStorage.getItem('newScheduleId');
  
//       // Retrieve apiPath using airlineKey
//       const apiPath = airlinesapi[airlineKey].apiPath;
  
//       // Change seat status for the current schedule
//       const currentScheduleResponse = await axios.patch(
//         `${apiPath}Integration/changeseatstatus/${currentScheduleId}/${status}`,
//         JSON.stringify(selectedSeats),
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
  
//       console.log('Response for current schedule:', currentScheduleResponse.data);
  
//       // Change seat status for the new schedule
//       const newScheduleUrl = `${apiPath}Integration/changeseatstatus/${newScheduleId}/${status}`;
// console.log('New Schedule URL:', newScheduleUrl);

// const newScheduleResponse = await axios.patch(
//   newScheduleUrl,
//   JSON.stringify(selectedSeats),
//   {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   }
// );
  
//       console.log('Response for new schedule:', newScheduleResponse.data);
//     } catch (error) {
//       console.error('Error changing seat status:', error);
//     }
//   };


const ChangeSeatStatus = async (status) => {
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
  } catch (error) {
    console.error('Error changing seat status:', error);
  }
};

  const ChangePartnerSeatStatus = async (status, airlineKey) => {
    try {
      const userId = sessionStorage.getItem('userId');
      const selectedSeats = seatDetails
        .filter((seat) => seat.seatNo !== null)
        .map((seat) => seat.seatNo);
  
        
      // const currentScheduleId = localStorage.getItem('scheduleId');
      airlineName = localStorage.getItem('airlineName');
      console.log('airlineName',airlineName);
      const newScheduleId = localStorage.getItem('newScheduleId');
      console.log('newScheduleId',newScheduleId);
  
      // Retrieve apiPath using airlineKey
      const apiPath = airlinesapi[airlineKey].apiPath;
  
      // Change seat status for the current schedule
      const currentScheduleResponse = await axios.patch(
        `${apiPath}Integration/changeseatstatus/${newScheduleId}/${status}`,
        JSON.stringify(selectedSeats),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response for current schedule:', currentScheduleResponse.data);
    } catch (error) {
      console.error('Error changing seat status:', error);
    }
  };
  
  const handleSeatNoChange = (index, value) => {
    setSeatDetails((prev) => {
      const updatedDetails = [...prev];
      const isSelected = updatedDetails[index]?.seatNo !== null;
  
      if (isSelected) {
        // Deselect the seat if it was previously selected
        updatedDetails[index] = { seatNo: null };
      } else {
        // Select the seat if it was not previously selected
        updatedDetails[index] = { seatNo: value };
      }
  
      return updatedDetails;
    });
  };
  
  
  
  const renderSeatGrid = () => {
    const passengerCount = cookies.passengerCount || 0;
    const seatsPerRow = 6;
  
    // Group seats by rows
    const seatsByRows = Array.from({ length: Math.ceil(availableSeats.length / seatsPerRow) }, (_, rowIndex) =>
      availableSeats.slice(rowIndex * seatsPerRow, (rowIndex + 1) * seatsPerRow)
    );
  
    return (
      <div>
        <h3 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
          {currentScheduleIndex === 0 ? `Select Your Seat for Your Flight ${currentScheduleIndex + 1}` : ``}
        </h3>
        {seatsByRows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            {row.map((seat, index) => (
              <div key={index} style={{ position: 'relative', marginRight: '10px' }}>
                {/* Seat Button */}
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Button
  onClick={() => handleSeatNoChange(rowIndex * seatsPerRow + index, seat.seatNumber)}
  disabled={
    seatDetails[rowIndex * seatsPerRow + index]?.seatNo && seatDetails[rowIndex * seatsPerRow + index]?.seatNo !== null
      ? false
      : seat.status.toLowerCase() === 'booked' ||
        (passengerCount > 0 && seatDetails.filter((s) => s.seatNo !== null).length >= passengerCount)
  }
  variant="contained"
  style={{
    padding: '15px',
    fontSize: '24px',
    fontWeight: 'bold',
    backgroundColor:
      seatDetails[rowIndex * seatsPerRow + index]?.seatNo
        ? '#e74c3c'
        : seat.status.toLowerCase() === 'booked'
        ? '#ccc'
        : '#3498db',
    color: seat.status.toLowerCase() === 'booked' ? '#666' : '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    border: '1px solid #ddd',
    width: '60px', // Adjust the width as needed
  }}
>
  {seatDetails[rowIndex * seatsPerRow + index]?.seatNo ? (
    <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '10px', fontWeight: 'bold', color: '#fff' }} />
  ) : null}
</Button>

                  {/* Seat Number */}
                  <Typography
                    variant="subtitle2"
                    style={{
                      fontSize: '14px',
                      color: '#333',
                      fontWeight: 'bold',
                      position: 'absolute',
                      top: '-20px',
                    }}
                  >
                    {seat.seatNumber}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  

  return (
    <Layout>
      <Paper elevation={3} sx={{ maxWidth: '600px', margin: 'auto', textAlign: 'center', padding: '60px' }}>
        <Typography variant="h5" sx={{ color: 'black', marginBottom: '20px' }}>
          Select Your Seats
        </Typography>
        <form>{renderSeatGrid()}</form>
        <Typography variant="body2" sx={{ color: '#777', margin: '10px' }}>
          Time remaining: {timer} seconds
        </Typography>
        <Button
  variant="contained"
  color="primary"
  size="large"
  onClick={() => handleBookingCompletion()}
  sx={{ marginTop: '10px', backgroundColor: 'black' }}
>
  Proceed with Booking
</Button>

      </Paper>
    </Layout>
  );
};

export default Page3;