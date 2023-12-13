// BookingForm.js
import React, { useState } from 'react';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleNext = () => setStep(step + 1);

  const handleFinalSubmit = async () => {
    // Retrieve data from local storage
    const bookingDataString = sessionStorage.getItem('bookingData');
    const bookingData = bookingDataString ? JSON.parse(bookingDataString) : null;

    // Perform the final submission (POST request) using the data

    // Clear local storage after submission
    sessionStorage.removeItem('bookingData');

    // Navigate to a thank you or confirmation page
    navigate('/confirmation');
  };

  return (
    <div style={{ color: 'white' }}>
      {step === 1 && <Page1 onNext={handleNext} />}
      {step === 2 && <Page2 onNext={handleNext} />}
      {step === 3 && <Page3 onSubmit={handleFinalSubmit} />}
    </div>
  );
};

export default BookingForm;
