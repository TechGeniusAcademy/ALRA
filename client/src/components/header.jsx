import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';
import { useBooking } from '../contexts/BookingContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { openBookingModal } = useBooking();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Media
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.alra-nav-list') && !event.target.closest('.alra-burger')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Обработчик кнопки бронирования
  const handleBooking = (e) => {
    e.preventDefault();
    openBookingModal();
    setIsMenuOpen(false);
  };

  return (
    <header className={`alra-header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="alra-navigation">
        <div className="alra-burger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className={`alra-burger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`alra-burger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`alra-burger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </div>

        <ul className={`alra-nav-list ${isMenuOpen ? 'open' : ''}`}>
          <li className="alra-nav-item">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className={location.pathname === '/' ? 'alra-active' : ''}>
              Главная
            </Link>
          </li>
          <li className="alra-nav-item">
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className={location.pathname === '/about' ? 'alra-active' : ''}>
              О нас
            </Link>
          </li>
          <li className="alra-nav-item">
            <Link to="/services" onClick={() => setIsMenuOpen(false)} className={location.pathname === '/services' ? 'alra-active' : ''}>
              Услуги
            </Link>
          </li>
          <li className="alra-nav-item">
            <Link to="/contacts" onClick={() => setIsMenuOpen(false)} className={location.pathname === '/contacts' ? 'alra-active' : ''}>
              Контакты
            </Link>
          </li>
          <li className="alra-nav-item alra-nav-book">
            <a href="#" onClick={handleBooking}>
              Забронировать
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
