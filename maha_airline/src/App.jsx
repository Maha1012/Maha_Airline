import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Slideshow from './Slideshow';
import Home from './Home';
import Login from './Components/Login';
import Registration from './Components/Registration';
import FlightDetails from './Dashboards/FlightDetails';
import AirportManagement from './Dashboards/AirportManagment';
import FlightScheduleManagement from './Dashboards/FlightScheduleManagement';
import BookingForm from './Dashboards/BookingForm';
import Page1 from './Dashboards/Page1';
import Page2 from './Dashboards/Page2';
import Page3 from './Dashboards/Page3';
import FinalPage from './Dashboards/FinalPage';
import ConfirmationPage from './Dashboards/ConfirmationPage';
import ConnectingFlightsPage from './Dashboards/ConnectingFlights';
import Page2ConnectingFlights from './Dashboards/Page2ConnectingFlights';


function App() {
  return (
    <Router>
      
        
        <style>
          {`
            body {
              //background-color: black;
              margin: 0;
              overflow-x: hidden;
            }
          `}
        </style>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/FlightDetails" element={<FlightDetails />} />
            <Route path="/AirportManagement" element={<AirportManagement />} />
            <Route path="/FlightScheduleManagement" element={<FlightScheduleManagement />} />
            <Route path="/BookingForm" element={<BookingForm />} />
            <Route path="/Page1" element={<Page1 />} />
            <Route path="/Page2" element={<Page2 />} />
            <Route path="/Page3" element={<Page3 />} />
            <Route path="/FinalPage" element={<FinalPage />} />
            <Route path="/ConfirmationPage" element={<ConfirmationPage />} />
            <Route path="/ConnectingFlightsPage" element={<ConnectingFlightsPage />} />
            <Route path="/Page2ConnectingFlights" element={<Page2ConnectingFlights />} />
            
          </Routes>
        </div>
      
    </Router>
  );
}

export default App;
