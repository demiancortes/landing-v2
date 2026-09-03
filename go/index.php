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

$imagen = !empty($link['imagen'])
    ? $link['imagen']
    : 'default.jpg';

$update = $pdo->prepare("UPDATE links SET clicks = clicks + 1, ultimo_click = NOW() WHERE id = ?");
$update->execute([$link['id']]);

$titulo = htmlspecialchars($link['titulo']);
$descripcion = htmlspecialchars($link['descripcion']);
$destino = htmlspecialchars($link['destino']);

$imagenUrl = "https://persianasvizual.com/go/img/" . rawurlencode($imagen);

?>
<!DOCTYPE html>
<html lang="es">
<head>

<meta charset="utf-8">

<title><?= $titulo ?></title>

<meta property="og:title" content="<?= $titulo ?>">
<meta property="og:description" content="<?= $descripcion ?>">
<meta property="og:image" content="<?= $imagenUrl ?>">
<meta property="og:type" content="website">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= $titulo ?>">
<meta name="twitter:description" content="<?= $descripcion ?>">
<meta name="twitter:image" content="<?= $imagenUrl ?>">

<meta http-equiv="refresh" content="1;url=<?= $destino ?>">

</head>

<body>

<div style="text-align:center;margin-top:100px;">

    <h2>Persianas Vizual Mazatlán</h2>

    <p>Abriendo catálogo...</p>

</div>

<script>
setTimeout(function () {
    window.location.href = <?= json_encode($link['destino']) ?>;
}, 1000);
</script>

</body>
</html>