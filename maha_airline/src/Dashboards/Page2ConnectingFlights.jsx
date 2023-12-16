// Page2.js
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Page2 = () => {
  const [cookies, setCookie] = useCookies(['passengerCount']);
  const storedData = cookies.passengerCount;
  const navigate = useNavigate();
  const [passengerDetails, setPassengerDetails] = useState([]);


  useEffect(() => {
    const count = cookies.passengerCount || 0;
    const existingBookingData = cookies['bookingData'];
    // Update the passenger details
const updatedPassengerDetails = passengerDetails.map((details) => ({
  name: details.name,
  age: details.age,
  gender: details.gender,
}));
    
    // Merge the existing booking data with the updated passenger details
const updatedBookingData = {
  ...existingBookingData,
  passengerDetails: updatedPassengerDetails,
};
    // Initialize passengerDetails array based on the passenger count
    const initialPassengerDetails = Array.from({ length: count }, (_, index) => ({
      name: '',
      age: '',
      gender: '',
    }));
    setPassengerDetails(initialPassengerDetails);
  }, [cookies.passengerCount]);
  
  
 const handleNext = () => {
  // Validate passenger details before proceeding
  if (passengerDetails.some((details) => !details.name || !details.age || !details.gender)) {
    console.error('Please fill in all passenger details');
    return;
  }

  /// Fetch the existing booking data from the cookie
const existingBookingData = cookies['bookingData'];

// Update the passenger details
const updatedPassengerDetails = passengerDetails.map((details) => ({
  name: details.name,
  age: details.age,
  gender: details.gender,
}));

// Merge the existing booking data with the updated passenger details
const updatedBookingData = {
  ...existingBookingData,
  passengerDetails: updatedPassengerDetails,
};


// Update the cookie with the merged data
setCookie('bookingData', updatedBookingData);

// Redirect to Page3
navigate('/page3');

};


  return (
    <div>
      <h2>Page 2</h2>
      <form>
        {passengerDetails.map((passenger, index) => (
          <div key={index}>
            <h3>Passenger {index + 1}</h3>
            <label>
              Name:
              <input
                type="text"
                value={passenger.name}
                onChange={(e) =>
                  setPassengerDetails((prev) => updateArray(prev, index, { ...prev[index], name: e.target.value }))
                }
              />
            </label>
            <label>
              Age:
              <input
                type="number"
                value={passenger.age}
                onChange={(e) =>
                  setPassengerDetails((prev) => updateArray(prev, index, { ...prev[index], age: e.target.value }))
                }
              />
            </label>
            <label>
              Gender:
              <input
                type="text"
                value={passenger.gender}
                onChange={(e) =>
                  setPassengerDetails((prev) => updateArray(prev, index, { ...prev[index], gender: e.target.value }))
                }
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={handleNext}>
          Next
        </button>
      </form>
    </div>
  );
};

export default Page2;

// Helper function to update an element in an array
function updateArray(arr, index, newItem) {
  return arr.map((item, i) => (i === index ? newItem : item));
}
