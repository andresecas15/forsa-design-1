<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

// Sanitize inputs
function clean($val) {
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

$nombre   = clean($_POST['nombre']   ?? '');
$empresa  = clean($_POST['empresa']  ?? '');
$email    = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$telefono = clean($_POST['telefono'] ?? '');
$servicio = clean($_POST['servicio'] ?? '');
$mensaje  = clean($_POST['mensaje']  ?? '');

// Basic validation
if (empty($nombre) || empty($email) || empty($mensaje)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Por favor completa los campos requeridos.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'El email no es válido.']);
    exit;
}

// Destination
$to      = 'atencion@forsa.com.ve';
$subject = '=?UTF-8?B?' . base64_encode("Nuevo contacto web — $nombre") . '?=';

// Email body
$body = "
Nueva solicitud recibida desde el sitio web de FORSA.

Nombre:   $nombre
Empresa:  $empresa
Email:    $email
Teléfono: $telefono
Servicio: $servicio

Mensaje:
$mensaje

---
Enviado desde forsa.com.ve
";

// Headers
$headers  = "From: noreply@forsa.com.ve\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => '¡Mensaje enviado correctamente!']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al enviar. Por favor intente de nuevo.']);
}
