import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Collapse,
  Paper,
  Box,
  
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './Layout';
import jsPDF from 'jspdf';
import { Download as DownloadIcon } from '@mui/icons-material';


const handleDownloadTicket = async (ticket) => {
  try {
    const pdf = new jsPDF();
    pdf.text(`Ticket No: ${ticket.TicketNo}`, 10, 10);
    pdf.text(`Schedule ID: ${ticket.ScheduleId}`, 10, 20);
    pdf.text(`Seat No: ${ticket.SeatNo}`, 10, 30);
    pdf.text(`Name: ${ticket.Name}`, 10, 40);
    pdf.text(`Age: ${ticket.Age}`, 10, 50);
    pdf.text(`Gender: ${ticket.Gender}`, 10, 60);
    pdf.text(`Status: ${ticket.TicketStatus}`, 10, 70);

    // Save the PDF
    pdf.save(`Ticket_${ticket.TicketNo}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

const UserHistory = () => {
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userIdFromSession = sessionStorage.getItem('userId');

    if (!userIdFromSession) {
      console.error('User ID not found in session storage');
      setLoading(false);
      return;
    }

    const fetchUserHistory = async () => {
      try {
        // Retrieve the token from session storage
    const token = sessionStorage.getItem('Token');

    const response = await axios.get(`http://192.168.10.63:91/api/UserHistory/ByBookingsUserId/${userIdFromSession}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
        setUserHistory(response.data);
      } catch (error) {
        console.error('Error fetching user history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory();
  }, []);

  // const updateSeatStatus = async (scheduleId, status) => {
  //   try {
  //     console.log('Updating seat status...', scheduleId, status);
  //     const response = await axios.patch(`https://localhost:7124/api/Seats/ByScheduleId/${scheduleId}/${status}`);
  //     console.log('Seat status updated:', response.data);
  //   } catch (error) {
  //     console.error(`Error updating seat status for scheduleId ${scheduleId}:`, error);
  //   }
  // };


  const updateSeatStatusIntegration = async (scheduleId, seatNo, status) => {
    try {
      const token = sessionStorage.getItem('Token');
      const response = await axios.patch(
        `http://192.168.10.63:91/api/Integration/changeseatstatus/${scheduleId}/${seatNo}/${status}`,
        null,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // Include this header if needed
          },
        }
      );
      console.log('Seat status in integration updated:', response.data);
    } catch (error) {
      console.error(`Error updating seat status in integration for scheduleId ${scheduleId}:`, error);
    }
  };

  const handleCancellation = async (bookingId, scheduleId) => {
    try {
      // Retrieve the token from session storage
      const token = sessionStorage.getItem('Token');

    await axios.patch(
      `http://192.168.10.63:91/api/UserHistory/Cancelation/${bookingId}`,
      null,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Include this header if needed
        },
      }
    );
      setUserHistory((prevUserHistory) =>
        prevUserHistory.map((historyItem) =>
          historyItem.bookingId === bookingId
            ? {
                ...historyItem,
                status: 'Cancelled',
                flightTickets: historyItem.flightTickets
                  ? historyItem.flightTickets.map((ticket) => ({
                      ...ticket,
                      TicketStatus: 'Cancelled',
                    }))
                  : [],
              }
            : historyItem
        )
      );

      toast.success('Booking canceled successfully!');

      // Automatically update seat status to 'Available'
      if (scheduleId) {
        // Assuming seatNo is part of the ticket information
        const seatNo = historyItem?.flightTickets?.[0]?.SeatNo; // Adjust this based on your actual data structure
        const status = 'Available';
        if (seatNo) {
          await updateSeatStatusIntegration(scheduleId, seatNo, status);
        }
      }

      console.log('Booking canceled successfully!');
    } catch (error) {
      toast.error('Error canceling booking.');
      console.error('Error canceling booking:', error);
    }
  };


  const handleConnectionTicketCancellation = async (ticketNo) => {
    try {
      // Retrieve the token from session storage
      const token = sessionStorage.getItem('Token');
  
      // Make an API call to cancel connection flight ticket
      await axios.patch(
        `http://192.168.10.63:91/api/UserHistory/Cancelation/ConnectingFlightByTicketNo/${ticketNo}`,
        null,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Update the user history state to reflect the cancellation
      setUserHistory((prevUserHistory) =>
        prevUserHistory.map((historyItem) => {
          if (
            historyItem.connectionFlightTickets &&
            historyItem.connectionFlightTickets.some((ticket) => ticket.ticketNo === ticketNo)
          ) {
            return {
              ...historyItem,
              connectionFlightTickets: historyItem.connectionFlightTickets.map((ticket) =>
                ticket.ticketNo === ticketNo
                  ? {
                      ...ticket,
                      ticketStatus: 'Cancelled',
                    }
                  : ticket
              ),
            };
          } else {
            return historyItem;
          }
        })
      );
  
      toast.success('Connection Ticket canceled successfully!');
    } catch (error) {
      toast.error('Error canceling connection ticket.');
      console.error('Error canceling connection ticket:', error);
    }
  };

 
  const handleTicketCancellation = async (ticketNo, bookingId, scheduleId) => {
    try {
      const token = sessionStorage.getItem('Token');
      await axios.patch(
        `http://192.168.10.63:91/api/UserHistory/Cancelation/ByTicketNo/${ticketNo}`,
        null,  // No request body, pass null
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // Include this header if needed
          },
        }
      );

      setUserHistory((prevUserHistory) =>
        prevUserHistory.map((historyItem) =>
          historyItem.bookingId === bookingId
            ? {
                ...historyItem,
                flightTickets: historyItem.flightTickets
                  ? historyItem.flightTickets.map((ticket) =>
                      ticket.TicketNo === ticketNo
                        ? {
                            ...ticket,
                            TicketStatus: 'Cancelled',
                          }
                        : ticket
                    )
                  : [],
              }
            : historyItem
        )
      );

      toast.success('Ticket canceled successfully!');

      // Automatically update seat status to 'Available'
      if (scheduleId) {
        // Assuming seatNo is part of the ticket information
        const seatNo = historyItem?.flightTickets?.[0]?.SeatNo; // Adjust this based on your actual data structure
        const status = 'Available';
        if (seatNo) {
          await updateSeatStatusIntegration(scheduleId, seatNo, status);
        }
      }

      console.log('Ticket canceled successfully!');
    } catch (error) {
      toast.error('Error canceling ticket.');
      console.error('Error canceling ticket:', error);
    }
  };

  const handleViewDetails = async (bookingId) => {
    try {
      // Retrieve the token from session storage
      const token = sessionStorage.getItem('Token');
  
      // Make an API call to get flight ticket details
      try {
        const flightTicketsResponse = await axios.get(
          `http://192.168.10.63:91/api/UserHistory/GetFlightTickets?bookingId=${bookingId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json', // Include this header if needed
            },
          }
        );
  
        if (flightTicketsResponse.data && flightTicketsResponse.data.length > 0) {
          // Flight tickets found in the API response
          const updatedUserHistory = userHistory.map((historyItem) =>
            historyItem.bookingId === bookingId
              ? {
                  ...historyItem,
                  showDetails: !historyItem.showDetails,
                  flightTickets: flightTicketsResponse.data.map((ticket) => ({
                    TicketNo: ticket.ticketNo,
                    ScheduleId: ticket.scheduleId,
                    SeatNo: ticket.seatNo,
                    Name: ticket.name,
                    Age: ticket.age,
                    Gender: ticket.gender,
                    TicketStatus: ticket.ticketStatus,
                  })),
                }
              : historyItem
          );
          setUserHistory(updatedUserHistory);
          return; // Exit the function since flight tickets are found
        }
      } catch (flightTicketsError) {
        console.error('Error fetching flight ticket details:', flightTicketsError);
      }
  
      // If no flight tickets found in the first API response, make a call to the second API
      const connectionFlightTicketsResponse = await axios.get(
        `http://192.168.10.63:91/api/UserHistory/GetConnectionFlightTicketsByBookingId/${bookingId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (connectionFlightTicketsResponse.data && connectionFlightTicketsResponse.data.length > 0) {
        // Connection flight tickets found in the second API response
        const updatedUserHistory = userHistory.map((historyItem) =>
          historyItem.bookingId === bookingId
            ? {
                ...historyItem,
                showDetails: !historyItem.showDetails,
                flightTickets: [], // Set flightTickets to an empty array as no flight tickets are found
                connectionFlightTickets: connectionFlightTicketsResponse.data,
              }
            : historyItem
        );
        setUserHistory(updatedUserHistory);
      } else {
        // No flight tickets found in both APIs, handle it as needed
        console.error('No flight tickets found in both APIs for bookingId:', bookingId);
        // You may want to show an error message or handle it based on your requirements
      }
    } catch (error) {
      console.error('Error fetching flight ticket details:', error);
      // Handle error as needed
    }
  };
  
  

  // if (loading) {
  //   return <CircularProgress style={{ margin: '20px' }} />;
  // }

  if (loading) {
    return <CircularProgress style={{ margin: '20px' }} />;
  }


  

  return (
    <Layout>
      <Box p={2}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Your Bookings
        </Typography>

        <List>
          {userHistory.map((historyItem) => (
            <Paper elevation={3} key={historyItem.bookingId} style={{ marginBottom: '10px' ,padding:'40px' }}>
              <ListItem>
                <ListItemText
                  primary={`Booking ID: ${historyItem.bookingId}`}
                  secondary={`Status: ${historyItem.status}, User ID: ${historyItem.userId}, Booking Type: ${historyItem.bookingType}`}
                />
                {historyItem.status === 'Cancelled' ? (
                  <Typography variant="body2" color="textSecondary">
                    This booking is already cancelled.
                  </Typography>
                ) : (
                  <ListItemSecondaryAction>
                    <Button
  variant="contained"
  color="primary"
  onClick={() => handleViewDetails(historyItem.bookingId)}
  endIcon={historyItem.showDetails ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
  style={{
     // Change the background color
    color: 'white',             // Change the text color
    marginRight: 8,             // Add some right margin for spacing
    // width: '5px',             // Set the width to 120 pixels
    height: '20px',             // Set the height to 40 pixels
  }}
>
{historyItem.showDetails ? 'Hide Details' : 'Show Details'}
</Button>

                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleCancellation(historyItem.bookingId, historyItem.scheduleId)}
                    >
                      <DeleteIcon style={{ color: '#e53935' }} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="download"
                      onClick={() => handleDownloadTicket(historyItem.flightTickets[0])}
                    >
                      <DownloadIcon style={{ color: '#2196f3' }} />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              <Collapse in={historyItem.showDetails} timeout="auto" unmountOnExit>
                <Divider />
                {historyItem.flightTickets && (
                  <List>
                    {historyItem.flightTickets.map((ticket) => (
                      <React.Fragment key={ticket.TicketNo}>
                        <ListItem>
                          <ListItemText
                            primary={`Ticket No: ${ticket.TicketNo}`}
                            secondary={`Schedule ID: ${ticket.ScheduleId}, Seat No: ${ticket.SeatNo}, Name: ${ticket.Name}, Age: ${ticket.Age}, Gender: ${ticket.Gender}, Status: ${ticket.TicketStatus}`}
                          />
                          {!ticket.TicketStatus || ticket.TicketStatus !== 'Cancelled' ? (
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() =>
                                  handleTicketCancellation(ticket.TicketNo, historyItem.bookingId, historyItem.scheduleId)
                                }
                              >
                                <DeleteIcon style={{ color: '#e53935' }} />
                              </IconButton>
                            </ListItemSecondaryAction>
                          ) : null}
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                )}
                {historyItem.connectionFlightTickets && (
  <List>
    {historyItem.connectionFlightTickets.map((connectionTicket) => (
      <React.Fragment key={connectionTicket.ticketNo}>
        <ListItem>
          <ListItemText
            primary={`Connection Ticket No: ${connectionTicket.ticketNo}`}
            secondary={`Flight Name: ${connectionTicket.flightName}, Source Airport: ${connectionTicket.sourceAirportId}, Destination Airport: ${connectionTicket.destinationAirportId}, Seat No: ${connectionTicket.seatNo}, Name: ${connectionTicket.name}, Age: ${connectionTicket.age}, Gender: ${connectionTicket.gender}, Date & Time: ${connectionTicket.dateTime}, Airline Name: ${connectionTicket.airlineName}, Status: ${connectionTicket.ticketStatus}`}
          />
        </ListItem>
        <Divider />
      </React.Fragment>
    ))}
  </List>
)}
              </Collapse>
            </Paper>
          ))}
          
        </List>
      </Box>
    </Layout>
  );
};

export default UserHistory;