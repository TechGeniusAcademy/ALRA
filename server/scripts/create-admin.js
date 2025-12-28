require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');

// Настройки подключения к базе данных
const sequelize = new Sequelize(
  process.env.DB_NAME || 'alra_eco_village',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '00000000',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

// Определение модели администратора
const Administrator = sequelize.define('administrator', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  }
}, {
  tableName: 'administrators',
  timestamps: true,
  // Используем стандартные createdAt и updatedAt вместо настраиваемых полей
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Данные для создания администратора
const adminData = {
  username: 'admin',
  password: '00000000',
  email: 'admin@alraeco.com'
};

// Функция создания администратора
async function createAdmin() {
  try {
    // Проверка соединения с базой данных
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено успешно.');

    // Синхронизируем модель с базой данных
    await Administrator.sync();
    console.log('Модель Administrator синхронизирована с базой данных.');

    // Проверяем, существует ли уже администратор с таким именем
    const existingAdmin = await Administrator.findOne({
      where: { username: adminData.username }
    });

    if (existingAdmin) {
      console.log(`Администратор с именем ${adminData.username} уже существует`);
      return;
    }

    // Хешируем пароль
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(adminData.password, salt);

    // Создаем администратора в базе данных
    const admin = await Administrator.create({
      username: adminData.username,
      password: hashedPassword,
      email: adminData.email
    });

    console.log('Администратор успешно создан:');
    console.log('Имя пользователя:', admin.username);
    console.log('Email:', admin.email);
    console.log('ID:', admin.id);
  } catch (error) {
    console.error('Ошибка при создании администратора:', error.message);
  } finally {
    // Закрываем соединение с базой данных
    await sequelize.close();
  }
}

// Запускаем функцию создания администратора
createAdmin(); 