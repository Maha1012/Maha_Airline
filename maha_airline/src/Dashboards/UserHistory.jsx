import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        const response = await axios.get(`https://localhost:7124/api/UserHistory/ByBookingsUserId/${userIdFromSession}`);
        setUserHistory(response.data);
      } catch (error) {
        console.error('Error fetching user history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory();
  }, []);

  const handleCancellation = async (bookingId) => {
    try {
      await axios.patch(`https://localhost:7124/api/UserHistory/Cancelation/${bookingId}`);

      // Update the userHistory state to reflect the change
      setUserHistory((prevUserHistory) =>
        prevUserHistory.map((historyItem) =>
          historyItem.bookingId === bookingId
            ? { ...historyItem, status: 'Cancelled' }
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
    <div>
      <h1>User History</h1>
      <ul>
        {userHistory.map((historyItem) => (
          <li key={historyItem.bookingId}>
            <p>
              Booking ID: {historyItem.bookingId}, Status: {historyItem.status}, User ID: {historyItem.userId}, Booking Type: {historyItem.bookingType}
            </p>
            {historyItem.status === 'Cancelled' ? (
              <p>This booking is already cancelled.</p>
            ) : (
              <button onClick={() => handleCancellation(historyItem.bookingId)}>Cancel Booking</button>
            )}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserHistory;
