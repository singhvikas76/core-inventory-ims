-- phpMyAdmin SQL Dump
-- Host: localhost
-- Database: core_inventory

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Database: `core_inventory`
--
CREATE DATABASE IF NOT EXISTS `core_inventory` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `core_inventory`;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `category` varchar(100) NOT NULL,
  `uom` varchar(50) DEFAULT 'Units',
  `stock` int(11) DEFAULT 0,
  `price` decimal(10,2) DEFAULT 0.00,
  `min_stock` int(11) DEFAULT 10,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`name`, `sku`, `category`, `uom`, `stock`, `price`, `min_stock`) VALUES
('Wireless Mouse X1', 'MOU-WL-X1', 'Electronics', 'Units', 145, 24.99, 50),
('Mechanical Keyboard Z', 'KBD-MECH-Z', 'Electronics', 'Units', 5, 89.00, 20),
('Office Chair Ergonomic', 'FURN-CHR-ERG', 'Furniture', 'Units', 42, 199.50, 10),
('A4 Printing Paper', 'OFF-PAP-A4', 'Stationery', 'Box', 500, 35.00, 100),
('USB-C Cable 2m', 'CBL-USBC-2M', 'Accessories', 'Units', 320, 12.99, 100),
('Wireless Earbuds Pro', 'AUD-EAR-P', 'Electronics', 'Units', 2, 129.00, 15),
('Laptop Stand Aluminum', 'ACC-LST-A', 'Accessories', 'Units', 8, 45.00, 30);

-- --------------------------------------------------------

--
-- Table structure for table `warehouses`
--

CREATE TABLE IF NOT EXISTS `warehouses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `warehouses`
--

INSERT INTO `warehouses` (`name`, `location`) VALUES
('Main Warehouse (WH)', '123 Logistics Ave, NY 10001'),
('Retail Store East (RET-E)', '456 Market St, NY 10002');

-- --------------------------------------------------------

--
-- Table structure for table `stock_movements`
--

CREATE TABLE IF NOT EXISTS `stock_movements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) DEFAULT NULL,
  `type` enum('receipt','delivery','transfer','adjustment') NOT NULL,
  `qty` int(11) NOT NULL,
  `source_location` varchar(255) DEFAULT NULL,
  `dest_location` varchar(255) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `status` enum('draft','waiting','ready','done') DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `stock_movements_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stock_movements`
--

INSERT INTO `stock_movements` (`product_id`, `type`, `qty`, `source_location`, `dest_location`, `reference`, `status`) VALUES
(1, 'receipt', 50, 'Vendors', 'WH/Rack A', 'WH/IN/00010', 'done'),
(2, 'delivery', -2, 'WH/Rack B', 'Customers', 'WH/OUT/00023', 'done'),
(5, 'transfer', 100, 'WH/Receiving', 'WH/Rack C', 'WH/INT/00005', 'done'),
(3, 'receipt', 15, 'Vendors', 'WH/Receiving', 'WH/IN/00012', 'waiting'),
(4, 'delivery', -5, 'WH/Rack A', 'Customers', 'WH/OUT/00024', 'ready');

COMMIT;
