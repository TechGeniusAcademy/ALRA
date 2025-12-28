# ALRA Eco Village - Краткая справка по командам

## Подключение к серверу
```bash
ssh root@89.104.74.76
# Пароль: yvaAaDiBKCQ8ybN4
```

## Управление приложением

### Проверка статуса
```bash
pm2 status
```

### Просмотр логов
```bash
pm2 logs
pm2 logs --lines 50  # Последние 50 строк
```

### Перезапуск
```bash
pm2 restart alra-backend
```

### Остановка/запуск
```bash
pm2 stop alra-backend
pm2 start alra-backend
```

## Управление Nginx

### Перезапуск Nginx
```bash
sudo systemctl restart nginx
```

### Проверка статуса
```bash
sudo systemctl status nginx
```

### Проверка конфигурации
```bash
sudo nginx -t
```

## Обновление приложения

### Быстрое обновление
```bash
cd /var/www/alra
./update.sh
```

### Ручное обновление
```bash
cd /var/www/alra

# Обновить сервер
cd server
npm install --production
cd ..

# Пересобрать клиент
cd client
npm run build
cd ..

# Перезапустить
pm2 restart alra-backend
```

## Просмотр логов

### Логи приложения
```bash
tail -f /var/www/alra/logs/out.log   # Вывод приложения
tail -f /var/www/alra/logs/err.log   # Ошибки приложения
```

### Логи Nginx
```bash
sudo tail -f /var/log/nginx/access.log  # Запросы
sudo tail -f /var/log/nginx/error.log   # Ошибки
```

## База данных

### Подключение к MySQL
```bash
sudo mysql -u alra_user -p alra_eco_village
```

### Резервная копия БД
```bash
mysqldump -u alra_user -p alra_eco_village > backup.sql
```

### Восстановление БД
```bash
mysql -u alra_user -p alra_eco_village < backup.sql
```

## Мониторинг системы

### Проверка использования ресурсов
```bash
pm2 monit          # Мониторинг PM2
htop               # Системный мониторинг (установите: sudo apt install htop)
df -h              # Свободное место на диске
free -h            # Использование памяти
```

### Проверка портов
```bash
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :5001
```

## Быстрое решение проблем

### Приложение не отвечает
```bash
pm2 restart alra-backend
sudo systemctl restart nginx
```

### Проверка, работает ли сервер
```bash
curl http://localhost:5001/
curl http://localhost:80/
```

### Очистка логов
```bash
pm2 flush  # Очистка PM2 логов
```

## Полезные адреса
- **Сайт**: http://89.104.74.76
- **API**: http://89.104.74.76/api
- **Админка**: http://89.104.74.76/admin
