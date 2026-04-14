<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "db_pernikahan"; // Sesuaikan dengan nama database di phpMyAdmin

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>