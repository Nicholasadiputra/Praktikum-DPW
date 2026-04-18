<?php
session_start();
session_destroy();
header('Location: ../undangan/index.php');
exit;