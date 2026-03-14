<?php
// api/setup_db.php
// Utility script to initialize database, schema, and dummy data for CoreInventory

require_once 'db.php';

header('Content-Type: application/json');

try {
    // 1. Create Database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS core_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE core_inventory");

    // 2. Create Products Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(100) UNIQUE NOT NULL,
        category VARCHAR(100) NOT NULL,
        uom VARCHAR(50) DEFAULT 'Units',
        stock INT DEFAULT 0,
        price DECIMAL(10, 2) DEFAULT 0.00,
        min_stock INT DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // 3. Create Warehouses Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS warehouses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // 4. Create Stock Movements Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS stock_movements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        type ENUM('receipt', 'delivery', 'transfer', 'adjustment') NOT NULL,
        qty INT NOT NULL,
        source_location VARCHAR(255),
        dest_location VARCHAR(255),
        reference VARCHAR(100),
        status ENUM('draft', 'waiting', 'ready', 'done') DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )");

    // --- Insert Dummy Data if empty ---

    // Check if products exist
    $stmt = $pdo->query("SELECT COUNT(*) FROM products");
    if ($stmt->fetchColumn() == 0) {
        $products = [
            ['Wireless Mouse X1', 'MOU-WL-X1', 'Electronics', 'Units', 145, 24.99, 50],
            ['Mechanical Keyboard Z', 'KBD-MECH-Z', 'Electronics', 'Units', 5, 89.00, 20],
            ['Office Chair Ergonomic', 'FURN-CHR-ERG', 'Furniture', 'Units', 42, 199.50, 10],
            ['A4 Printing Paper', 'OFF-PAP-A4', 'Stationery', 'Box', 500, 35.00, 100],
            ['USB-C Cable 2m', 'CBL-USBC-2M', 'Accessories', 'Units', 320, 12.99, 100],
            ['Wireless Earbuds Pro', 'AUD-EAR-P', 'Electronics', 'Units', 2, 129.00, 15],
            ['Laptop Stand Aluminum', 'ACC-LST-A', 'Accessories', 'Units', 8, 45.00, 30]
        ];

        $stmt = $pdo->prepare("INSERT INTO products (name, sku, category, uom, stock, price, min_stock) VALUES (?, ?, ?, ?, ?, ?, ?)");
        foreach ($products as $p) {
            $stmt->execute($p);
        }
        
        $warehouses = [
            ['Main Warehouse (WH)', '123 Logistics Ave, NY 10001'],
            ['Retail Store East (RET-E)', '456 Market St, NY 10002']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO warehouses (name, location) VALUES (?, ?)");
        foreach ($warehouses as $w) {
            $stmt->execute($w);
        }

        // Movements
        $movements = [
            [1, 'receipt', 50, 'Vendors', 'WH/Rack A', 'WH/IN/00010', 'done'],
            [2, 'delivery', -2, 'WH/Rack B', 'Customers', 'WH/OUT/00023', 'done'],
            [5, 'transfer', 100, 'WH/Receiving', 'WH/Rack C', 'WH/INT/00005', 'done'],
            [3, 'receipt', 15, 'Vendors', 'WH/Receiving', 'WH/IN/00012', 'waiting'],
            [4, 'delivery', -5, 'WH/Rack A', 'Customers', 'WH/OUT/00024', 'ready']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO stock_movements (product_id, type, qty, source_location, dest_location, reference, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
        foreach ($movements as $m) {
            $stmt->execute($m);
        }
        
        echo json_encode(["status" => "success", "message" => "Database initialized and dummy data inserted."]);
    } else {
        echo json_encode(["status" => "info", "message" => "Database schema verified. Data already exists."]);
    }

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database setup failed: " . $e->getMessage()]);
}
?>
