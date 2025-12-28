const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');

// Публичные маршруты
router.get('/:page', contentController.getPageContent);

module.exports = router; 