#!/bin/bash

# ALRA Deployment Script for VPS
# This script should be executed on the server

set -e  # Exit on error

echo "========================================"
echo "ALRA Hotel Deployment Script"
echo "========================================"

# Variables
DOMAIN="alraeco.com"
REPO_URL="https://github.com/TechGeniusAcademy/ALRA.git"
APP_DIR="/var/www/ALRA"
DB_NAME="alra_hotel"
DB_USER="alra_user"
DB_PASS="AlraHotel2024!"

# Step 1: Update system
echo "[1/10] Updating system..."
apt update && apt upgrade -y

# Step 2: Install dependencies
echo "[2/10] Installing dependencies..."
apt install -y curl git nginx mysql-server build-essential

# Step 3: Install Node.js 20.x (for better compatibility)
echo "[3/10] Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2

# Step 4: Start and secure MySQL
echo "[4/10] Configuring MySQL..."
systemctl start mysql
systemctl enable mysql

# Create database and user
mysql <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

# Step 5: Clone repository
echo "[5/10] Cloning repository..."
cd /var/www
rm -rf ALRA
git clone ${REPO_URL}
cd ${APP_DIR}

# Step 6: Setup server
echo "[6/10] Setting up server..."
cd ${APP_DIR}/server
npm install

# Create .env file
cat > .env <<EOF
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASS}
DB_NAME=${DB_NAME}
JWT_SECRET=$(openssl rand -hex 32)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EMAIL_FROM=noreply@${DOMAIN}
EOF

# Initialize database
echo "[6.5/10] Initializing database..."
node init-database.js

# Step 7: Setup client
echo "[7/10] Setting up client..."
cd ${APP_DIR}/client
npm install

# Create client .env
cat > .env.production <<EOF
REACT_APP_API_URL=https://${DOMAIN}/api
EOF

# Build client
npm run build

# Step 8: Configure Nginx
echo "[8/10] Configuring Nginx..."
cat > /etc/nginx/sites-available/${DOMAIN} <<'NGINXCONF'
server {
    listen 80;
    server_name alraeco.com www.alraeco.com;

    client_max_body_size 10M;

    # Client (React build)
    location / {
        root /var/www/ALRA/client/build;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads
    location /uploads {
        alias /var/www/ALRA/server/uploads;
        add_header Cache-Control "public, max-age=31536000";
    }
}
NGINXCONF

# Enable site
ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart nginx
nginx -t
systemctl restart nginx

# Step 9: Start server with PM2
echo "[9/10] Starting server with PM2..."
cd ${APP_DIR}/server
pm2 delete alra-server 2>/dev/null || true
pm2 start server.js --name alra-server
pm2 save
pm2 startup systemd -u root --hp /root

# Step 10: Setup SSL
echo "[10/10] Setting up SSL..."
apt install -y certbot python3-certbot-nginx
certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --register-unsafely-without-email || echo "SSL setup failed or skipped"

echo "========================================"
echo "Deployment Complete!"
echo "========================================"
echo ""
echo "Your application is accessible at:"
echo "https://${DOMAIN}"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check server status"
echo "  pm2 logs alra-server    - View server logs"
echo "  pm2 restart alra-server - Restart server"
echo "  pm2 stop alra-server    - Stop server"
echo ""
echo "Database credentials:"
echo "  Database: ${DB_NAME}"
echo "  User: ${DB_USER}"
echo "  Password: ${DB_PASS}"
echo ""
echo "To create an admin user, run:"
echo "  cd ${APP_DIR}/server && node scripts/create-admin.js"
