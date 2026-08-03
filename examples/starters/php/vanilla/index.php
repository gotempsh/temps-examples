<?php
header('Content-Type: application/json');

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($path === '/health') {
    echo json_encode(['status' => 'ok']);
    exit;
}

if ($path === '/') {
    echo json_encode(['message' => 'Hello from PHP on Temps!']);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Not found']);
