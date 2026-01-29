<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: text/plain; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

session_start();

$host = "mysql-service";
$dbname = "VilleDeParis";
$username = "root";
$password = "rootpassword";

try {
  $bdd = new PDO(
    "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
    $username,
    $password,
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
  );
} catch (Throwable $e) {
  http_response_code(500);
  echo "ERREUR_DB";
  exit;
}

include_once("cookieconnect.php");

$getid = null;
if (isset($_POST["id"]) && (int)$_POST["id"] > 0) {
  $getid = (int)$_POST["id"];
} elseif (isset($_SESSION["id"]) && (int)$_SESSION["id"] > 0) {
  $getid = (int)$_SESSION["id"];
}

if (!$getid) {
  http_response_code(400);
  echo "ERREUR_ID_MANQUANT";
  exit;
}

try {
  $req = $bdd->prepare("SELECT id, pseudo, mail, avatar FROM Utilisateurs WHERE id = ? LIMIT 1");
  $req->execute([$getid]);
  $u = $req->fetch();

  if (!$u) {
    http_response_code(404);
    echo "ERREUR_USER_NOT_FOUND";
    exit;
  }

  $pseudo = $u["pseudo"] ?? "";
  $avatar = $u["avatar"] ?? "default.jpeg";
  $mail   = $u["mail"] ?? "";
  $id     = (string)($u["id"] ?? $getid);

  echo $pseudo . "\n" . $avatar . "\n" . $mail . "\n" . $id;
} catch (Throwable $e) {
  http_response_code(500);
  echo "ERREUR_SERVEUR";
}
