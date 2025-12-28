# ALRA Eco Village Backend

Бэкенд для сайта ALRA Eco Village с API для управления контентом, бронированиями и контактными формами.

## Технологии

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT для аутентификации
- Nodemailer для отправки email
- Multer для загрузки файлов

## Предварительные требования

- Node.js (v14+)
- MySQL (v5.7+)

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:

```bash
cd backend
npm install
```

3. Создайте файл `.env` в корневой директории бэкенда со следующим содержимым:

```
# Настройки сервера
PORT=5000
NODE_ENV=development

# Настройки базы данных MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ваш_пароль
DB_NAME=alra_eco_village
DB_PORT=3306

# Настройки JWT
JWT_SECRET=ваш_секретный_ключ
JWT_EXPIRES_IN=24h

# Настройки SMTP для отправки email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=ваш_пароль_email
EMAIL_FROM=info@alra-eco.com
```

4. Создайте базу данных MySQL:

```sql
CREATE DATABASE alra_eco_village;
```

5. Инициализируйте базу данных (создаст таблицы и базовых пользователей):

```bash
node utils/dbInit.js
```

## Запуск

Для запуска в режиме разработки:

```bash
npm run dev
```

Для запуска в режиме продакшн:

```bash
npm start
```

Сервер будет доступен по адресу: `http://localhost:5000`

## API Документация

### Публичные эндпоинты

- `GET /api/rooms` - Получение всех комнат
- `GET /api/rooms/:id` - Получение информации о конкретной комнате
- `GET /api/rooms/availability` - Проверка доступности комнат на даты
- `POST /api/bookings` - Создание запроса на бронирование
- `POST /api/contact` - Отправка контактной формы
- `GET /api/content/:page` - Получение контента для страницы

### Административные эндпоинты (требуют аутентификации)

- `POST /api/auth/login` - Вход администратора
- `GET /api/auth/me` - Получение информации о текущем администраторе

#### Управление комнатами (админ)
- `POST /api/rooms` - Создание новой комнаты
- `PUT /api/rooms/:id` - Обновление информации о комнате
- `DELETE /api/rooms/:id` - Удаление комнаты

#### Управление бронированиями (админ)
- `GET /api/admin/bookings` - Получение всех бронирований
- `GET /api/admin/bookings/:id` - Получение информации о бронировании
- `PUT /api/admin/bookings/:id` - Обновление бронирования
- `DELETE /api/admin/bookings/:id` - Отмена бронирования

#### Управление контактами (админ)
- `GET /api/admin/contacts` - Получение заявок через контактную форму
- `GET /api/admin/contacts/:id` - Получение информации о заявке
- `PUT /api/admin/contacts/:id` - Обновление статуса заявки
- `DELETE /api/admin/contacts/:id` - Удаление заявки

#### Управление контентом (админ)
- `PUT /api/admin/content/:page` - Обновление содержимого страницы
- `DELETE /api/admin/content/:page` - Удаление содержимого страницы

#### Управление файлами (админ)
- `POST /api/admin/uploads` - Загрузка изображений

## Структура проекта

```
/backend
  /config        - Конфигурационные файлы
  /controllers   - Контроллеры для обработки запросов
  /middleware    - Промежуточное ПО (авторизация и т.д.)
  /models        - Модели базы данных
  /routes        - API маршруты
  /utils         - Вспомогательные функции
  /uploads       - Папка для загруженных файлов
  server.js      - Основной файл сервера
  package.json   - Зависимости бэкенда
```

## Данные по умолчанию

После инициализации базы данных будут созданы следующие данные:

- Администратор: 
  - username: admin
  - password: admin123
  - email: admin@alra-eco.com

- Тестовая комната: "Стандартный номер" 