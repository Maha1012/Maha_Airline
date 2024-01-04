import React from 'react';
import {
  Container,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import FlightIcon from '@mui/icons-material/Flight';
import HistoryIcon from '@mui/icons-material/History';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import tajMahalImage from 'C:/Users/mahalaxmi.ganesan/OneDrive - psiog.com/Desktop/Maha_Airline/maha_airline/dist/assets/pexels-rajib-hossain-5733079-u5Xjs-ZC-u5Xjs-ZC-u5Xjs-ZC-u5Xjs-ZC-u5Xjs-ZC-u5Xjs-ZC-u5Xjs-ZC-u5Xjs-ZC.jpg';
import indiaGateImage from 'C:/Users/mahalaxmi.ganesan/OneDrive - psiog.com/Desktop/Maha_Airline/maha_airline/dist/assets/india gate-Bywr65y7-Bywr65y7-Bywr65y7-Bywr65y7-Bywr65y7-Bywr65y7-Bywr65y7-Bywr65y7.jpg';
import boatHouseImage from 'C:/Users/mahalaxmi.ganesan/OneDrive - psiog.com/Desktop/Maha_Airline/maha_airline/dist/assets/pexels-shalender-kumar-3672388-qqPOHO2d-qqPOHO2d-qqPOHO2d-qqPOHO2d-qqPOHO2d-qqPOHO2d-qqPOHO2d-qqPOHO2d.jpg';
import Layout from './Layout';


const UserHomePage = () => {
  const navigate = useNavigate();

  const handleUserHistory = () => {
    navigate('/userHistory');
  };

  const handleBookTicket = () => {
    navigate('/BookingForm');
  };

  const handleRoundtrip = () => {
    navigate('/Roundtrip');
  };
  
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Layout>
      <div
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '90px',
        }}
      >


        <Container maxWidth="md" style={{ textAlign: 'center', color: 'black' }}>
          <Typography variant="h4" gutterBottom>
            Start your journey with us
          </Typography>
          <Typography variant="body1" style={{ marginBottom: '20px' }}>
            Your gateway to exciting journeys and unforgettable adventures!
          </Typography>
          <Slider {...carouselSettings}>
            <div>
              <img src={tajMahalImage} alt="Taj Mahal" style={{ width: '100%', height: '400px', borderRadius: '15px' }} />
            </div>
            <div>
              <img src={indiaGateImage} alt="India Gate" style={{ width: '100%', height: '400px', borderRadius: '15px' }} />
            </div>
            <div>
              <img src={boatHouseImage} alt="Boat House" style={{ width: '100%', height: '400px', borderRadius: '15px' }} />
            </div>
          </Slider>

          <Paper
            elevation={3}
            style={{ borderRadius: '15px', color: 'black', marginTop: '20px' }}
            id="userHistorySection"
          >
            <div style={{ display: 'flex', justifyContent: 'space-around', color: 'black' }}>
              <IconButton color="primary" onClick={handleUserHistory}>
                <HistoryIcon fontSize="large" />
                <Typography variant="subtitle1">User History</Typography>
              </IconButton>
              <IconButton color="primary" onClick={handleBookTicket} id="bookTicketSection">
                <FlightIcon fontSize="large" />
                <Typography variant="subtitle1">Book Ticket</Typography>
              </IconButton>
              <IconButton color="primary" onClick={handleRoundtrip} id="roundTripSection">
                <EventSeatIcon fontSize="large" />
                <Typography variant="subtitle1">Book RoundTrip</Typography>
              </IconButton>
            </div>
          </Paper>

          

          <div id="aboutUsSection" style={{ marginTop: '40px', textAlign: 'center' }}>
  {/* Updated Content for About Us section */}
  <Typography variant="h4" gutterBottom style={{ color: '#3f51b5' }}>
    Our Story
  </Typography>
  <Typography variant="body1" style={{ fontSize: '18px', lineHeight: '1.6', color: '#555' }}>
    At Maha Airline, we are passionate about providing you with unparalleled travel experiences. Our commitment to excellence drives us to go above and beyond, ensuring your journey is seamless, enjoyable, and unforgettable. Trust us to be your reliable partner in exploration.
  </Typography>
</div>


          
        </Container>
        
      </div>
    </Layout>
  );
};

export default UserHomePage;
