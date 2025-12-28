const db = require('../models');
const Room = db.room;
const RoomImage = db.roomImage;
const Booking = db.booking;
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');

// Получение всех комнат
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: [
        {
          model: RoomImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'isMain']
        }
      ],
      order: [
        ['id', 'ASC'],
        [{ model: RoomImage, as: 'images' }, 'isMain', 'DESC']
      ]
    });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    console.error('Ошибка получения списка комнат:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Получение информации о конкретной комнате
exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const room = await Room.findByPk(id, {
      include: [
        {
          model: RoomImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'isMain']
        }
      ]
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Комната не найдена'
      });
    }

    return res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Ошибка получения информации о комнате:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Проверка доступности номеров
exports.checkRoomAvailability = async (req, res) => {
  try {
    const { checkIn, checkOut, guests, roomType } = req.query;
    
    // Валидация дат
    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать даты заезда и выезда'
      });
    }
    
    // Преобразуем даты
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Проверяем что даты корректны
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный формат дат'
      });
    }
    
    // Проверяем что дата выезда позже даты заезда
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Дата выезда должна быть позже даты заезда'
      });
    }
    
    // Составляем условия фильтрации
    const whereConditions = {
      status: 'available',
      capacity: { [Op.gte]: parseInt(guests) || 1 }
    };
    
    // Добавляем фильтр по типу комнаты, если он указан
    if (roomType) {
      whereConditions.roomType = roomType;
    }
    
    // Простой вариант - получить все доступные комнаты по фильтрам
    const availableRooms = await Room.findAll({
      where: whereConditions,
      include: [
        {
          model: RoomImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'isMain']
        }
      ],
      order: [
        ['id', 'ASC'],
        [{ model: RoomImage, as: 'images' }, 'isMain', 'DESC']
      ]
    });
    
    return res.status(200).json({
      success: true,
      data: availableRooms
    });
  } catch (error) {
    console.error('Error checking room availability:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Произошла ошибка при проверке доступности'
    });
  }
};

// Создание новой комнаты (для админа)
exports.createRoom = async (req, res) => {
  try {
    const { title, description, price, capacity, amenities, status } = req.body;

    const room = await Room.create({
      title,
      description,
      price,
      capacity,
      amenities: amenities ? JSON.parse(amenities) : null,
      status: status || 'available'
    });

    return res.status(201).json({
      success: true,
      message: 'Комната успешно создана',
      data: room
    });
  } catch (error) {
    console.error('Ошибка создания комнаты:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Обновление информации о комнате (для админа)
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, capacity, amenities, status } = req.body;

    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Комната не найдена'
      });
    }

    // Обновление данных
    await room.update({
      title: title || room.title,
      description: description || room.description,
      price: price || room.price,
      capacity: capacity || room.capacity,
      amenities: amenities ? JSON.parse(amenities) : room.amenities,
      status: status || room.status
    });

    return res.status(200).json({
      success: true,
      message: 'Информация о комнате успешно обновлена',
      data: room
    });
  } catch (error) {
    console.error('Ошибка обновления информации о комнате:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Удаление комнаты (для админа)
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Комната не найдена'
      });
    }

    await room.destroy();

    return res.status(200).json({
      success: true,
      message: 'Комната успешно удалена'
    });
  } catch (error) {
    console.error('Ошибка удаления комнаты:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Обработка загрузки изображения для комнаты
exports.handleRoomImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Изображение не было загружено'
      });
    }
    
    const { roomId, isMain } = req.body;
    
    // Проверяем существование комнаты
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Комната не найдена'
      });
    }
    
    // Формируем URL изображения (с учетом публичного пути)
    const imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;
    
    // Создаем запись об изображении в базе данных
    const roomImage = await RoomImage.create({
      roomId,
      imageUrl,
      isMain: isMain === 'true'
    });
    
    // Если это главное изображение, обновляем все остальные
    if (isMain === 'true') {
      await RoomImage.update(
        { isMain: false },
        { 
          where: { 
            roomId,
            id: { [Op.ne]: roomImage.id }
          } 
        }
      );
    }
    
    return res.status(201).json({
      success: true,
      message: 'Изображение успешно загружено и добавлено к комнате',
      data: roomImage
    });
  } catch (error) {
    console.error('Ошибка при обработке загрузки изображения:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Установка главного изображения комнаты
exports.setMainImage = async (req, res) => {
  try {
    const { roomId, imageId } = req.params;
    
    // Проверяем существование комнаты
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Комната не найдена'
      });
    }
    
    // Проверяем существование изображения и его связь с комнатой
    const image = await RoomImage.findOne({
      where: {
        id: imageId,
        roomId
      }
    });
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Изображение не найдено'
      });
    }
    
    // Сбрасываем флаг isMain у всех изображений комнаты
    await RoomImage.update(
      { isMain: false },
      { where: { roomId } }
    );
    
    // Устанавливаем isMain = true для выбранного изображения
    await image.update({ isMain: true });
    
    return res.status(200).json({
      success: true,
      message: 'Главное изображение комнаты успешно обновлено'
    });
  } catch (error) {
    console.error('Ошибка при установке главного изображения:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Удаление изображения комнаты
exports.deleteRoomImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Находим изображение в базе
    const image = await RoomImage.findByPk(id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Изображение не найдено'
      });
    }
    
    // Удаляем из базы данных
    await image.destroy();
    
    // В будущем можно добавить удаление файла с диска
    // const fs = require('fs');
    // const path = require('path');
    // const filePath = path.join(__dirname, '..', image.imageUrl);
    // if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath);
    // }
    
    return res.status(200).json({
      success: true,
      message: 'Изображение успешно удалено'
    });
  } catch (error) {
    console.error('Ошибка при удалении изображения:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 