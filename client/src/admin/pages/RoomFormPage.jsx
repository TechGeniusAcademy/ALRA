import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import roomService from '../services/roomService';
import './RoomFormPage.css';

const RoomFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    capacity: 1,
    amenities: [],
    status: 'available',
    roomType: 'standard'
  });
  
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Загрузка данных комнаты при редактировании
  useEffect(() => {
    if (isEditMode) {
      fetchRoomData();
    }
  }, [id]);
  
  const fetchRoomData = async () => {
    try {
      setLoading(true);
      const response = await roomService.getRoomById(id);
      if (response.data) {
        const roomData = response.data;
        
        // Устанавливаем данные формы
        setFormData({
          title: roomData.title || '',
          description: roomData.description || '',
          price: roomData.price || '',
          capacity: roomData.capacity || 1,
          amenities: roomData.amenities || [],
          status: roomData.status || 'available',
          roomType: roomData.roomType || 'standard'
        });
        
        // Устанавливаем изображения
        if (roomData.images && roomData.images.length > 0) {
          setImages(roomData.images);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching room data:', err);
      setError('Ошибка загрузки данных комнаты');
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAmenitiesChange = (amenity) => {
    setFormData(prev => {
      const updatedAmenities = [...prev.amenities];
      
      if (updatedAmenities.includes(amenity)) {
        // Удаляем, если уже есть
        return {
          ...prev,
          amenities: updatedAmenities.filter(item => item !== amenity)
        };
      } else {
        // Добавляем, если еще нет
        return {
          ...prev,
          amenities: [...updatedAmenities, amenity]
        };
      }
    });
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Создаем превью для новых изображений
    const imageFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isMain: false
    }));
    
    setNewImages(prev => [...prev, ...imageFiles]);
  };
  
  const handleRemoveImage = (index, isNewImage) => {
    if (isNewImage) {
      // Удаляем новое изображение
      setNewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // Помечаем существующее изображение для удаления
      setImages(prev => prev.map((image, i) => 
        i === index ? { ...image, toDelete: true } : image
      ));
    }
  };
  
  const handleSetMainImage = (index, isNewImage) => {
    if (isNewImage) {
      // Устанавливаем новое изображение как главное
      setNewImages(prev => prev.map((image, i) => ({
        ...image,
        isMain: i === index
      })));
      
      // Убираем отметку главного изображения с существующих
      setImages(prev => prev.map(image => ({
        ...image,
        isMain: false
      })));
    } else {
      // Устанавливаем существующее изображение как главное
      setImages(prev => prev.map((image, i) => ({
        ...image,
        isMain: i === index
      })));
      
      // Убираем отметку главного изображения с новых
      setNewImages(prev => prev.map(image => ({
        ...image,
        isMain: false
      })));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Валидация формы
      if (!formData.title || !formData.description || !formData.price) {
        setError('Пожалуйста, заполните все обязательные поля');
        setSaving(false);
        return;
      }
      
      // Создание объекта с данными комнаты
      const roomData = {
        ...formData,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity)
      };
      
      // Отправка данных на сервер
      let response;
      
      if (isEditMode) {
        // Обновление существующей комнаты
        response = await roomService.updateRoom(id, roomData);
        
        // Обновление изображений
        if (images.length > 0) {
          // Обработка удаления изображений
          const imagesToDelete = images.filter(image => image.toDelete);
          for (const image of imagesToDelete) {
            if (image.id) {
              await roomService.deleteRoomImage(image.id);
            }
          }
          
          // Обновление главного изображения
          const mainImage = images.find(image => image.isMain && !image.toDelete);
          if (mainImage && mainImage.id) {
            await roomService.setMainRoomImage(id, mainImage.id);
          }
        }
      } else {
        // Создание новой комнаты
        response = await roomService.createRoom(roomData);
      }
      
      const roomId = isEditMode ? id : response.data.id;
      
      // Загрузка новых изображений
      if (newImages.length > 0) {
        for (const imageData of newImages) {
          const formData = new FormData();
          formData.append('image', imageData.file);
          formData.append('roomId', roomId);
          formData.append('isMain', imageData.isMain);
          
          await roomService.uploadRoomImage(formData);
        }
      }
      
      // Перенаправление на страницу комнат
      navigate('/admin/rooms');
      
    } catch (err) {
      console.error('Error saving room:', err);
      setError(err.message || 'Ошибка сохранения комнаты');
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout title={isEditMode ? "Редактирование комнаты" : "Добавление комнаты"}>
        <div className="room-form-loading">Загрузка данных...</div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title={isEditMode ? "Редактирование комнаты" : "Добавление комнаты"}>
      <div className="room-form-container">
        {error && (
          <div className="room-form-error">{error}</div>
        )}
        
        <form className="room-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Название комнаты *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Описание *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="6"
              required
            ></textarea>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Цена за ночь (₽) *</label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="capacity">Вместимость (чел.) *</label>
              <select
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                required
              >
                <option value="1">1 человек</option>
                <option value="2">2 человека</option>
                <option value="3">3 человека</option>
                <option value="4">4 человека</option>
                <option value="5">5 человек</option>
                <option value="6">6 человек</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Статус</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="available">Доступна</option>
                <option value="maintenance">На обслуживании</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="roomType">Тип комнаты *</label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleInputChange}
                required
              >
                <option value="standard">Стандартный номер</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Удобства</label>
            <div className="amenities-container">
              {['Wi-Fi', 'ТВ', 'Кондиционер', 'Мини-бар', 'Фен', 'Сейф', 'Балкон'].map(amenity => (
                <div key={amenity} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenitiesChange(amenity)}
                  />
                  <label htmlFor={`amenity-${amenity}`}>{amenity}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Изображения</label>
            
            <div className="room-images-container">
              {/* Существующие изображения */}
              {images.filter(img => !img.toDelete).map((image, index) => (
                <div key={`existing-${index}`} className={`room-image-item ${image.isMain ? 'is-main' : ''}`}>
                  <img src={image.imageUrl} alt={`Комната ${index + 1}`} />
                  <div className="image-actions">
                    <button type="button" onClick={() => handleSetMainImage(index, false)}>
                      {image.isMain ? 'Главное' : 'Сделать главным'}
                    </button>
                    <button type="button" onClick={() => handleRemoveImage(index, false)}>
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Новые изображения */}
              {newImages.map((image, index) => (
                <div key={`new-${index}`} className={`room-image-item ${image.isMain ? 'is-main' : ''}`}>
                  <img src={image.preview} alt={`Новое изображение ${index + 1}`} />
                  <div className="image-actions">
                    <button type="button" onClick={() => handleSetMainImage(index, true)}>
                      {image.isMain ? 'Главное' : 'Сделать главным'}
                    </button>
                    <button type="button" onClick={() => handleRemoveImage(index, true)}>
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Загрузка новых изображений */}
              <div className="image-upload">
                <label htmlFor="image-upload">
                  <div className="upload-placeholder">
                    <i className="fas fa-plus"></i>
                    <span>Добавить фото</span>
                  </div>
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/admin/rooms')}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >
              {saving ? 'Сохранение...' : (isEditMode ? 'Сохранить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default RoomFormPage; 