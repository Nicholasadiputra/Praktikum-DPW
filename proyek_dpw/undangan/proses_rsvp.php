<?php
require 'koneksi.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama = $conn->real_escape_string($_POST['nama']);
    $kehadiran = $conn->real_escape_string($_POST['kehadiran']);
    $kategori = $conn->real_escape_string($_POST['kategori']);
    $pesan = $conn->real_escape_string($_POST['pesan']);

    $sql = "INSERT INTO tamu (nama, kehadiran, kategori, pesan) VALUES ('$nama', '$kehadiran', '$kategori', '$pesan')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Terima kasih! Konfirmasi kamu sudah terkirim."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menyimpan data: " . $conn->error]);
    }
}
$conn->close();
?>