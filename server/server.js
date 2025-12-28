const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Инициализация Express
const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://89.104.74.76',
  'https://alraeco.com',
  'https://www.alraeco.com',
  'http://alraeco.com',
  'http://www.alraeco.com',
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Импорт маршрутов
const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/room.routes');
const bookingRoutes = require('./routes/booking.routes');
const contactRoutes = require('./routes/contact.routes');
const contentRoutes = require('./routes/content.routes');
const adminRoutes = require('./routes/admin.routes');
const serviceRoutes = require('./routes/service.routes');
const apiRoutes = require('./routes/api.js');

// Инициализация базы данных
const db = require('./models');

// Использование маршрутов
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api', apiRoutes);

// Простой маршрут для проверки работы API
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ALRA Eco Village API' });
});

// Обработка ошибок 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Глобальная обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Запуск сервера
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Синхронизация с базой данных (в режиме разработки)
if (process.env.NODE_ENV === 'development') {
  db.sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
  }).catch(err => {
    console.error('Failed to sync database:', err);
  });
} 