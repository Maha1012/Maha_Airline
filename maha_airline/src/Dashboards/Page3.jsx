import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Page3 = () => {
  const [cookies, setCookie] = useCookies(['bookingData', 'selectedSeats']);
  const storedData = cookies['bookingData'];
  const [availableSeats, setAvailableSeats] = useState([]);
  const [seatDetails, setSeatDetails] = useState([]);
  const [timer, setTimer] = useState(50); // 300 seconds = 5 minutes
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);
  const navigate = useNavigate();
  const scheduleIds = Object.keys(storedData).filter(key => key.startsWith('scheduleId'));
  const [seatsFetched, setSeatsFetched] = useState(false); // New state to track seat fetching


  useEffect(() => {
    if (storedData.scheduleId && !seatsFetched) {
      setCurrentScheduleIndex(1);
      fetchAvailableSeats(); // Fetch seats for the initial schedule
    }
  }, [storedData.scheduleId, seatsFetched]);
  
  const fetchAvailableSeats = async () => {
    try {
      const currentScheduleIdKey = scheduleIds[currentScheduleIndex];
      const scheduleId = storedData[currentScheduleIdKey];
      
      console.log(`Fetching seats for scheduleId: ${scheduleId}`);
      
      const response = await axios.get(`https://localhost:7124/api/Seats/ByScheduleId/${scheduleId}`);
      const data = response.data;

      // Process the fetched data, set state, etc.
      setAvailableSeats(data || []);
      setSeatDetails(Array.from({ length: data.length }, () => ({ seatNo: null })));

      setSeatsFetched(true);
    } catch (error) {
      console.error('Error fetching available seats:', error);
    }
  };

  // useEffect(() => {
  //   if (storedData.scheduleId && !seatsFetched) {
  //     setCurrentScheduleIndex(0);
  //     fetchAvailableSeats(); // Fetch seats for the initial schedule
  //   }
  // }, [storedData.scheduleId, seatsFetched]);

  const handleBookingCompletion = async () => {
    try {
      await ChangeSeatStatus('unbooked');
      setCurrentScheduleIndex(currentScheduleIndex + 1);

      // Check if there are more schedules
      if (currentScheduleIndex < scheduleIds.length) {
        fetchAvailableSeats();
      }

      // Save selected seats to cookies
      const selectedSeats = seatDetails
        .filter((seat) => seat.seatNo !== null)
        .map((seat) => seat.seatNo);

      // Save seat details to bookingData cookie under seatDetails array
      const currentScheduleIdKey = scheduleIds[currentScheduleIndex - 1];
      const updatedBookingData = {
        ...storedData,
        seatDetails: [
          ...(storedData.seatDetails || []), // Preserve existing seat details
          { seatDetails: selectedSeats },
        ],
      };
  
      setCookie('bookingData', updatedBookingData);
  
          // If there are no more schedules, navigate to the final page
          if (currentScheduleIndex === scheduleIds.length) {
            navigate('/finalPage');
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

  useEffect(() => {
    // Set up the timer
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    // Clear the timer when it reaches 0
    if (timer === 0) {
      clearInterval(countdown);
      handleBookingCompletion();
    }

    // Clean up the interval when the component is unmounted
    return () => clearInterval(countdown);
  }, [timer]);

  const ChangeSeatStatus = async (status) => {
    try {
      const userId = sessionStorage.getItem('userId');
      const selectedSeats = seatDetails
        .filter((seat) => seat.seatNo !== null)
        .map((seat) => seat.seatNo);

      const currentScheduleIdKey = scheduleIds[currentScheduleIndex];
      const scheduleId = storedData[currentScheduleIdKey];

      const response = await axios.put(
        `https://localhost:7124/api/Integration/${scheduleId}/${status}`,
        JSON.stringify(selectedSeats),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSeatNoChange = (index, value) => {
    setSeatDetails((prev) => [
      ...prev.slice(0, index),
      { ...prev[index], seatNo: value },
      ...prev.slice(index + 1),
    ]);
  };

  const renderSeatGrid = () => {
    const passengerCount = cookies.passengerCount || 0;

    return (
      <div>
        <h3 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
          Select Your Seat for Your Flight {currentScheduleIndex + 0}
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
            gap: '10px',
          }}
        >
          {availableSeats.map((seat, index) => (
            <button
              key={index}
              onClick={() => handleSeatNoChange(index, seat.seatNumber)}
              disabled={seatDetails.some((s) => s.seatNo === seat.seatNumber)}
              style={{
                padding: '10px',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: seatDetails[index]?.seatNo ? '#e74c3c' : '#3498db',
                color: '#fff',
                borderRadius: '5px',
                cursor: 'pointer',
                marginBottom: '10px',
              }}
            >
              {seat.seatNumber}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center', padding: '20px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Select Your Seats</h2>
      <form>{renderSeatGrid()}</form>
      <p style={{ color: '#777', margin: '10px' }}>Time remaining: {timer} seconds</p>
      <button
        type="button"
        onClick={() => handleBookingCompletion()}
        style={{
          marginTop: '10px',
          padding: '15px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#3498db',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Continue
      </button>
    </div>
  );
};

export default Page3;
