const db = require('../models');
const Service = db.service;
const { Op } = require('sequelize');

// Получить все услуги
exports.getAllServices = async (req, res) => {
  try {
    // Фильтр по активным, если указано в запросе
    const filter = req.query.activeOnly === 'true' ? { active: true } : {};
    
    const services = await Service.findAll({
      where: filter,
      order: [['id', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error in getAllServices:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Произошла ошибка при получении услуг'
    });
  }
};

// Получить услугу по ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findByPk(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Услуга не найдена'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error in getServiceById:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Произошла ошибка при получении услуги'
    });
  }
};

// Создать новую услугу
exports.createService = async (req, res) => {
  try {
    const { name, description, price, active } = req.body;
    
    // Валидация
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Название услуги обязательно'
      });
    }
    
    if (!price || isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: 'Цена должна быть числом'
      });
    }
    
    // Создаем новую услугу
    const service = await Service.create({
      name,
      description,
      price: parseFloat(price),
      active: active !== undefined ? active : true
    });
    
    return res.status(201).json({
      success: true,
      message: 'Услуга успешно создана',
      data: service
    });
  } catch (error) {
    console.error('Error in createService:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Произошла ошибка при создании услуги'
    });
  }
};

// Обновить услугу
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, active } = req.body;
    
    // Проверяем существование услуги
    const service = await Service.findByPk(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Услуга не найдена'
      });
    }
    
    // Валидация
    if (price !== undefined && isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: 'Цена должна быть числом'
      });
    }
    
    // Обновляем услугу
    await service.update({
      name: name !== undefined ? name : service.name,
      description: description !== undefined ? description : service.description,
      price: price !== undefined ? parseFloat(price) : service.price,
      active: active !== undefined ? active : service.active
    });
    
    return res.status(200).json({
      success: true,
      message: 'Услуга успешно обновлена',
      data: service
    });
  } catch (error) {
    console.error('Error in updateService:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Произошла ошибка при обновлении услуги'
    });
  }
};

// Удалить услугу
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Проверяем существование услуги
    const service = await Service.findByPk(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Услуга не найдена'
      });
    }
    
    // Удаляем услугу
    await service.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Услуга успешно удалена'
    });
  } catch (error) {
    console.error('Error in deleteService:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Произошла ошибка при удалении услуги'
    });
  }
}; 