<?php

require_once __DIR__ . '/../auth_check.php';
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

$pdo    = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

// ── GET ─────────────────────────────────────────────────────
if ($method === 'GET') {
    $search = trim($_GET['search'] ?? '');
    $page   = max(1, (int)($_GET['page']  ?? 1));
    $limit  = max(1, (int)($_GET['limit'] ?? 10));
    $offset = ($page - 1) * $limit;

    $where  = $search ? 'WHERE nama LIKE :q' : '';
    $params = $search ? [':q' => "%$search%"] : [];

    // Total rows
    $cnt = $pdo->prepare("SELECT COUNT(*) FROM tamu $where");
    $cnt->execute($params);
    $total = (int)$cnt->fetchColumn();

    // Data halaman ini
    $stmt = $pdo->prepare("SELECT * FROM tamu $where ORDER BY id DESC LIMIT :lim OFFSET :off");
    foreach ($params as $k => $v) $stmt->bindValue($k, $v);
    $stmt->bindValue(':lim', $limit,  PDO::PARAM_INT);
    $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll();

    // Statistik keseluruhan (tanpa filter pencarian)
    $stats = $pdo->query("
        SELECT COUNT(*) total,
               SUM(status='Hadir')       hadir,
               SUM(status='Tidak Hadir') tidak_hadir,
               SUM(status='Menunggu')    menunggu
        FROM tamu
    ")->fetch();

    echo json_encode([
        'data'       => $rows,
        'total'      => $total,
        'totalPages' => max(1, (int)ceil($total / $limit)),
        'page'       => $page,
        'stats'      => $stats,
    ]);
    exit;
}

// ── POST — Tambah ────────────────────────────────────────────
if ($method === 'POST') {
    $nama     = trim($body['nama']     ?? '');
    $kategori = trim($body['kategori'] ?? 'Teman');
    $pax = ($body['pax'] !== '' && $body['pax'] !== null) ? (int)$body['pax'] : null;
    // Fallback otomatis
    if ($pax === null) {
        $pax = ($kategori === 'Keluarga') ? 4 : 2;
    }
    $status   = trim($body['status']   ?? 'Menunggu');
    $ucapan   = trim($body['ucapan']   ?? '');

    if (!$nama) { http_response_code(400); echo json_encode(['error' => 'Nama wajib diisi']); exit; }

    $stmt = $pdo->prepare("INSERT INTO tamu (nama, kategori, pax, status, ucapan) VALUES (?,?,?,?,?)");
    $stmt->execute([$nama, $kategori, $pax, $status, $ucapan]);

    http_response_code(201);
    echo json_encode(['success' => true, 'id' => (int)$pdo->lastInsertId()]);
    exit;
}

// ── PUT — Edit ───────────────────────────────────────────────
if ($method === 'PUT') {
    if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID diperlukan']); exit; }

    $nama     = trim($body['nama']     ?? '');
    $kategori = trim($body['kategori'] ?? 'Teman');
    $pax = ($body['pax'] !== '' && $body['pax'] !== null) ? (int)$body['pax'] : null;
    // Fallback otomatis
    if ($pax === null) {
        $pax = ($kategori === 'Keluarga') ? 4 : 2;
    }
    $status   = trim($body['status']   ?? 'Menunggu');
    $ucapan   = trim($body['ucapan']   ?? '');

    if (!$nama) { http_response_code(400); echo json_encode(['error' => 'Nama wajib diisi']); exit; }

    $stmt = $pdo->prepare("UPDATE tamu SET nama=?, kategori=?, pax=?, status=?, ucapan=? WHERE id=?");
    $stmt->execute([$nama, $kategori, $pax, $status, $ucapan, $id]);

    echo json_encode(['success' => true]);
    exit;
}

// ── DELETE — Hapus ───────────────────────────────────────────
if ($method === 'DELETE') {
    if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID diperlukan']); exit; }

    $pdo->prepare('DELETE FROM tamu WHERE id=?')->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);