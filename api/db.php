<?php
// api/db.php
// MySQL connection using MySQLi (not PDO)

$host = "localhost";
$user = "root";      // default XAMPP username
$password = "";      // default XAMPP password
$database = "core_inventory";

$conn = mysqli_connect($host, $user, $password, $database);

// Check connection
if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}
?>