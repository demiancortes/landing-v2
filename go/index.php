<?php

require 'db.php';

$slug = trim($_GET['slug'] ?? '');

if ($slug === '') {
    http_response_code(404);
    exit('Enlace no encontrado');
}

$stmt = $pdo->prepare("SELECT * FROM links WHERE slug = ? AND activo = 1 LIMIT 1");
$stmt->execute([$slug]);

$link = $stmt->fetch();

if (!$link) {
    http_response_code(404);
    exit('Enlace no encontrado');
}

$imagen = !empty($link['imagen']) ? $link['imagen'] : 'default.jpg';

$titulo = htmlspecialchars($link['titulo'] ?? '', ENT_QUOTES, 'UTF-8');
$descripcion = htmlspecialchars($link['descripcion'] ?? '', ENT_QUOTES, 'UTF-8');
$destino = $link['destino'] ?? '';

$imagenUrl = 'https://persianasvizual.com/go/img/' . rawurlencode($imagen);
$urlActual = 'https://persianasvizual.com/go/' . rawurlencode($slug);

/*
|--------------------------------------------------------------------------
| Detectar bots y crawlers
|--------------------------------------------------------------------------
*/

$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

$botPattern = '/bot|crawler|spider|facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|slackbot|discordbot|telegrambot|pinterest|googlebot|bingbot|yandex|duckduckbot|applebot|ahrefs|semrush|mj12bot|bytespider|curl|wget|python|postman|insomnia/i';

$esBot = preg_match($botPattern, $userAgent);

/*
|--------------------------------------------------------------------------
| Solo contar GET reales
|--------------------------------------------------------------------------
*/

$esGet = ($_SERVER['REQUEST_METHOD'] ?? '') === 'GET';

$clickReal = $esGet && !$esBot;

if ($clickReal) {
    $update = $pdo->prepare("UPDATE links SET clicks = clicks + 1, ultimo_click = NOW() WHERE id = ?");
    $update->execute([$link['id']]);
}

/*
|--------------------------------------------------------------------------
| Los bots reciben únicamente la preview
|--------------------------------------------------------------------------
*/

$redirigir = $clickReal && $destino !== '';

?>

<!DOCTYPE html>
<html lang="es">

<head>

<meta charset="utf-8">

<title><?= $titulo ?></title>

<meta name="robots" content="index, follow">

<meta property="og:title" content="<?= $titulo ?>">
<meta property="og:description" content="<?= $descripcion ?>">
<meta property="og:image" content="<?= htmlspecialchars($imagenUrl, ENT_QUOTES, 'UTF-8') ?>">
<meta property="og:url" content="<?= $urlActual ?>">
<meta property="og:type" content="website">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= $titulo ?>">
<meta name="twitter:description" content="<?= $descripcion ?>">
<meta name="twitter:image" content="<?= htmlspecialchars($imagenUrl, ENT_QUOTES, 'UTF-8') ?>">

<link rel="canonical" href="<?= $urlActual ?>">

<?php if ($redirigir): ?>

<meta http-equiv="refresh" content="1;url=<?= htmlspecialchars($destino, ENT_QUOTES, 'UTF-8') ?>">

<?php endif; ?>

</head>

<body>

<div style="text-align:center;margin-top:100px;">

<h2>Persianas Vizual Mazatlán</h2>

<?php if ($redirigir): ?>

<p>Un momento...</p>

<?php endif; ?>

</div>

<?php if ($redirigir): ?>

<script>

setTimeout(function () {
    window.location.href = <?= json_encode($destino) ?>;
}, 1000);

</script>

<?php endif; ?>

</body>

</html>