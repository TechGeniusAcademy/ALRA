const db = require('./models');
const sequelize = db.sequelize;

async function checkTables() {
  try {
    console.log('Начинаем проверку структуры таблицы services...');
    console.log('Состояние подключения:', sequelize.authenticate() ? 'подключено' : 'не подключено');
    
    // Проверяем, существует ли таблица
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('Существующие таблицы:', tables);
    
    // Пробуем описать таблицу
    try {
      const [results] = await sequelize.query('DESCRIBE services');
      console.log('Структура таблицы services:');
      console.table(results);
    } catch (err) {
      console.error('Не удалось получить структуру таблицы services:', err.message);
      
      // Пробуем создать таблицу прямым SQL запросом
      console.log('Попытка создать таблицу services напрямую...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS services (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Таблица создана, проверяем структуру...');
      const [newResults] = await sequelize.query('DESCRIBE services');
      console.table(newResults);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при проверке структуры таблицы:', error);
    process.exit(1);
  }
}

checkTables(); 