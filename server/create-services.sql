DROP TABLE IF EXISTS services;

CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO services (name, description, price, active) VALUES
('Завтрак', 'Полноценный завтрак на террасе с видом на горы', 1000, true),
('Трансфер', 'Трансфер из/в аэропорт или ж/д вокзал', 2500, true),
('Экскурсия', 'Экскурсия по окрестностям с гидом', 3500, true),
('СПА процедуры', 'Комплекс СПА процедур в нашем центре', 5000, true),
('Аренда велосипеда', 'Аренда велосипеда на весь день', 1500, true); 