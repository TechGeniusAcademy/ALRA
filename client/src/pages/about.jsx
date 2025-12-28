import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import './about.css';

const About = () => {
  
  return (
    <div className="alra-about-container">
      <div className="alra-about-background"></div>
      
      <Header />
      
      <main className="alra-about-main">
        <section className="alra-about-hero">
          <div className="alra-about-hero-content">
            <h1 className="alra-about-title">О нас</h1>
            <p className="alra-about-subtitle">Узнайте историю и философию ALRA</p>
          </div>
        </section>
        
        <section className="alra-story-section">
          <div className="alra-story-container">
            <div className="alra-story-image">
              <img src="https://i.postimg.cc/sXRLHvF4/IMG-6011.avif" alt="История ALRA" className="alra-img-rounded" />
            </div>
            <div className="alra-story-content">
              <h2 className="alra-story-title">Наша история</h2>
              <p className="alra-story-text">
                ALRA Eco Village был основан в 2025 году. Расположенный в одном из самых живописных уголков Абхазии, наш эко-отель стал воплощением мечты о сочетании комфорта современной жизни и бережного отношения к окружающей среде.
              </p>
              <p className="alra-story-text">
                С первых дней существования ALRA, мы придерживаемся принципов устойчивого 
                развития и экологичности во всех аспектах нашей деятельности: от строительства 
                домиков из натуральных материалов до использования солнечной энергии и 
                органических продуктов в нашем ресторане.
              </p>
              <p className="alra-story-quote">
                "Мы не просто создаем место для отдыха, мы формируем новое отношение 
                к туризму и природе Абхазии"
              </p>
            </div>
          </div>
        </section>
        
        <section className="alra-philosophy-section">
          <div className="alra-philosophy-container">
            <p className="alra-philosophy-title">'ALRA - в переводе с абхазского означает "ольха".</p>

            <p className="alra-philosophy-title">Эко-отель - это уникальное место, которое сочетает в себе комфорт и заботу о природе. Мы стремимся создать пространство, где гости могут не только отдыхать, но и обмениваться опытом и идеями, создавая тем самым сообщество единомышленников.</p>

            <p className="alra-philosophy-title">Наша концепция - единение с природой в полном комфорте. Удовольствие для тех, кто может позволить себе отдых по высшему классу вдали от цивилизации, хочет провести время на лоне природы, получить новый опыт, эмоции и впечатления.</p>
            <div className="alra-philosophy-grid">
              <div className="alra-philosophy-item">
                <img src="https://i.postimg.cc/43pz2nM6/IMG-6013.avif" alt="" className="alra-philosophy-icon" />
                <h3 className="alra-philosophy-item-title">Статус</h3>
                <p className="alra-philosophy-text">
                  Для ценителей уникального отдыха и постоянных гостей.
                </p>
              </div>
              <div className="alra-philosophy-item">
                <img src="https://i.postimg.cc/m2hg2JTJ/IMG-6026.avif" alt="" className="alra-philosophy-icon" />
                <h3 className="alra-philosophy-item-title">Релакс</h3>
                <p className="alra-philosophy-text">
                  Полный покой наедине с собой в тишине и гармонии с природой.
                </p>
              </div>
              <div className="alra-philosophy-item">
                <img src="https://i.postimg.cc/QxNjYPBV/Frame-1494.png" alt="" className="alra-philosophy-icon" />
                <h3 className="alra-philosophy-item-title">Комфорт</h3>
                <p className="alra-philosophy-text">
                Невероятные эмоции без отрыва от городских удобств.
                </p>
              </div>
            </div>
            <p className="alra-philosophy-title">Наши уютные коттеджи расположены в живописном месте на природе. Поблизости находится горячий источник - отличная возможность для расслабления в любое время года. В шаговой доступности - чистое море с причалом.</p>

            <p className="alra-philosophy-title">На территории есть зона у костра, где можно провести вечер в уютной атмосфере, а для маленьких гостей предусмотрена детская площадка.</p>

            <p className="alra-philosophy-title">Идеальное место для семейного отдыха, встреч с друзьями и просто перезагрузки от городской суеты.</p>
          </div>
        </section>
        <section className="alra-testimonials-section">
          <div className="alra-testimonials-container">
            <h2 className="alra-testimonials-title">Отзывы наших гостей</h2>
            
            <div className="alra-testimonials-grid">
              
              <div className="alra-testimonial-card">
                <div className="alra-testimonial-content">
                  <p className="alra-testimonial-text">
                    "Это место изменило мое представление об экологичном отдыхе. Всё продумано до мелочей: 
                    от органических средств для душа до велосипедов для передвижения. Особенно 
                    запомнились вечера у костра."
                  </p>
                </div>
                <div className="alra-testimonial-author">
                  <div className="alra-author-photo">
                    <img src="https://i.postimg.cc/HkmC9D4r/1678385566.jpg" alt="Сергей Д." />
                  </div>
                  <div className="alra-author-info">
                    <h4 className="alra-author-name">Сергей Д.</h4>
                    <p className="alra-author-location">Санкт-Петербург</p>
                    <div className="alra-author-rating">★★★★★</div>
                  </div>
                </div>
              </div>
              
              <div className="alra-testimonial-card">
                <div className="alra-testimonial-content">
                  <p className="alra-testimonial-text">
                    "Уже второй раз приезжаем в ALRA, и каждый раз открываем для себя что-то новое. 
                    Идеальное место для перезагрузки от городской суеты. Хочу отменить классное расположение домиков и отдельное спасибо за вкуснейшие завтраки!"
                  </p>
                </div>
                <div className="alra-testimonial-author">
                  <div className="alra-author-photo">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1376&auto=format&fit=crop" alt="Анна" />
                  </div>
                  <div className="alra-author-info">
                    <h4 className="alra-author-name">Анна</h4>
                    <p className="alra-author-location">Краснодар</p>
                    <div className="alra-author-rating">★★★★★</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="alra-cta-section">
          <div className="alra-cta-container">
            <h2 className="alra-cta-title">Готовы к новым впечатлениям?</h2>
            <p className="alra-cta-text">
              Забронируйте свой отдых в ALRA Eco Village прямо сейчас и откройте для себя 
              уникальный опыт пребывания в гармонии с природой.
            </p>
            <a href="/book" className="alra-cta-button">Забронировать</a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About; 