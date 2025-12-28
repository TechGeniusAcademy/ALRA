const db = require('../models');
const Content = db.content;

// Получение контента для страницы (публичный)
exports.getPageContent = async (req, res) => {
  try {
    const { page } = req.params;
    const { section } = req.query;
    
    const whereClause = { page };
    
    // Фильтрация по разделу, если указан
    if (section) {
      whereClause.section = section;
    }

    const content = await Content.findAll({
      where: whereClause,
      attributes: ['id', 'page', 'section', 'content', 'updatedAt']
    });

    // Если запрашивается конкретный раздел, но он не найден
    if (section && content.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Контент для страницы ${page}, раздел ${section} не найден`
      });
    }

    // Преобразование результата в более удобный формат
    const formattedContent = {};
    content.forEach(item => {
      formattedContent[item.section] = item.content;
    });

    return res.status(200).json({
      success: true,
      page,
      data: formattedContent
    });
  } catch (error) {
    console.error('Ошибка получения контента:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Обновление контента страницы (только для админа)
exports.updatePageContent = async (req, res) => {
  try {
    const { page } = req.params;
    const { section, content } = req.body;

    if (!section || !content) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать раздел и содержимое'
      });
    }

    // Поиск существующего контента
    const [contentRecord, created] = await Content.findOrCreate({
      where: { page, section },
      defaults: {
        content: content
      }
    });

    // Если контент уже существует, обновить его
    if (!created) {
      await contentRecord.update({ content });
    }

    return res.status(200).json({
      success: true,
      message: created ? 'Контент успешно создан' : 'Контент успешно обновлен',
      data: {
        id: contentRecord.id,
        page,
        section,
        updatedAt: contentRecord.updatedAt
      }
    });
  } catch (error) {
    console.error('Ошибка обновления контента:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Удаление контента страницы (только для админа)
exports.deletePageContent = async (req, res) => {
  try {
    const { page } = req.params;
    const { section } = req.query;

    if (!section) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать раздел для удаления'
      });
    }

    const content = await Content.findOne({
      where: { page, section }
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: `Контент для страницы ${page}, раздел ${section} не найден`
      });
    }

    await content.destroy();

    return res.status(200).json({
      success: true,
      message: 'Контент успешно удален',
      data: {
        page,
        section
      }
    });
  } catch (error) {
    console.error('Ошибка удаления контента:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 