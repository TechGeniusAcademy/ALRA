const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

// Публичные маршруты
router.post('/', bookingController.createBooking);

module.exports = router; 