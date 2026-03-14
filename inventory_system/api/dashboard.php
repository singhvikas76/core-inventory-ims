<?php
// api/dashboard.php
// Returns Dashboard KPIs and recent movements

require_once 'db.php';

header('Content-Type: application/json');

try {
    // 1. Total Products
    $stmt = $pdo->query("SELECT SUM(stock) AS total FROM products");
    $totalProducts = $stmt->fetchColumn() ?: 0;
    
    // 2. Low Stock Alerts
    $stmt = $pdo->query("SELECT COUNT(*) FROM products WHERE stock <= min_stock");
    $lowStock = $stmt->fetchColumn() ?: 0;
    
    // Low Stock List
    $stmt = $pdo->query("SELECT name as product, sku, stock, min_stock as min FROM products WHERE stock <= min_stock LIMIT 5");
    $lowStockList = $stmt->fetchAll();

    // 3. Pending Receipts
    $stmt = $pdo->query("SELECT COUNT(*) FROM stock_movements WHERE type = 'receipt' AND status != 'done'");
    $pendingReceipts = $stmt->fetchColumn() ?: 0;

    // 4. Pending Deliveries
    $stmt = $pdo->query("SELECT COUNT(*) FROM stock_movements WHERE type = 'delivery' AND status != 'done'");
    $pendingDeliveries = $stmt->fetchColumn() ?: 0;

    // 5. Pending Transfers
    $stmt = $pdo->query("SELECT COUNT(*) FROM stock_movements WHERE type = 'transfer' AND status != 'done'");
    $pendingTransfers = $stmt->fetchColumn() ?: 0;

    // 6. Recent Movements
    $stmt = $pdo->query("
        SELECT sm.id, p.name as product, sm.type, sm.qty, sm.source_location, sm.dest_location, sm.date_format(sm.created_at, '%Y-%m-%d %H:%i') as date, sm.status 
        FROM stock_movements sm
        JOIN products p ON sm.product_id = p.id
        ORDER BY sm.created_at DESC 
        LIMIT 5
    ");
    $recentMovements = $stmt->fetchAll();

//    // Format recent movements for frontend
    $formattedMovements = [];
    foreach ($recentMovements as $m) {
        $color = 'text-gray-500';
        $qtyStr = (string)$m['qty'];
        if ($m['type'] === 'receipt') {
            $color = 'text-green-600';
            $qtyStr = '+' . $m['qty'];
        } elseif ($m['type'] === 'delivery') {
            $color = 'text-red-500';
        } elseif ($m['type'] === 'transfer') {
            $color = 'text-blue-500';
        }

        $formattedMovements[] = [
            'id' => $m['id'],
            'product' => $m['product'],
            'type' => ucfirst($m['type']),
            'qty' => $qtyStr,
            'location' => $m['type'] === 'receipt' ? $m['dest_location'] : ($m['type'] === 'delivery' ? $m['source_location'] : $m['source_location'] . ' -> ' . $m['dest_location']),
            'date' => $m['date'],
            'status' => $m['status'],
            'color' => $color
        ];
    }

    $response = [
        'kpis' => [
            'products' => (int)$totalProducts,
            'lowStock' => (int)$lowStock,
            'receipts' => (int)$pendingReceipts,
            'deliveries' => (int)$pendingDeliveries,
            'transfers' => (int)$pendingTransfers
        ],
        'recentMovements' => $formattedMovements,
        'lowStockAlerts' => $lowStockList
    ];

    echo json_encode($response);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
