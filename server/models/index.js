const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config.js');

const sequelize = new Sequelize(
  dbConfig.DB, 
  dbConfig.USER, 
  dbConfig.PASSWORD, 
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Импорт моделей
db.administrator = require('./administrator.model.js')(sequelize, Sequelize);
db.room = require('./room.model.js')(sequelize, Sequelize);
db.roomImage = require('./roomImage.model.js')(sequelize, Sequelize);
db.booking = require('./booking.model.js')(sequelize, Sequelize);
db.contactSubmission = require('./contactSubmission.model.js')(sequelize, Sequelize);
db.content = require('./content.model.js')(sequelize, Sequelize);
db.service = require('./service.model.js')(sequelize, Sequelize);
db.bookingService = require('./bookingService.model.js')(sequelize, Sequelize);

// Связи между моделями
db.room.hasMany(db.roomImage, { as: 'images', foreignKey: 'roomId' });
db.roomImage.belongsTo(db.room, { foreignKey: 'roomId' });

db.room.hasMany(db.booking, { as: 'bookings', foreignKey: 'roomId' });
db.booking.belongsTo(db.room, { foreignKey: 'roomId' });

// Связь многие-ко-многим между бронированиями и услугами
db.booking.belongsToMany(db.service, { 
  through: db.bookingService,
  foreignKey: 'bookingId'
});
db.service.belongsToMany(db.booking, { 
  through: db.bookingService,
  foreignKey: 'serviceId'
});

module.exports = db; 