import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Page2 = () => {
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

    navigate('/page3'); // Redirect to Page3
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Page 2</h2>
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
              <input
                type="text"
                value={passenger.gender}
                onChange={(e) =>
                  setPassengerDetails((prev) => updateArray(prev, index, { ...prev[index], gender: e.target.value }))
                }
                style={styles.input}
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={handleNext} style={styles.nextButton}>
          Next
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    textAlign: 'center',
    padding: '20px',
    background: '#f8f8f8',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    color: '#3498db',
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
    padding: '15px 20px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
};

export default Page2;

// Helper function to update an element in an array
function updateArray(arr, index, newItem) {
  return arr.map((item, i) => (i === index ? newItem : item));
}
