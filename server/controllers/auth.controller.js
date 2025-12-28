const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const Administrator = db.administrator;

// Авторизация администратора
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Проверка наличия пользователя с указанным именем
    const administrator = await Administrator.findOne({ where: { username } });
    if (!administrator) {
      return res.status(404).json({ 
        success: false,
        message: 'Пользователь не найден' 
      });
    }

    // Проверка пароля
    const passwordIsValid = bcrypt.compareSync(password, administrator.password);
    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        message: 'Неверный пароль'
      });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { id: administrator.id },
      process.env.JWT_SECRET,
      { expiresIn: 86400 }
    );

    // Отправка ответа с данными пользователя и токеном
    return res.status(200).json({
      success: true,
      message: 'Авторизация успешна',
      administrator: {
        id: administrator.id,
        username: administrator.username,
        email: administrator.email
      },
      accessToken: token
    });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Получение информации о текущем администраторе
exports.getMe = async (req, res) => {
  try {
    const administrator = await Administrator.findByPk(req.administratorId, {
      attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
    });

    if (!administrator) {
      return res.status(404).json({
        success: false,
        message: 'Администратор не найден'
      });
    }

    return res.status(200).json({
      success: true,
      administrator
    });
  } catch (error) {
    console.error('Ошибка получения информации:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Создание первоначального администратора (для инициализации системы)
exports.createInitialAdmin = async (req, res) => {
  try {
    // Проверка существующих администраторов
    const adminCount = await Administrator.count();
    if (adminCount > 0) {
      return res.status(403).json({
        success: false,
        message: 'Администраторы уже существуют, невозможно создать начального администратора'
      });
    }

    const { username, password, email } = req.body;

    // Хеширование пароля
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Создание администратора
    const administrator = await Administrator.create({
      username,
      password: hashedPassword,
      email
    });

    return res.status(201).json({
      success: true,
      message: 'Администратор успешно создан',
      administrator: {
        id: administrator.id,
        username: administrator.username,
        email: administrator.email
      }
    });
  } catch (error) {
    console.error('Ошибка создания администратора:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 