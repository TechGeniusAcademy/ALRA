import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import './services.css';

const Services = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Здесь была бы логика отправки формы на сервер
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        date: '',
        message: ''
      });
    }, 3000);
  };

  const services = [
    {
      category: "Уже включено",
      items: [
        {
          title: "Костровая зона",
        },
        {
          title: "Зона барбекю",
        },
        {
          title: "Зона тихого отдыха",
        },
        {
          title: "Детская зона",
        },
        {
          title: "Уборка комнаты 1 раз в 3 дня",
        }
      ]
    },
   
    {
      category: "По запросу",
      items: [
        {
          title: "Дополнительная уборка в номере"
        },
        {
          title: "Дополнительный комплект полотенец/постельного белья",
        },
        {
          title: "Велосипед (прокат) на базе отдыха",
        }
      ]
    }
  ];

  return (
    <div className="alra-services-container">
      <Header />
      
      <main className="alra-services-main">
        <section className="alra-services-hero">
          <div className="alra-services-hero-content">
            <h1 className="alra-services-title">Услуги</h1>
            <p className="alra-services-subtitle">Что мы предлагаем для вашего комфортного отдыха</p>
          </div>
        </section>
        
        <section className="alra-services-intro">
          <div className="alra-services-intro-container">
            <p className="alra-services-intro-text">
              В ALRA Eco Village мы создали уникальное пространство, где каждая услуга направлена на 
              восстановление гармонии с природой и самим собой. Наша цель — обеспечить вам незабываемый 
              отдых, наполненный комфортом и новыми впечатлениями, при этом максимально бережно относясь 
              к окружающей среде.
            </p>
          </div>
        </section>
        
        <section className="alra-services-list">
          <div className="alra-services-list-container">
            {services.map((category, index) => (
              <div 
                key={index}
                className={`alra-service-category ${activeAccordion === index ? 'alra-service-active' : ''}`}
              >
                <div 
                  className="alra-service-category-header"
                  onClick={() => toggleAccordion(index)}
                >
                  <h2 className="alra-service-category-title">{category.category}</h2>
                  <span className="alra-service-category-toggle">
                    {activeAccordion === index ? '−' : '+'}
                  </span>
                </div>
                
                <div className="alra-service-category-content">
                  <div className="alra-service-items">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="alra-service-item">
                        <div className="alra-service-item-info">
                          <h3 className="alra-service-item-title">{item.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="alra-booking-section">
          <div className="alra-booking-container">
            <h2 className="alra-booking-title">Забронировать услугу</h2>
            <p className="alra-booking-subtitle">
              Заполните форму, и наш менеджер свяжется с вами для уточнения деталей
            </p>
            
            {formSubmitted ? (
              <div className="alra-booking-success">
                <div className="alra-success-icon">✓</div>
                <h3 className="alra-success-title">Спасибо за заявку!</h3>
                <p className="alra-success-text">
                  Мы получили вашу заявку и свяжемся с вами в ближайшее время.
                </p>
              </div>
            ) : (
              <form className="alra-service-booking-form" onSubmit={handleFormSubmit}>
                <div className="alra-booking-form-grid">
                  <div className="alra-form-group">
                    <label className="alra-form-label">Ваше имя*</label>
                    <input
                      type="text"
                      name="name"
                      className="alra-form-input"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div className="alra-form-group">
                    <label className="alra-form-label">Email*</label>
                    <input
                      type="email"
                      name="email"
                      className="alra-form-input"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div className="alra-form-group">
                    <label className="alra-form-label">Телефон</label>
                    <input
                      type="tel"
                      name="phone"
                      className="alra-form-input"
                      value={formData.phone}
                      onChange={handleFormChange}
                    />
                  </div>
                  
                  <div className="alra-form-group">
                    <label className="alra-form-label">Интересующая услуга*</label>
                    <select
                      name="service"
                      className="alra-form-select"
                      value={formData.service}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Выберите услугу</option>
                      {services.map((category, catIndex) => (
                        <optgroup key={catIndex} label={category.category}>
                          {category.items.map((item, itemIndex) => (
                            <option key={`${catIndex}-${itemIndex}`} value={item.title}>
                              {item.title}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  
                  <div className="alra-form-group">
                    <label className="alra-form-label">Предпочтительная дата</label>
                    <input
                      type="date"
                      name="date"
                      className="alra-form-input"
                      value={formData.date}
                      onChange={handleFormChange}
                    />
                  </div>
                  
                  <div className="alra-form-group alra-form-full">
                    <label className="alra-form-label">Сообщение</label>
                    <textarea
                      name="message"
                      className="alra-form-textarea"
                      value={formData.message}
                      onChange={handleFormChange}
                      rows="4"
                    ></textarea>
                  </div>
                </div>
                
                <div className="alra-form-submit">
                  <button type="submit" className="alra-form-button">Отправить заявку</button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services; 