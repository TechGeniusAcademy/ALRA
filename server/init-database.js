const { Sequelize } = require('sequelize');
require('dotenv').config();

// Настройки подключения к базе данных
const sequelize = new Sequelize(
  process.env.DB_NAME || 'alra_eco_village',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log
  }
);

// Определение моделей
const Room = sequelize.define('room', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  capacity: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  amenities: {
    type: Sequelize.JSON,
    allowNull: true
  },
  status: {
    type: Sequelize.ENUM('available', 'maintenance'),
    defaultValue: 'available'
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at'
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'updated_at'
  }
}, {
  tableName: 'rooms',
  timestamps: true
});

const RoomImage = sequelize.define('roomImage', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  roomId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'room_id',
    onDelete: 'CASCADE'
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'image_url'
  },
  isMain: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    field: 'is_main'
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at'
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'updated_at'
  }
}, {
  tableName: 'room_images',
  timestamps: true
});

// Определение модели Booking
const Booking = sequelize.define('booking', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  clientName: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'client_name'
  },
  clientEmail: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'client_email',
    validate: {
      isEmail: true
    }
  },
  clientPhone: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'client_phone'
  },
  roomId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'room_id'
  },
  checkIn: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    field: 'check_in'
  },
  checkOut: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    field: 'check_out'
  },
  guests: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  totalPrice: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_price'
  },
  status: {
    type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'pending'
  },
  paymentStatus: {
    type: Sequelize.ENUM('unpaid', 'paid', 'refunded'),
    defaultValue: 'unpaid',
    field: 'payment_status'
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at'
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'updated_at'
  }
}, {
  tableName: 'bookings',
  timestamps: true
});

// Определение связей
Room.hasMany(RoomImage, { as: 'images', foreignKey: 'roomId' });
RoomImage.belongsTo(Room, { foreignKey: 'roomId' });
Room.hasMany(Booking, { as: 'bookings', foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

// Определение модели ContactSubmission
const ContactSubmission = sequelize.define('contactSubmission', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  subject: {
    type: Sequelize.STRING,
    allowNull: false
  },
  message: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('new', 'read', 'responded'),
    defaultValue: 'new'
  },
  adminNotes: {
    type: Sequelize.TEXT,
    allowNull: true,
    field: 'admin_notes'
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at'
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'updated_at'
  }
}, {
  tableName: 'contact_submissions',
  timestamps: true
});

// Определение модели Content
const Content = sequelize.define('content', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  page: {
    type: Sequelize.STRING,
    allowNull: false
  },
  section: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.JSON,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at'
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'updated_at'
  }
}, {
  tableName: 'content',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['page', 'section']
    }
  ]
});

// Определение модели Service
const Service = sequelize.define('service', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at'
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'updated_at'
  }
}, {
  tableName: 'services',
  timestamps: true
});

async function initDatabase() {
  try {
    // Проверка соединения
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено успешно.');

    // Синхронизация моделей с базой данных (создание таблиц)
    // Используем { alter: true } вместо { force: true }, чтобы не удалять существующие данные
    await sequelize.sync({ alter: true });
    console.log('Модели синхронизированы с базой данных.');

    // Создание тестовой комнаты, если нет комнат
    const roomCount = await Room.count();
    if (roomCount === 0) {
      console.log('Создаем тестовую комнату...');
      const room = await Room.create({
        title: 'Стандартный номер',
        description: 'Уютный номер со всеми удобствами',
        price: 2500.00,
        capacity: 2,
        amenities: JSON.stringify(['Wi-Fi', 'Кондиционер', 'Телевизор', 'Мини-бар']),
        status: 'available'
      });

      // Добавление тестовых изображений
      await RoomImage.create({
        roomId: room.id,
        imageUrl: '/images/rooms/standard-room-1.jpg',
        isMain: true
      });

      await RoomImage.create({
        roomId: room.id,
        imageUrl: '/images/rooms/standard-room-2.jpg',
        isMain: false
      });

      console.log('Тестовая комната создана успешно.');
    }

    // Создание тестового контента для главной страницы
    const contentCount = await Content.count();
    if (contentCount === 0) {
      console.log('Создаем тестовый контент...');
      
      await Content.create({
        page: 'home',
        section: 'about',
        content: {
          title: 'Мы создаем новую культуру туризма и сервис высочайшего уровня',
          text: 'ЭКО-ОТЕЛЬ "ALRA" — это уникальное место, которое сочетает в себе комфорт и заботу о природе. Удачное расположение коттеджей позволяет насладиться живописными пейзажами и уединением.'
        }
      });
      
      await Content.create({
        page: 'home',
        section: 'features',
        content: {
          title: 'Почему выбирают нас',
          features: [
            {
              icon: 'leaf',
              title: 'Экологичность',
              description: 'Мы заботимся о природе и используем экологически чистые материалы'
            },
            {
              icon: 'wifi',
              title: 'Современные удобства',
              description: 'Комфортное проживание со всеми современными удобствами'
            },
            {
              icon: 'utensils',
              title: 'Вкусная еда',
              description: 'Натуральные продукты и блюда от нашего шеф-повара'
            }
          ]
        }
      });
      
      console.log('Тестовый контент создан успешно.');
    }

    // Создание таблицы услуг (services)
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        active BOOLEAN DEFAULT true,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Таблица услуг создана успешно.');

    // Создание таблицы связи бронирований и услуг (booking_services)
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS booking_services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        service_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
      )
    `);
    console.log('Таблица связи бронирований и услуг создана успешно.');

    // Создание тестовых услуг
    const serviceCount = await Service.count();
    if (serviceCount === 0) {
      console.log('Создаем тестовые услуги...');
      
      await Service.bulkCreate([
        {
          name: 'Трансфер из аэропорта',
          description: 'Комфортабельный трансфер из аэропорта Сухуми до эко-виллы ALRA (в одну сторону).',
          price: 2500,
          active: true,
          image: 'https://example.com/images/transfer.jpg'
        },
        {
          name: 'Завтрак',
          description: 'Свежий завтрак с местными продуктами для 2 персон.',
          price: 1000,
          active: true,
          image: 'https://example.com/images/breakfast.jpg'
        },
        {
          name: 'Ужин',
          description: 'Традиционный абхазский ужин для 2 персон с местными деликатесами.',
          price: 1500,
          active: true,
          image: 'https://example.com/images/dinner.jpg'
        },
        {
          name: 'Экскурсия по окрестностям',
          description: 'Групповая экскурсия по живописным окрестностям с местным гидом (4 часа).',
          price: 3000,
          active: true,
          image: 'https://example.com/images/excursion.jpg'
        },
        {
          name: 'Аренда велосипеда',
          description: 'Аренда горного велосипеда на целый день.',
          price: 1200,
          active: true,
          image: 'https://example.com/images/bicycle.jpg'
        }
      ]);
      
      console.log('Тестовые услуги созданы успешно.');
    }

    console.log('Инициализация базы данных завершена успешно.');
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
  } finally {
    // Закрытие соединения
    await sequelize.close();
  }
}

initDatabase(); 