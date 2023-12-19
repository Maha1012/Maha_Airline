import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Page3 = () => {
  const [cookies, setCookie] = useCookies(['bookingData']);
  const storedData = cookies['bookingData'];
  const [availableSeats, setAvailableSeats] = useState([]);
  const [seatDetails, setSeatDetails] = useState([]);
  const newScheduleId = localStorage.getItem('newScheduleId');

  const [timer, setTimer] = useState(50); // 300 seconds = 5 minutes
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);
  const navigate = useNavigate();

  const fetchAvailableSeats = async () => {
    try {
      let scheduleId = storedData.scheduleId;
      const newScheduleId = localStorage.getItem('newScheduleId');

console.log('New Schedule ID from localStorage:', newScheduleId);

if (newScheduleId !== null && newScheduleId !== undefined) {
  scheduleId = newScheduleId;
}

  
      console.log('Fetching seats for scheduleId:', scheduleId);
  
      const response = await axios.get(`https://localhost:7124/api/Seats/ByScheduleId/${scheduleId}`);
      const data = response.data;
      setAvailableSeats(data || []);
      setSeatDetails(Array.from({ length: data.length }, () => ({ seatNo: null })));
    } catch (error) {
      console.error('Error fetching available seats:', error);
    }
  };
  
  
  useEffect(() => {
    if (storedData.scheduleId) {
      setCurrentScheduleIndex(0);
      fetchAvailableSeats(); // Fetch seats for the initial schedule
    }
  }, [storedData.scheduleId]);

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
      ChangeSeatStatus('unbooked');
    }

    // Clean up the interval when the component is unmounted
    return () => clearInterval(countdown);
  }, [timer]);

  const handleBookingCompletion = async () => {
    await ChangeSeatStatus('unbooked');
    setCurrentScheduleIndex((scheduleIndex) => scheduleIndex + 1);
    setTimer(50); // Reset the timer for the next schedule
    fetchAvailableSeats(); // Fetch seats for the next schedule
  };

  const ChangeSeatStatus = async (status) => {
    try {
      const userId = sessionStorage.getItem('userId');
      const selectedSeats = seatDetails
        .filter((seat) => seat.seatNo !== null)
        .map((seat) => seat.seatNo);

        let scheduleId = storedData.scheduleId;
      const newScheduleId = localStorage.getItem('newScheduleId');
      
      console.log('New Schedule ID from localStorage:', newScheduleId);
  
      if (newScheduleId) {
        scheduleId = newScheduleId;
      }


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

      if (status === 'booked') {
        // Redirect to the final page with booking details
        // navigate('/finalPage', { state: { bookingDetails: /* your booking details data */ } });
      }
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

  const handleSubmit = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const newPassengerCount = cookies.passengerCount || 0;
      const selectedSeats = seatDetails.filter((seat) => seat.seatNo !== null);
      setCookie('bookingData', {
        ...storedData,
        seatDetails: selectedSeats,
      });

      const combinedData = {
        status: 'booked',
        bookingType: 'oneway',
        userId: userId,
        seatDetails: selectedSeats.map((seat, index) => {
          const scheduleIdIndex = Math.floor(index / newPassengerCount);
          const seatIndex = index % newPassengerCount;
          const scheduleIdKey =
            scheduleIdIndex === 0 ? 'scheduleId' : `scheduleId${scheduleIdIndex}`;

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

      if (timer > 0) {
        await ChangeSeatStatus('booked');
      } else {
        handleBookingCompletion();
      }
    } catch (error) {
      console.error('Error during booking submission:', error);
    }
  };

  const handleNextButtonClick = async () => {
    try {
      const scheduleIds = Object.keys(storedData).filter((key) =>
        key.startsWith('scheduleId')
      );
      const totalPassengers = cookies.passengerCount || 0;
      const totalSchedules = scheduleIds.length;
  
      const remainingSchedules = totalSchedules - currentScheduleIndex;
  
      if (remainingSchedules > 0) {
        // Check if the current passenger has booked seats for the current schedule
        const seatsBooked = seatDetails.filter((seat) => seat.seatNo !== null).length;
        if (seatsBooked < totalPassengers) {
          alert(`Please select seats for all passengers for the current schedule.`);
          return;
        }
  
        // Log the current schedule ID
        const currentScheduleIdKey = `scheduleId${currentScheduleIndex}`;
        const currentScheduleId = storedData[currentScheduleIdKey];
        console.log('Current Schedule ID:', currentScheduleId);
  
        // Change seat status
    const status = 'booked';
    const userId = sessionStorage.getItem('userId');
    const selectedSeats = seatDetails
      .filter((seat) => seat.seatNo !== null)
      .map((seat) => seat.seatNo);
    // Store the selected seats in the cookies
    setCookie('bookingData', {
      ...storedData,
      seatDetails: selectedSeats,
    });
  
        const scheduleId = storedData.scheduleId;
        console.log('API Path Schedule ID Before:', scheduleId);
  
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
  
    // Log the new schedule ID after updating the index
setCurrentScheduleIndex((index) => index + 1);
localStorage.setItem('newScheduleId', newScheduleId);

// Use the updated state in the callback function
const newScheduleIdKey = `scheduleId${currentScheduleIndex + 1}`;
const newScheduleId = storedData[newScheduleIdKey];
console.log('New Schedule ID:', newScheduleId);


console.log('API Path Schedule ID After:', newScheduleId);

setTimer(50); // Reset the timer for the next schedule
fetchAvailableSeats(); // Fetch seats for the next schedule

      } 
    } catch (error) {
      console.error('Error during booking submission:', error);
    }
  };
  
  

  const renderSeatGrid = () => {
    const scheduleIds = Object.keys(storedData).filter((key) =>
      key.startsWith('scheduleId')
    );
    const isMultiFlight = scheduleIds.length > 1;
  
    const currentScheduleIdKey = `scheduleId${currentScheduleIndex}`;
    const currentScheduleId = storedData[currentScheduleIdKey];
  
    const passengerCount = cookies.passengerCount || 0;
  
    return (
      <div>
        {isMultiFlight && (
          <h3 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
            Select Your Seat for Schedule {currentScheduleIndex + 1}
          </h3>
        )}
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
                marginBottom: '10px', // Add margin to separate seats vertically
              }}
            >
              {seat.seatNumber}
            </button>
          ))}
        </div>
        {isMultiFlight && (
          <div>
            <button
              type="button"
              onClick={async () => {
                await handleNextButtonClick();
                await ChangeSeatStatus('booked');
              }}
              disabled={currentScheduleIndex === scheduleIds.length - 1}
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
                marginRight: '10px',
              }}
            >
              Next
            </button>
            {currentScheduleIndex === scheduleIds.length - 1 && (
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  marginTop: '10px',
                  padding: '15px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: '#2ecc71',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Confirm Booking
              </button>
            )}
          </div>
        )}
      </div>
    );
  };
  

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center', padding: '20px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Page 3</h2>
      <form>{renderSeatGrid()}</form>
      <p style={{ color: '#777', margin: '10px' }}>Time remaining: {timer} seconds</p>
      <button
        type="button"
        onClick={async () => {
          await handleNextButtonClick();
          await ChangeSeatStatus('booked');
        }}
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
        Next
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        style={{
          marginTop: '10px',
          padding: '15px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#2ecc71',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default Page3;
