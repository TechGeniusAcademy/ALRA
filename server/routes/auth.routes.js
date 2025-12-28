const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Маршрут для авторизации администратора
router.post('/login', authController.login);

// Маршрут для получения информации о текущем администраторе
router.get('/me', verifyToken, authController.getMe);

// Маршрут для создания первоначального администратора (используется только при инициализации)
router.post('/init', authController.createInitialAdmin);

module.exports = router; 