#!/bin/bash

# ALRA Eco Village - Deployment Script
# Run this script after setup-server.sh

set -e  # Exit on error

APP_DIR="/var/www/alra"
DB_NAME="alra_eco_village"
DB_USER="alra_user"
DB_PASSWORD="CHANGE_THIS_PASSWORD"  # Change this!

echo "=========================================="
echo "ALRA Eco Village - Deployment"
echo "=========================================="

# Navigate to application directory
cd $APP_DIR

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install --production

# Copy production environment file
if [ -f ".env.production" ]; then
    cp .env.production .env
    echo "Production environment file configured"
else
    echo "Warning: .env.production not found"
fi

# Build client
echo "Building React client..."
cd ../client
npm install
npm run build

# Setup MySQL database
echo "Setting up MySQL database..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
sudo mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

echo "Database created. Please update .env.production with database credentials!"

# Run migrations
echo "Running database migrations..."
cd ../server
npm run migrate

# Configure Nginx
echo "Configuring Nginx..."
sudo cp ../nginx.conf /etc/nginx/sites-available/alra
sudo ln -sf /etc/nginx/sites-available/alra /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Start application with PM2
echo "Starting application with PM2..."
cd ..
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "=========================================="
echo "Deployment completed successfully!"
echo "=========================================="
echo ""
echo "Your application is now running at:"
echo "http://89.104.74.76"
echo ""
echo "Useful PM2 commands:"
echo "  pm2 status          - Check application status"
echo "  pm2 logs            - View application logs"
echo "  pm2 restart all     - Restart application"
echo "  pm2 stop all        - Stop application"
