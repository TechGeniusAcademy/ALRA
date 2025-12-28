import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import contentService from '../services/contentService';
import './ContentPage.css';

const ContentPage = () => {
  const [contentSections, setContentSections] = useState({
    home: [],
    about: [],
    services: [],
    contact: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [editSection, setEditSection] = useState(null);

  useEffect(() => {
    fetchPageContent(activeTab);
  }, [activeTab]);

  const fetchPageContent = async (page) => {
    try {
      setLoading(true);
      const data = await contentService.getPageContent(page);
      
      // Ensure data is an array before updating state
      const sectionsArray = Array.isArray(data) ? data : [];
      
      // Обновляем только активную вкладку
      setContentSections(prev => ({
        ...prev,
        [page]: sectionsArray
      }));
      
      setLoading(false);
    } catch (err) {
      setError(err.message || `Ошибка загрузки контента для страницы ${page}`);
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Отменяем любое редактирование при смене вкладки
    setEditSection(null);
  };

  const handleEditClick = (section) => {
    setEditSection({
      ...section,
      content: section.content // Копируем контент для редактирования
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditSection(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (e) => {
    setEditSection(prev => ({
      ...prev,
      content: e.target.value
    }));
  };

  const handleCancelEdit = () => {
    setEditSection(null);
  };

  const handleSaveContent = async () => {
    if (!editSection) return;
    
    try {
      await contentService.updatePageContent(activeTab, editSection);
      
      // Обновляем контент в состоянии
      setContentSections(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(section => 
          section.id === editSection.id ? editSection : section
        )
      }));
      
      setEditSection(null);
    } catch (err) {
      setError(err.message || 'Ошибка сохранения контента');
    }
  };

  // Ensure we're working with an array
  const currentSections = Array.isArray(contentSections[activeTab]) 
    ? contentSections[activeTab] 
    : [];

  return (
    <AdminLayout title="Управление контентом">
      <div className="content-container">
        <div className="content-tabs">
          <button 
            className={`tab-button ${activeTab === 'home' ? 'active' : ''}`} 
            onClick={() => handleTabChange('home')}
          >
            Главная
          </button>
          <button 
            className={`tab-button ${activeTab === 'about' ? 'active' : ''}`} 
            onClick={() => handleTabChange('about')}
          >
            О нас
          </button>
          <button 
            className={`tab-button ${activeTab === 'services' ? 'active' : ''}`} 
            onClick={() => handleTabChange('services')}
          >
            Услуги
          </button>
          <button 
            className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`} 
            onClick={() => handleTabChange('contact')}
          >
            Контакты
          </button>
        </div>

        {loading ? (
          <div className="content-loading">Загрузка контента...</div>
        ) : error ? (
          <div className="content-error">{error}</div>
        ) : currentSections.length === 0 ? (
          <div className="content-empty">
            <p>Контент для этой страницы не найден.</p>
            <button className="add-content-button">
              <i className="fas fa-plus"></i> Добавить раздел
            </button>
          </div>
        ) : (
          <div className="content-sections">
            {currentSections.map(section => (
              <div key={section.id} className="content-section-card">
                {editSection?.id === section.id ? (
                  <div className="section-edit-form">
                    <div className="form-group">
                      <label htmlFor="title">Заголовок</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={editSection.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="order">Порядок</label>
                      <input
                        type="number"
                        id="order"
                        name="order"
                        value={editSection.order}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="content">Содержание</label>
                      <textarea
                        id="content"
                        name="content"
                        value={editSection.content}
                        onChange={handleContentChange}
                        rows="6"
                      ></textarea>
                    </div>
                    
                    <div className="form-actions">
                      <button className="cancel-button" onClick={handleCancelEdit}>
                        Отмена
                      </button>
                      <button className="save-button" onClick={handleSaveContent}>
                        Сохранить
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="section-header">
                      <h3>{section.title}</h3>
                      <div className="section-order">#{section.order}</div>
                    </div>
                    
                    <div className="section-content">
                      {typeof section.content === 'string' ? 
                        section.content.split('\n').map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        )) : 
                        <p>Нет содержимого</p>
                      }
                    </div>
                    
                    <div className="section-actions">
                      <button 
                        className="edit-button" 
                        onClick={() => handleEditClick(section)}
                      >
                        <i className="fas fa-edit"></i> Редактировать
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            <div className="add-section">
              <button className="add-content-button">
                <i className="fas fa-plus"></i> Добавить раздел
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContentPage; 