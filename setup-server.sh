#!/bin/bash

# ALRA Eco Village - Server Setup Script
# This script prepares Ubuntu server for deployment

set -e  # Exit on error

echo "=========================================="
echo "ALRA Eco Village - Server Setup"
echo "=========================================="

# Update system packages
echo "Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install Node.js 20.x
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
node -v
npm -v

# Install MySQL Server
echo "Installing MySQL Server..."
sudo apt install -y mysql-server

# Secure MySQL installation
echo "Securing MySQL installation..."
echo "Please run: sudo mysql_secure_installation"

# Install Nginx
echo "Installing Nginx..."
sudo apt install -y nginx

# Install PM2 globally
echo "Installing PM2..."
sudo npm install -g pm2

# Install Git
echo "Installing Git..."
sudo apt install -y git

# Create application directory
echo "Creating application directory..."
sudo mkdir -p /var/www/alra
sudo chown -R $USER:$USER /var/www/alra

# Create logs directory
mkdir -p /var/www/alra/logs

# Install firewall and configure
echo "Configuring firewall..."
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "=========================================="
echo "Server setup completed!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Configure MySQL database"
echo "2. Upload application files"
echo "3. Run deploy.sh script"
