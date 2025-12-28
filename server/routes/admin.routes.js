const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const contactController = require('../controllers/contact.controller');
const contentController = require('../controllers/content.controller');
const roomController = require('../controllers/room.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// Настройка загрузки файлов
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function(req, file, cb) {
    // Генерация уникального имени файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExt);
  }
});

// Функция фильтрации типов файлов
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Недопустимый тип файла. Разрешены только изображения (JPEG, PNG, GIF, WEBP).'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});

// Все маршруты защищены middleware верификации токена
router.use(verifyToken);

// Маршруты для управления бронированиями (админ)
router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/:id', bookingController.getBookingById);
router.put('/bookings/:id', bookingController.updateBooking);
router.delete('/bookings/:id', bookingController.deleteBooking);

// Маршруты для управления контактами (админ)
router.get('/contacts', contactController.getAllContacts);
router.get('/contacts/:id', contactController.getContactById);
router.put('/contacts/:id', contactController.updateContact);
router.delete('/contacts/:id', contactController.deleteContact);

// Маршруты для управления контентом (админ)
router.put('/content/:page', contentController.updatePageContent);
router.delete('/content/:page', contentController.deletePageContent);

// Маршрут для загрузки изображений
router.post('/uploads', upload.single('image'), roomController.handleRoomImageUpload);

module.exports = router; 