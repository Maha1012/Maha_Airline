import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CardHeader, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const UserHistoryForAdmin = () => {
  const [userBookingHistory, setUserBookingHistory] = useState([]);
  const [filteredUserBookingHistory, setFilteredUserBookingHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUserBookingHistory = async () => {
      try {
        // Make an API call to fetch user booking history
        const response = await axios.get('http://192.168.10.63:91/api/PartnerBookings');

        // Assuming the response data is an array of user booking history
        setUserBookingHistory(response.data);
        setFilteredUserBookingHistory(response.data); // Initialize filtered data with the full data
      } catch (error) {
        console.error('Error fetching user booking history:', error);
      }
    };

    // Call the function to fetch user booking history
    fetchUserBookingHistory();
  }, []);

  const cardStyle = {
    marginBottom: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: '10px',
  };

  const searchContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const inputBaseStyle = {
    flex: 1,
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '8px',
  };

  const searchButtonStyle = {
    background: '#2196F3',
    color: '#fff',
  };

//   const handleSearch = () => {
//     // Perform case-insensitive search logic
//     const searchTermLowerCase = searchTerm.toLowerCase();
//     console.log('Search Term:', searchTermLowerCase);
  
//     const filteredBookings = userBookingHistory.filter((booking) => {
//       const airlineNameLowerCase = booking.airlineName.toLowerCase();
//       console.log('Airline Name:', airlineNameLowerCase);
//       return airlineNameLowerCase.includes(searchTermLowerCase);
//     });
  
//     console.log('Filtered Bookings:', filteredBookings);
//     setFilteredUserBookingHistory(filteredBookings);
//   };
  


  return (
    <Box>
      {/* Search Bar */}
      <Typography variant="h4" sx={headingStyle} mb={2}>
        User Booking History
      </Typography>
      <Box sx={searchContainerStyle}>
        {/* <InputBase
          placeholder="Search by Airline Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={inputBaseStyle}
        />
        <IconButton onClick={handleSearch} sx={searchButtonStyle}>
          <SearchIcon />
        </IconButton> */}
      </Box>

      {/* Display User Booking History */}
      {filteredUserBookingHistory.map((booking) => (
        <Card key={booking.bookingId} sx={cardStyle}>
          <CardHeader title={`Booking ID: ${booking.bookingId}`} />
          <CardContent>
            <Typography>{`Airline Name: ${booking.airlineName}`}</Typography>
            <Typography>{`Flight Name: ${booking.flightName}`}</Typography>
            <Typography>{`Source Airport ID: ${booking.sourceAirportId}`}</Typography>
            <Typography>{`Destination Airport ID: ${booking.destinationAirportId}`}</Typography>
            <Typography>{`Status: ${booking.status}`}</Typography>
            <Typography>{`Seat No: ${booking.seatNo}`}</Typography>
            <Typography>{`Name: ${booking.name}`}</Typography>
            <Typography>{`Age: ${booking.age}`}</Typography>
            <Typography>{`Gender: ${booking.gender}`}</Typography>
            <Typography>{`Date and Time: ${booking.dateTime}`}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default UserHistoryForAdmin;
