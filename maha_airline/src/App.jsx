import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Slideshow from './Slideshow';
import Home from './Home';
import Layout from './Dashboards/Layout';
import TopLayout from './Dashboards/Toplayout';
import Login from './Components/Login';
import Registration from './Components/Registration';
import FlightDetails from './Dashboards/FlightDetails';
import AirportManagement from './Dashboards/AirportManagment';
import FlightScheduleManagement from './Dashboards/FlightScheduleManagement';
import UserHistoryForAdmin from './Dashboards/UserHistoryForAdmin';
import BookingForm from './Dashboards/BookingForm';
import Page1 from './Dashboards/Page1';
import Page2 from './Dashboards/Page2';
import Page3 from './Dashboards/Page3';
import FinalPage from './Dashboards/FinalPage';
import ConfirmationPage from './Dashboards/ConfirmationPage';
import ConnectingFlightsPage from './Dashboards/ConnectingFlights';
import Page2ConnectingFlights from './Dashboards/Page2ConnectingFlights';
import AdminHome from './Dashboards/AdminHome';
import Header from './Header';
import UserHistory from './Dashboards/UserHistory';
import UserHomePage from './Dashboards/UserHomepage';
import ChangePassword from './Components/ChangePassword';
import Roundtrip from './Dashboards/Roundtrip';
import PartnerBookingFinalPage from './Dashboards/PartnerBookingfinalPage';
import RoundtripPage2 from './Dashboards/RoundTripPage2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RoundtripPage3 from './Dashboards/RoundTripPage3';
import RoundTripFinalPage from './Dashboards/RoundtripfinalPage';
import GradientBackground from './Components/GradientBackground';
import Footer from './Dashboards/Footer';



function App() {
  return (
    <Router>
      <GradientBackground>
      
        
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
            <Route path="/Header" element={<Header />} />
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
            <Route path="/AdminHome" element={<AdminHome />} />
            <Route path="/UserHistory" element={<UserHistory />} />
            <Route path="/UserHomePage" element={<UserHomePage />} />
            <Route path="/ChangePassword" element={<ChangePassword />} />
            <Route path="/Roundtrip" element={<Roundtrip />} />
            <Route path="/PartnerBookingFinalPage" element={<PartnerBookingFinalPage />} />
            <Route path="/RoundtripPage2" element={<RoundtripPage2 />} />
            <Route path="/RoundtripPage3" element={<RoundtripPage3 />} />
            <Route path="/RoundTripFinalPage" element={<RoundTripFinalPage />} />
            <Route path="/UserHistoryForAdmin" element={<UserHistoryForAdmin />} />
          </Routes>
          <ToastContainer/>
        </div>
        <Footer />
        </GradientBackground>
        
    </Router>
  );
}

export default App;
