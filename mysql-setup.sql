# ALRA Eco Village - Setup MySQL Database
# Run these commands in MySQL as root

CREATE DATABASE IF NOT EXISTS alra_eco_village;
CREATE USER IF NOT EXISTS 'alra_user'@'localhost' IDENTIFIED BY 'CHANGE_THIS_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON alra_eco_village.* TO 'alra_user'@'localhost';
FLUSH PRIVILEGES;

# To access MySQL as root on Ubuntu:
# sudo mysql

# To set MySQL root password (if needed):
# ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_new_password';
