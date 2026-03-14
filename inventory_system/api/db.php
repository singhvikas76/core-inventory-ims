<?php
// api/db.php
// Handles MySQL database connection using PDO

$host = 'localhost';
$db   = 'core_inventory';
$user = 'root'; // Default XAMPP username
$pass = '';     // Default XAMPP password
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // If database doesn't exist yet, we catch the error 
    // This allows setup_db.php to connect without a dbname first
    if ($e->getCode() == 1049) {
        $dsnWithoutDb = "mysql:host=$host;charset=$charset";
        try {
            $pdo = new PDO($dsnWithoutDb, $user, $pass, $options);
        } catch (\PDOException $e2) {
             header('HTTP/1.1 500 Internal Server Error');
             echo json_encode(["error" => "Connection failed: " . $e2->getMessage()]);
             exit;
        }
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(["error" => "Connection failed: " . $e->getMessage()]);
        exit;
    }
}
?>
