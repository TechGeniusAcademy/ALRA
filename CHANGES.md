# Изменения в проекте для деплоя

## Измененные файлы

### 1. server/server.js
**Что изменено**: Обновлена конфигурация CORS

**Было**:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Стало**:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://89.104.74.76',
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

**Зачем**: Поддержка production URL и гибкая конфигурация CORS

## Созданные файлы

### Конфигурация Production

1. **server/.env.production**
   - Production переменные окружения для сервера
   - Настройки базы данных
   - JWT конфигурация
   - CORS настройки

2. **client/.env.production**
   - URL API для production: `http://89.104.74.76:5001/api`

3. **.gitignore**
   - Исключение node_modules, .env файлов, логов

### Конфигурация сервисов

4. **ecosystem.config.js**
   - PM2 конфигурация для управления Node.js процессом
   - Автоперезапуск, логирование, мониторинг

5. **nginx.conf**
   - Прокси для API запросов
   - Обслуживание статических файлов React
   - Gzip сжатие
   - Кеширование
   - Security headers

### Скрипты развертывания

6. **setup-server.sh**
   - Установка Node.js, MySQL, Nginx, PM2
   - Настройка firewall
   - Создание директорий

7. **deploy.sh**
   - Установка зависимостей
   - Сборка React приложения
   - Настройка базы данных
   - Конфигурация Nginx
   - Запуск через PM2

8. **update.sh**
   - Быстрое обновление приложения
   - Pull изменений из git
   - Пересборка и перезапуск

9. **mysql-setup.sql**
   - SQL команды для создания БД и пользователя

### Windows инструменты

10. **deploy-from-windows.ps1**
    - PowerShell скрипт для загрузки на сервер
    - Автоматическое создание архива
    - Загрузка через PSCP

### Документация

11. **DEPLOYMENT.md**
    - Полная пошаговая инструкция
    - Все команды и конфигурации
    - Решение проблем

12. **DEPLOYMENT_CHECKLIST.md**
    - Чеклист для проверки всех этапов
    - Быстрая диагностика проблем

13. **QUICK_REFERENCE.md**
    - Краткая справка по командам
    - Управление сервисами
    - Просмотр логов

14. **WINSCP_GUIDE.md**
    - Инструкция по WinSCP
    - Альтернативные способы загрузки

15. **README_DEPLOY.md**
    - Обзор всех файлов деплоя
    - Быстрый старт
    - Структура проекта

16. **CHANGES.md** (этот файл)
    - Список всех изменений
    - Что и зачем было изменено

## Не изменено

Следующие части проекта остались без изменений:
- Вся бизнес-логика приложения
- React компоненты
- API endpoints
- Модели базы данных
- Контроллеры и сервисы
- Миграции и сидеры

## Что нужно сделать вручную

После загрузки проекта на сервер:

1. **Установить пароль MySQL**
   - В `server/.env.production`
   - В `deploy.sh`
   - При создании пользователя БД

2. **Опционально**:
   - Настроить email (SMTP) в `.env.production`
   - Настроить SSL сертификат
   - Настроить доменное имя

## Зависимости

Проект требует на сервере:
- Ubuntu 20.04+
- Node.js 20.x
- MySQL 8.0+
- Nginx 1.18+
- PM2 (latest)

Все зависимости автоматически устанавливаются скриптом `setup-server.sh`

## Архитектура деплоя

```
Internet
    ↓
Nginx (порт 80)
    ├── / → React static files (client/build)
    ├── /api → Node.js (localhost:5001)
    └── /uploads → Static files (server/uploads)
         ↓
Node.js + Express (порт 5001)
         ↓
MySQL (порт 3306, только localhost)
```

## Безопасность

Реализовано:
- Firewall (UFW) - только SSH, HTTP, HTTPS
- CORS ограничения
- Security headers в Nginx
- JWT authentication
- MySQL локальный доступ только

Рекомендуется добавить:
- SSL/TLS сертификат (Let's Encrypt)
- Rate limiting
- Регулярные бэкапы БД
- Мониторинг и алерты

## Поддержка

Все инструкции и решения проблем описаны в:
- DEPLOYMENT.md - полная документация
- QUICK_REFERENCE.md - быстрая справка
- DEPLOYMENT_CHECKLIST.md - чеклист

---

Дата подготовки: 19 декабря 2025
