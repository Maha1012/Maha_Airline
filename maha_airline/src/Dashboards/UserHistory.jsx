import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const UserHistory = () => {
  const [userHistory, setUserHistory] = useState([]);
  const [flightSchedules, setFlightSchedules] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFlightScheduleByScheduleId = (scheduleId) => {
    return flightSchedules.find((schedule) => schedule.scheduleId === scheduleId);
  };

  const getAirportById = (airportId) => {
    return airports.find((airport) => airport.airportId === airportId);
  };

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      console.error('User ID not found in session storage');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const userHistoryResponse = await axios.get(`https://localhost:7124/api/UserHistory/${userId}`);
        setUserHistory(userHistoryResponse.data);

        const flightSchedulesResponse = await axios.get('https://localhost:7124/api/FlightSchedules');
        setFlightSchedules(flightSchedulesResponse.data);

        const airportsResponse = await axios.get('https://localhost:7124/api/Airports');
        setAirports(airportsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCancellation = async (bookingId) => {
    try {
      // Make an API call to update the booking status to 'Cancelled'
      const response = await axios.put(
        `https://localhost:7124/api/Booking/UpdateBooking/${bookingId}`,
        { status: 'Cancelled' }
      );

      // Parse the response data
    const responseData = JSON.parse(response.data);

      // Update the userHistory state to reflect the change
      setUserHistory((prevUserHistory) =>
        prevUserHistory.map((historyItem) =>
          historyItem.bookingId === bookingId
            ? { ...historyItem, bookingStatus: 'Cancelled' }
            : historyItem
        )
      );

      console.log('Booking cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto' }}>
      <Typography variant="h5" style={{ marginBottom: '20px' }}>
        User Profile
      </Typography>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h6" style={{ marginBottom: '10px' }}>
          User History
        </Typography>
        <TableContainer>
          <Table aria-label="user-history-table">
            <TableHead>
              <TableRow>
                <TableCell>Ticket No</TableCell>
                <TableCell>Booking ID</TableCell>
                <TableCell>Schedule ID</TableCell>
                <TableCell>Seat No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Booking Status</TableCell>
                <TableCell>Booking Type</TableCell>
                <TableCell>Flight Details</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userHistory.map((historyItem) => (
                <TableRow key={historyItem.ticketNo}>
                  <TableCell>{historyItem.ticketNo}</TableCell>
                  <TableCell>{historyItem.bookingId}</TableCell>
                  <TableCell>{historyItem.scheduleId}</TableCell>
                  <TableCell>{historyItem.seatNo}</TableCell>
                  <TableCell>{historyItem.name}</TableCell>
                  <TableCell>{historyItem.age}</TableCell>
                  <TableCell>{historyItem.gender}</TableCell>
                  <TableCell>{historyItem.bookingStatus}</TableCell>
                  <TableCell>{historyItem.bookingType}</TableCell>
                  <TableCell>
                    {getFlightScheduleByScheduleId(historyItem.scheduleId) ? (
                      <>
                        Flight Name: {getFlightScheduleByScheduleId(historyItem.scheduleId).flightName} <br />
                        Source Airport: {getAirportById(getFlightScheduleByScheduleId(historyItem.scheduleId).sourceAirportId)?.airportName} <br />
                        Destination Airport: {getAirportById(getFlightScheduleByScheduleId(historyItem.scheduleId).destinationAirportId)?.airportName} <br />
                        Flight Duration: {getFlightScheduleByScheduleId(historyItem.scheduleId).flightDuration} <br />
                        Date and Time: {getFlightScheduleByScheduleId(historyItem.scheduleId).dateTime}
                      </>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {historyItem.bookingStatus === 'booked' && (
                      <button
                        onClick={() => handleCancellation(historyItem.bookingId)}
                        disabled={historyItem.bookingStatus !== 'booked'}
                      >
                        Cancel
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default UserHistory;
