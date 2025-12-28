# Deployment script for ALRA to VPS
$SERVER_IP = "89.104.74.76"
$SERVER_USER = "root"
$DOMAIN = "alraeco.com"
$REPO_URL = "https://github.com/TechGeniusAcademy/ALRA.git"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ALRA Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Function to execute SSH commands
function Invoke-SSHCommand {
    param([string]$Command)
    
    Write-Host "> Executing: $Command" -ForegroundColor Yellow
    ssh ${SERVER_USER}@${SERVER_IP} "$Command"
}

# Step 1: Update system and install dependencies
Write-Host "`n[1/9] Updating system and installing dependencies..." -ForegroundColor Green
Invoke-SSHCommand "apt update && apt upgrade -y"
Invoke-SSHCommand "apt install -y curl git nginx mysql-server build-essential"

# Step 2: Install Node.js 18.x
Write-Host "`n[2/9] Installing Node.js..." -ForegroundColor Green
Invoke-SSHCommand "curl -fsSL https://deb.nodesource.com/setup_18.x | bash -"
Invoke-SSHCommand "apt install -y nodejs"
Invoke-SSHCommand "npm install -g pm2"

# Step 3: Clone repository
Write-Host "`n[3/9] Cloning repository..." -ForegroundColor Green
Invoke-SSHCommand "cd /var/www && rm -rf ALRA && git clone $REPO_URL"

# Step 4: Setup MySQL
Write-Host "`n[4/9] Setting up MySQL database..." -ForegroundColor Green
Invoke-SSHCommand @"
mysql -e \"CREATE DATABASE IF NOT EXISTS alra_hotel;\"
mysql -e \"CREATE USER IF NOT EXISTS 'alra_user'@'localhost' IDENTIFIED BY 'AlraHotel2024!';\"
mysql -e \"GRANT ALL PRIVILEGES ON alra_hotel.* TO 'alra_user'@'localhost';\"
mysql -e \"FLUSH PRIVILEGES;\"
"@

# Step 5: Install server dependencies
Write-Host "`n[5/9] Installing server dependencies..." -ForegroundColor Green
Invoke-SSHCommand "cd /var/www/ALRA/server && npm install"

# Step 6: Setup environment variables for server
Write-Host "`n[6/9] Setting up environment variables..." -ForegroundColor Green
Invoke-SSHCommand @"
cat > /var/www/ALRA/server/.env << 'EOF'
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=alra_user
DB_PASSWORD=AlraHotel2024!
DB_NAME=alra_hotel
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EMAIL_FROM=noreply@alraeco.com
EOF
"@

# Initialize database
Write-Host "`n[6.5/9] Initializing database..." -ForegroundColor Green
Invoke-SSHCommand "cd /var/www/ALRA/server && node init-database.js"

# Step 7: Install client dependencies and build
Write-Host "`n[7/9] Building client..." -ForegroundColor Green
Invoke-SSHCommand "cd /var/www/ALRA/client && npm install"

# Create client .env
Invoke-SSHCommand @"
cat > /var/www/ALRA/client/.env.production << 'EOF'
REACT_APP_API_URL=https://alraeco.com/api
EOF
"@

Invoke-SSHCommand "cd /var/www/ALRA/client && npm run build"

# Step 8: Configure Nginx
Write-Host "`n[8/9] Configuring Nginx..." -ForegroundColor Green
Invoke-SSHCommand @"
cat > /etc/nginx/sites-available/alraeco.com << 'EOF'
server {
    listen 80;
    server_name alraeco.com www.alraeco.com;

    # Client (React build)
    location / {
        root /var/www/ALRA/client/build;
        try_files \`$uri \`$uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \`$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \`$host;
        proxy_cache_bypass \`$http_upgrade;
        proxy_set_header X-Real-IP \`$remote_addr;
        proxy_set_header X-Forwarded-For \`$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \`$scheme;
    }

    # Uploads
    location /uploads {
        alias /var/www/ALRA/server/uploads;
    }
}
EOF
"@

Invoke-SSHCommand "ln -sf /etc/nginx/sites-available/alraeco.com /etc/nginx/sites-enabled/"
Invoke-SSHCommand "rm -f /etc/nginx/sites-enabled/default"
Invoke-SSHCommand "nginx -t && systemctl restart nginx"

# Step 9: Start server with PM2
Write-Host "`n[9/9] Starting server with PM2..." -ForegroundColor Green
Invoke-SSHCommand "cd /var/www/ALRA/server && pm2 delete alra-server 2>/dev/null || true"
Invoke-SSHCommand "cd /var/www/ALRA/server && pm2 start server.js --name alra-server"
Invoke-SSHCommand "pm2 save"
Invoke-SSHCommand "pm2 startup systemd -u root --hp /root | tail -1 | bash"

# Final status
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nYour application should be accessible at:" -ForegroundColor White
Write-Host "http://alraeco.com" -ForegroundColor Yellow
Write-Host "`nTo enable HTTPS, run this on the server:" -ForegroundColor White
Write-Host "apt install certbot python3-certbot-nginx -y" -ForegroundColor Yellow
Write-Host "certbot --nginx -d alraeco.com -d www.alraeco.com" -ForegroundColor Yellow
Write-Host "`nUseful commands:" -ForegroundColor White
Write-Host "  pm2 status          - Check server status" -ForegroundColor Cyan
Write-Host "  pm2 logs alra-server - View logs" -ForegroundColor Cyan
Write-Host "  pm2 restart alra-server - Restart server" -ForegroundColor Cyan
