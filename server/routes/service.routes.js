const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Публичные маршруты
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Защищенные маршруты (только для админа)
router.post('/', verifyToken, serviceController.createService);
router.put('/:id', verifyToken, serviceController.updateService);
router.delete('/:id', verifyToken, serviceController.deleteService);

module.exports = router; 