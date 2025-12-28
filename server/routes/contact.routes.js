const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

// Публичные маршруты
router.post('/', contactController.submitContactForm);

module.exports = router; 