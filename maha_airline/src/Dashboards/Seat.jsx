import React from 'react';

const Seat = ({ seat, index, handleSeatNoChange, seatDetails }) => {
  return (
    <div
  onClick={() => handleSeatNoChange(index, seat.seatNumber)}
  disabled={
    seatDetails.some((s) => s.seatNo === seat.seatNumber) ||
    seat.status.toLowerCase() === 'booked'
  }
  className={`seat-button ${
    seatDetails[index]?.seatNo ? 'selected' : seat.status.toLowerCase() === 'booked' ? 'booked' : ''
  }`}
>
  {seat.seatNumber}
</div>
  );
};

export default Seat;

