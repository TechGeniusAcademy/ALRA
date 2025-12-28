const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Публичные маршруты
router.get('/', roomController.getAllRooms);
router.get('/availability', roomController.checkRoomAvailability);
router.get('/:id', roomController.getRoomById);

// Защищенные маршруты (только для админа)
router.post('/', verifyToken, roomController.createRoom);
router.put('/:id', verifyToken, roomController.updateRoom);
router.delete('/:id', verifyToken, roomController.deleteRoom);

// Маршруты для управления изображениями комнат (админ)
router.put('/:roomId/images/:imageId/main', verifyToken, roomController.setMainImage);
router.delete('/images/:id', verifyToken, roomController.deleteRoomImage);

module.exports = router; 