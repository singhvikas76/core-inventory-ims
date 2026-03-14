<?php
// api/products.php
// Handles CRUD for products

require_once 'db.php';

header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Fetch products
        $stmt = $pdo->query("SELECT id, name, sku, category, uom, stock, price, min_stock FROM products ORDER BY name ASC");
        $products = $stmt->fetchAll();
        
        // Format for frontend
        $formatted = array_map(function($p) {
            return [
                'id' => $p['id'],
                'name' => $p['name'],
                'sku' => $p['sku'],
                'cat' => $p['category'],
                'uom' => $p['uom'],
                'stock' => (int)$p['stock'],
                'price' => '$' . number_format($p['price'], 2)
            ];
        }, $products);
        
        echo json_encode($formatted);

    } elseif ($method === 'POST') {
        // Create new product
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['name']) || !isset($data['sku'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Name and SKU are required"]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO products (name, sku, category, uom, stock, price, min_stock) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'],
            $data['sku'],
            $data['category'] ?? 'General',
            $data['uom'] ?? 'Units',
            $data['stock'] ?? 0,
            $data['price'] ?? 0.00,
            $data['min_stock'] ?? 10
        ]);

        echo json_encode(["status" => "success", "message" => "Product created successfully", "id" => $pdo->lastInsertId()]);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    // Handle duplicate SKU error (1062) uniquely
    if ($e->errorInfo[1] == 1062) {
        echo json_encode(["status" => "error", "message" => "A product with this SKU already exists."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    }
}
?>
