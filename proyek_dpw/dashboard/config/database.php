<?php
/**
* File: config/database.php
* Dipanggil oleh file PHP lain yang butuh akses database.
*/
// Data koneksi — sesuaikan dengan Laragon kamu
define('DB_HOST', 'localhost'); // server database (selalu localhost di Laragon)
define('DB_NAME', 'db_undangan'); // nama database yang dibuat di phpMyAdmin
define('DB_USER', 'root'); // username MySQL Laragon default: root
define('DB_PASS', ''); // password MySQL Laragon default: KOSONG
/**
* Fungsi getDB() — Mengembalikan koneksi PDO
* Dipanggil di semua file yang butuh akses database
*/
function getDB() {
$dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
try {
$pdo = new PDO($dsn, DB_USER, DB_PASS, [
PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // error tampil sbg exception
PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // hasil query jadi array
PDO::ATTR_EMULATE_PREPARES => false, // prepared statement asli
]);
return $pdo;
} catch (PDOException $e) {
// Jika gagal konek — hentikan program & tampilkan error
die("Koneksi database gagal: " . $e->getMessage());
}
}