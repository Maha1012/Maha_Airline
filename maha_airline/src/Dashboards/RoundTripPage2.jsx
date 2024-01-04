import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const RoundtripPage2 = () => {
  const [cookies, setCookie] = useCookies(['bookingData']);
  const storedData = cookies.bookingData;
  const navigate = useNavigate();
  const [passengerDetails, setPassengerDetails] = useState([]);

  useEffect(() => {
    const count = storedData?.passengerCount || 0;
    // Initialize passengerDetails array based on the passenger count
    const initialPassengerDetails = Array.from({ length: count }, (_, index) => ({
      name: '',
      age: '',
      gender: '',
    }));
    setPassengerDetails(initialPassengerDetails);
  }, [storedData?.passengerCount]);

  const handleNext = () => {
    // Validate passenger details before proceeding
    if (passengerDetails.some((details) => !details.name || !details.age || !details.gender)) {
      console.error('Please fill in all passenger details');
      return;
    }

    // Update the existing bookingData cookie with passengerDetails
    const updatedBookingData = {
      ...storedData,
      passengerDetails: passengerDetails.map((details) => ({
        name: details.name,
        age: details.age,
        gender: details.gender,
      })),
    };

    setCookie('bookingData', updatedBookingData);

    navigate('/RoundTripPage3'); // Redirect to Page3
  };

  return (
    <Layout>
    <div style={styles.container}>
      <h2 style={styles.heading}>Enter Your Personal Details</h2>
      <form>
        {passengerDetails.map((passenger, index) => (
          <div key={index} style={styles.passengerContainer}>
            <h3 style={styles.passengerHeading}>Passenger {index + 1}</h3>
            <label style={styles.label}>
              Name:
              <input
                type="text"
                value={passenger.name}
                onChange={(e) =>
                  setPassengerDetails((prev) => updateArray(prev, index, { ...prev[index], name: e.target.value }))
                }
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Age:
              <input
                type="number"
                value={passenger.age}
                onChange={(e) => {
                  const enteredAge = parseInt(e.target.value, 10);
                  if (enteredAge >= 0) {
                    setPassengerDetails((prev) => updateArray(prev, index, { ...prev[index], age: enteredAge }));
                  } else {
                    // Display an error message or handle the validation error accordingly
                    console.error('Age cannot be less than 0');
                  }
                }}
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
  Gender:
  <select
  value={passenger.gender || ''}  
  onChange={(e) =>
    setPassengerDetails((prev) => updateArray(prev, index, { ...prev[index], gender: e.target.value }))
  }
  style={styles.input}
>
  <option value=""></option>
  <option value="male">Male</option>
  <option value="female">Female</option>
  <option value="other">Other</option>
</select>
</label>
          </div>
        ))}
        <button type="button" onClick={handleNext} style={styles.nextButton}>
        Proceed to seat Bookings
        </button>
      </form>
    </div>
    </Layout>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    textAlign: 'center',
    padding: '60px',
    background: '#f8f8f8',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    minHeight: 'calc(100vh - 80px)',
    marginTop:'10px',
  },
  heading: {
    color: 'black',
    marginBottom: '20px',
    fontSize: '30px',
    fontWeight: 'bold',
  },
  passengerContainer: {
    marginBottom: '20px',
  },
  passengerHeading: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#333',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    outline: 'none',
  },
  nextButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: 'black',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
};

export default RoundtripPage2;

// Helper function to update an element in an array
function updateArray(arr, index, newItem) {
  return arr.map((item, i) => (i === index ? newItem : item));
}
