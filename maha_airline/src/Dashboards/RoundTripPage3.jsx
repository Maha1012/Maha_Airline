import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { airlinesapi } from '../constants';
import Layout from './Layout';
import { Button, Grid, Paper, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const RoundTripPage3 = () => {
  const [cookies, setCookie] = useCookies(['bookingData', 'selectedSeats']);
  const storedData = cookies['bookingData'];
  const [availableSeats, setAvailableSeats] = useState([]);
  const [seatDetails, setSeatDetails] = useState([]);
  const [timer, setTimer] = useState(50); // 300 seconds = 5 minutes
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);
  const navigate = useNavigate();
  const scheduleIds = Object.keys(storedData).filter(key => key.startsWith('scheduleId'));
  const [seatsFetched, setSeatsFetched] = useState(false);

  useEffect(() => {
    if (storedData.scheduleId && !seatsFetched) {
      setCurrentScheduleIndex(0);
      fetchAvailableSeats();
    }
  }, [storedData.scheduleId, seatsFetched]);

  const fetchAvailableSeats = async () => {
    try {
      const scheduleId = localStorage.getItem('scheduleId');
      const token = sessionStorage.getItem('Token'); // Replace 'Token' with the actual key used to store the token

    const response = await axios.get(`http://192.168.10.63:91/api/Seats/ByScheduleId/${scheduleId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // You can include other headers as needed
      },
    });
      
      const data = response.data;

      setAvailableSeats(data || []);
      setSeatDetails(Array.from({ length: data.length }, () => ({ seatNo: null })));

      setSeatsFetched(true);
    } catch (error) {
      console.error('Error fetching available seats:', error);
    }
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    if (timer === 0) {
      clearInterval(countdown);
      handleBookingCompletion();
    }

    return () => clearInterval(countdown);
  }, [timer]);

  const handleBookingCompletion = async () => {
    try {
      await ChangeSeatStatus('Booked');
      setCurrentScheduleIndex(currentScheduleIndex + 1);
  
      // Check if there are more schedules
      if (currentScheduleIndex < scheduleIds.length) {
        fetchAvailableSeats();
      } else {
        // Fetch seats for newScheduleId after completing booking for the initial schedule
        const newScheduleId = localStorage.getItem('newScheduleId');
  
        if (newScheduleId) {
          console.log('Fetching seats for newScheduleId:', newScheduleId);
  
          const token = sessionStorage.getItem('Token'); // Replace 'Token' with the actual key used to store the token

        const partnerSeatsUrl = `http://192.168.10.63:91/api/Seats/ByScheduleId/${newScheduleId}`;
        const partnerResponse = await axios.get(partnerSeatsUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // You can include other headers as needed
          },
        });
          const partnerData = partnerResponse.data;
  
          setAvailableSeats((prevSeats) => [...prevSeats, ...partnerData]);
          setSeatDetails((prevDetails) => [
            ...prevDetails,
            ...Array.from({ length: partnerData.length }, () => ({ seatNo: null })),
          ]);
        } else {
          console.log('Invalid newScheduleId');
        }
  
        // Save information to local storage or state to track the current schedule index
        const nextScheduleIndex = currentScheduleIndex + 1;
        localStorage.setItem('currentScheduleIndex', nextScheduleIndex);
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
        const airlineName = localStorage.getItem('airlineName');
        navigate('/RoundTripFinalPage');
  
        // Log the airlineName to check its value
        console.log('Airline Name:', airlineName);
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
  
  const handleSeatNoChange = (index, value) => {
    setSeatDetails((prev) => [
      ...prev.slice(0, index),
      { ...prev[index], seatNo: value },
      ...prev.slice(index + 1),
    ]);
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
                      seatDetails[rowIndex * seatsPerRow + index]?.seatNo ||
                      seat.status.toLowerCase() === 'booked' ||
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
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center', padding: '60px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}></h2>
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
           backgroundColor: 'black',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
         Proceed with Booking
      </button>
    </div>
    </Layout>
  );
};

export default RoundTripPage3;
