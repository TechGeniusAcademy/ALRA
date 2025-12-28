const db = require('./models');
const sequelize = db.sequelize;
const fs = require('fs');
const path = require('path');

async function executeSql() {
  try {
    console.log('Читаем SQL-файл...');
    const sqlFile = path.join(__dirname, 'create-services.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('Выполняем SQL-запросы...');
    // Разделяем на отдельные запросы
    const queries = sql.split(';').filter(query => query.trim() !== '');
    
    for (const query of queries) {
      try {
        await sequelize.query(query);
        console.log('Запрос выполнен успешно.');
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', query);
        console.error(error);
      }
    }
    
    console.log('Проверяем таблицу services...');
    const [results] = await sequelize.query('SELECT * FROM services');
    console.log('Содержимое таблицы services:');
    console.table(results);
    
    console.log('Все операции выполнены успешно!');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при выполнении SQL:', error);
    process.exit(1);
  }
}

executeSql(); 