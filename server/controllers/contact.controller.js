const db = require('../models');
const ContactSubmission = db.contactSubmission;
const emailService = require('../utils/emailService');

// Отправка контактной формы (публичный)
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Создание записи в базе данных
    const contactSubmission = await ContactSubmission.create({
      name,
      email,
      subject,
      message,
      status: 'new'
    });

    // Отправка уведомления администратору
    await emailService.sendContactNotification(contactSubmission);
    
    // Отправка автоответа пользователю
    await emailService.sendContactAutoReply(contactSubmission);

    return res.status(201).json({
      success: true,
      message: 'Сообщение успешно отправлено',
      data: {
        id: contactSubmission.id,
        createdAt: contactSubmission.createdAt
      }
    });
  } catch (error) {
    console.error('Ошибка отправки контактного сообщения:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Получение всех контактных сообщений (только для админа)
exports.getAllContacts = async (req, res) => {
  try {
    const { status } = req.query;
    
    const whereClause = {};
    
    // Фильтрация по статусу
    if (status) {
      whereClause.status = status;
    }

    const contacts = await ContactSubmission.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Ошибка получения списка контактных сообщений:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Получение информации о конкретном контактном сообщении (только для админа)
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await ContactSubmission.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Сообщение не найдено'
      });
    }

    return res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Ошибка получения информации о контактном сообщении:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Обновление статуса контактного сообщения (только для админа)
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const contact = await ContactSubmission.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Сообщение не найдено'
      });
    }

    // Обновление данных
    await contact.update({
      status: status || contact.status,
      adminNotes: adminNotes !== undefined ? adminNotes : contact.adminNotes
    });

    return res.status(200).json({
      success: true,
      message: 'Информация о сообщении успешно обновлена',
      data: contact
    });
  } catch (error) {
    console.error('Ошибка обновления информации о контактном сообщении:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Удаление контактного сообщения (только для админа)
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await ContactSubmission.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Сообщение не найдено'
      });
    }

    await contact.destroy();

    return res.status(200).json({
      success: true,
      message: 'Сообщение успешно удалено'
    });
  } catch (error) {
    console.error('Ошибка удаления контактного сообщения:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 