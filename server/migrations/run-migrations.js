const db = require('../models');
const migrationCreateServices = require('./create-services-table');

async function runMigrations() {
  try {
    console.log('🚀 Запуск миграций...');
    
    const sequelize = db.sequelize;
    const Sequelize = db.Sequelize;
    
    // Не запускаем миграцию roomType, так как поле уже существует
    
    console.log('➕ Создаем таблицы для услуг...');
    await migrationCreateServices.up(sequelize.getQueryInterface(), Sequelize);
    
    console.log('✅ Миграции успешно выполнены!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при выполнении миграций:', error);
    process.exit(1);
  }
}

runMigrations(); 