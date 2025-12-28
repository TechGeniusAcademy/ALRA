require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
  // Настройки подключения к MySQL
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '00000000'
  });

  try {
    const dbName = process.env.DB_NAME || 'alra_eco_village';
    
    console.log(`Попытка создания базы данных ${dbName}...`);
    
    // Создаем базу данных, если она не существует
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    
    console.log(`База данных ${dbName} успешно создана или уже существует.`);
    
    // Используем созданную базу данных
    await connection.query(`USE ${dbName}`);
    
    // Можно также создать таблицу administrators, если её еще нет
    await connection.query(`
      CREATE TABLE IF NOT EXISTS administrators (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Таблица administrators успешно создана или уже существует.');
    
  } catch (error) {
    console.error('Ошибка при создании базы данных:', error.message);
  } finally {
    // Закрываем соединение
    await connection.end();
  }
}

// Запускаем функцию создания базы данных
createDatabase(); 