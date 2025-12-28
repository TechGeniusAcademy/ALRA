const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const serviceController = require('../controllers/service.controller');
const { verifyToken: authJwt } = require('../middleware/auth.middleware');

// Маршруты для бронирований (публичные)
router.post('/bookings', bookingController.createBooking);
router.get('/rooms/:roomId/availability', bookingController.checkAvailability);

// Маршруты для услуг (публичные)
router.get('/services', serviceController.getAllServices);
router.get('/services/:id', serviceController.getServiceById);

// Маршруты для услуг (только для админа)
router.post('/admin/services', authJwt, serviceController.createService);
router.put('/admin/services/:id', authJwt, serviceController.updateService);
router.delete('/admin/services/:id', authJwt, serviceController.deleteService);

module.exports = router; 