<?php

if (session_status() === PHP_SESSION_NONE) session_start();

if (empty($_SESSION['login']) || ($_SESSION['role'] ?? '') !== 'admin') {
    header('Location: ../undangan/index.php');
    exit;
}