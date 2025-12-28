# Google Search Console Setup Guide

## 1. Подтверждение владения сайтом

### Способ 1: HTML тег (Рекомендуется)
1. Перейдите на https://search.google.com/search-console
2. Нажмите "Добавить ресурс"
3. Введите URL: `https://alraeco.com`
4. Выберите "HTML-тег"
5. Скопируйте код верификации (например: `abc123xyz`)
6. Откройте файл `client/public/index.html`
7. Раскомментируйте и замените строку:
   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
   ```
   на:
   ```html
   <meta name="google-site-verification" content="abc123xyz" />
   ```
8. Пересоберите и задеплойте проект
9. Вернитесь в Google Search Console и нажмите "Подтвердить"

### Способ 2: HTML файл
1. Скачайте HTML файл верификации из Search Console
2. Поместите его в `client/public/`
3. Пересоберите проект
4. Подтвердите в Search Console

## 2. Отправка карты сайта

После подтверждения владения:

1. В Google Search Console откройте ваш ресурс
2. В левом меню выберите "Файлы Sitemap"
3. Введите URL карты сайта: `https://alraeco.com/sitemap.xml`
4. Нажмите "Отправить"

## 3. Проверка robots.txt

Проверьте доступность файла:
```
https://alraeco.com/robots.txt
```

В Search Console:
1. Перейдите в "Настройки" → "Сканирование"
2. Проверьте, что robots.txt доступен

## 4. Мониторинг индексации

После отправки sitemap.xml:
- Проверяйте статус индексации в разделе "Покрытие"
- Обычно индексация занимает 1-7 дней

## 5. Дополнительные настройки

### Структурированные данные (Schema.org)
Рассмотрите возможность добавления JSON-LD разметки для:
- Организации
- Местоположения
- Отзывов
- Цен на номера

### Google Analytics
1. Создайте аккаунт в Google Analytics
2. Получите ID отслеживания (например: G-XXXXXXXXXX)
3. Добавьте скрипт Google Analytics в `client/public/index.html`

### Google My Business
Зарегистрируйте отель в Google My Business для отображения на картах

## Команды для деплоя после изменений

```bash
# На локальной машине
git add .
git commit -m "Add SEO meta tags and Google Search Console setup"
git push origin main

# На сервере
ssh root@89.104.74.76
cd /var/www/ALRA
git pull
cd client
npm run build
# Готово!
```

## Проверка

После деплоя проверьте:
- https://alraeco.com/robots.txt
- https://alraeco.com/sitemap.xml
- Мета-теги в исходном коде страницы (View Page Source)
