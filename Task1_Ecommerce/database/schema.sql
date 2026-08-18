CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500),
    category VARCHAR(100),
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    address VARCHAR(500) NOT NULL,
    status ENUM('PLACED','PROCESSING','SHIPPED','DELIVERED','CANCELLED') DEFAULT 'PLACED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO products (name, description, price, image, category, stock) VALUES
('Wireless Headphones',
 'Premium wireless headphones with deep bass, noise isolation and long battery life.',
 1999.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'Electronics', 20),
('Mechanical Keyboard',
 'RGB mechanical keyboard with tactile switches and a compact professional design.',
 2999.00, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', 'Electronics', 15),
('Smart Watch',
 'Modern smart watch with fitness tracking, notifications and heart-rate monitoring.',
 3499.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 'Wearables', 12),
('Running Shoes',
 'Lightweight running shoes designed for everyday comfort and training.',
 2499.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'Fashion', 25),
('Backpack',
 'Water-resistant laptop backpack with multiple compartments for college and work.',
 1499.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 'Accessories', 30),
('Sunglasses',
 'Classic UV-protection sunglasses with a lightweight frame.',
 999.00, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800', 'Fashion', 18)
ON DUPLICATE KEY UPDATE name = VALUES(name);