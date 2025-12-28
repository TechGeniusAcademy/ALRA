#!/bin/bash

# ALRA Eco Village - Quick Update Script
# Use this script to quickly update and redeploy your application

set -e

APP_DIR="/var/www/alra"

echo "=========================================="
echo "ALRA Eco Village - Quick Update"
echo "=========================================="

cd $APP_DIR

# Pull latest changes (if using git)
if [ -d ".git" ]; then
    echo "Pulling latest changes from git..."
    git pull
fi

# Update server dependencies
echo "Updating server dependencies..."
cd server
npm install --production

# Rebuild client
echo "Rebuilding client..."
cd ../client
npm install
npm run build

# Restart application
echo "Restarting application..."
cd ..
pm2 restart alra-backend

echo "=========================================="
echo "Update completed successfully!"
echo "=========================================="
echo ""
echo "Application restarted and available at:"
echo "http://89.104.74.76"
