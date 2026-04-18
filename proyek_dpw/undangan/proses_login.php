<?php
session_start();
require 'koneksi.php';
header('Content-Type: application/json');

// Tamu langsung masuk tanpa cek database
if (isset($_POST['guest'])) {
    $_SESSION['login'] = true;
    $_SESSION['role']  = 'tamu';
    echo json_encode(["status" => "success", "role" => "tamu", "redirect" => "utama.php"]);
    exit;
}

// Admin → cek database
$username = trim($conn->real_escape_string($_POST['user'] ?? ''));
$password = $_POST['pass'] ?? '';

$sql    = "SELECT * FROM users WHERE username = '$username' AND role = 'admin' LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password'])) {
        $_SESSION['login']    = true;
        $_SESSION['user_id']  = $row['id'];
        $_SESSION['username'] = $row['username'];
        $_SESSION['role']     = 'admin';
        echo json_encode(["status" => "success", "role" => "admin", "redirect" => "../dashboard/index.php"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Password salah."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Username tidak ditemukan."]);
}
$conn->close();