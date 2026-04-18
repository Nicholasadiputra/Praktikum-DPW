<?php

require 'koneksi.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Method tidak diizinkan."]);
    exit;
}

$nama      = trim($conn->real_escape_string($_POST['nama']      ?? ''));
$kehadiran = trim($conn->real_escape_string($_POST['kehadiran'] ?? ''));
$kategori  = trim($conn->real_escape_string($_POST['kategori']  ?? 'Teman'));
$pesan     = trim($conn->real_escape_string($_POST['pesan']     ?? ''));
$pax       = isset($_POST['pax']) && $_POST['pax'] !== '' ? (int)$_POST['pax'] : null;

if (!$nama || !$kehadiran) {
    echo json_encode(["status" => "error", "message" => "Nama dan kehadiran wajib diisi."]);
    exit;
}

// Sesuaikan nilai kehadiran ke ENUM tabel
// Form mengirim: 'present'/'absent' atau langsung 'Hadir'/'Tidak Hadir'
$statusMap = [
    'present'      => 'Hadir',
    'absent'       => 'Tidak Hadir',
    'Hadir'        => 'Hadir',
    'Tidak Hadir'  => 'Tidak Hadir',
];
$status = $statusMap[$kehadiran] ?? 'Menunggu';

// Sesuaikan kategori ke ENUM tabel
$kategoriMap = [
    'family'   => 'Keluarga',
    'friend'   => 'Teman',
    'Keluarga' => 'Keluarga',
    'Teman'    => 'Teman',
    'Rekan'    => 'Rekan',
];
$kategoriDB = $kategoriMap[$kategori] ?? 'Teman';

$paxSQL = $pax !== null ? $pax : 'NULL';

$sql = "INSERT INTO tamu (nama, kategori, pax, status, ucapan)
        VALUES ('$nama', '$kategoriDB', $paxSQL, '$status', '$pesan')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Terima kasih! Konfirmasi kamu sudah terkirim."]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal menyimpan data: " . $conn->error]);
}

$conn->close();