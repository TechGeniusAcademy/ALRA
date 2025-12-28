import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically make an API call to add the email to your newsletter list
      setSubscribeStatus('success');
      setTimeout(() => {
        setSubscribeStatus('');
        setEmail('');
      }, 3000);
    } else {
      setSubscribeStatus('error');
    }
  };

  return (
    <footer className="alra-footer">
      <div className="alra-footer-container">
        <div className="alra-footer-top">
          <div className="alra-footer-brand-links"> 
          <div className="alra-footer-brand">
            <div className="alra-footer-logo">
              <img src="https://i.postimg.cc/JnW3rTR9/Magic-Eraser-250403-143630-2.png" alt="Alra" className="alra-footer-tree-icon" />
              <div className="alra-footer-title-subtitle">
              <h1 className="alra-footer-title" style={{ fontFamily: 'cridea', letterSpacing: '1.5px' }}>ALRA</h1>
              <h2 className="alra-footer-subtitle" style={{ fontFamily: 'masvol', letterSpacing: '1px', transform: 'scaleY(0.75)' }}>Eco Village</h2>
          </div>
            </div>
            <p className="alra-footer-tagline">
              Уникальный эко-отель в живописной Абхазии, 
              где комфорт и природа сочетаются в гармонии.
            </p>
            <div className="alra-footer-social">
              <a href="https://www.instagram.com/alraecovillage/" target="_blank" rel="noopener noreferrer" className="alra-social-link">
                <img src="https://i.postimg.cc/nh7gn51Y/Frame-1451.png" alt="location" className="alra-social-icon-inst" />
              </a>
              <a href="https://wa.me/79407179988" target="_blank" rel="noopener noreferrer" className="alra-social-link">
                <img src="https://i.postimg.cc/vBS3rLzZ/Frame-1452.png" alt="location" className="alra-social-icon-wa" />
              </a>
            </div>
          </div>

          <div className="alra-footer-links">
            <div className="alra-footer-column">
              <h4 className="alra-footer-heading">Навигация</h4>
              <ul className="alra-footer-menu">
                <li><Link to="/">Главная</Link></li>
                <li><Link to="/about">О нас</Link></li>
                <li><Link to="/services">Услуги</Link></li>
                <li><Link to="/contacts">Контакты</Link></li>
              </ul>
            </div>
          </div>
          </div>
          <div className="alra-footer-newsletter">
            <h4 className="alra-footer-heading">Подпишитесь на новости</h4>
            <p className="alra-newsletter-desc">
              Получайте специальные предложения и новости о событиях в ALRA Eco Village
            </p>
            <form className="alra-newsletter-form" onSubmit={handleSubscribe}>
              <div className="alra-form-group">
                <input
                  type="email"
                  className="alra-newsletter-input"
                  placeholder="Ваш email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="alra-newsletter-button">
                  Подписаться
                </button>
              </div>
              {subscribeStatus === 'success' && (
                <p className="alra-newsletter-success">Спасибо за подписку!</p>
              )}
              {subscribeStatus === 'error' && (
                <p className="alra-newsletter-error">Пожалуйста, введите email</p>
              )}
            </form>
          </div>
          </div>
      </div>
      <div className="alra-footer-bottom-bg">
          <div className="alra-footer-bottom">
            <div className="alra-footer-copyright">
              <p>&copy; {new Date().getFullYear()} ALRA Eco Village. Все права защищены.</p>
            </div>
              <Link to="/privacy-policy" className="alra-legal-link">Политика конфиденциальности</Link>
            <Link to="/house-rules" className="alra-legal-link">Правила проживания</Link>
          </div>
        </div>
    </footer>
  );
};

export default Footer; 