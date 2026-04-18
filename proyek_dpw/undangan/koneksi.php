<?php

$host = "localhost";
$user = "root";
$pass = "";
$db   = "db_undangan";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Koneksi database gagal."]));
}
$conn->set_charset("utf8mb4");