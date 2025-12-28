import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import About from './pages/about';
import Services from './pages/services';
import Contacts from './pages/contacts';
import AccommodationPolicy from './components/information/AccommodationPolicy';
import HouseRules from './components/information/HouseRules';
import '../src/components/fonts.css';
import AdminRouter from './admin/components/AdminRouter';
import { BookingProvider, useBooking } from './contexts/BookingContext';
import BookingModal from './components/BookingModal';

function App() {
  return (
    <div className="App">
      <BookingProvider>
        <Router>
          <Routes>
            {/* Публичные маршруты сайта */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/privacy-policy" element={<AccommodationPolicy />} />
            <Route path="/house-rules" element={<HouseRules />} />
            
            {/* Административные маршруты */}
            <Route path="/admin/*" element={<AdminRouter />} />
          </Routes>
          
          {/* Глобальное модальное окно бронирования */}
          <GlobalBookingModal />
        </Router>
      </BookingProvider>
    </div>
  );
}

// Компонент для отображения глобального модального окна бронирования
const GlobalBookingModal = () => {
  const { showBookingModal, closeBookingModal, selectedRoom } = useBooking();
  
  return (
    <BookingModal 
      isOpen={showBookingModal}
      onClose={closeBookingModal}
      roomId={selectedRoom.id}
      roomTitle={selectedRoom.title}
      roomPrice={selectedRoom.price}
    />
  );
};

export default App;
