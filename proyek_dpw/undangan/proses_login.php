<?php
session_start();
require 'koneksi.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = $conn->real_escape_string($_POST['user']);
    $pass = $_POST['pass'];

    $sql = "SELECT * FROM admin WHERE username = '$user'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        // Gunakan password_verify jika password di database di-hash, jika plaintext gunakan ==
        if (password_verify($pass, $row['password'])) { 
            $_SESSION['login'] = true;
            $_SESSION['username'] = $user;
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Password salah"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "User tidak ditemukan"]);
    }
}
$conn->close();

?>