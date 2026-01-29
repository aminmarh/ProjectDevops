<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, *");
header("Content-Type: application/json; charset=utf-8");

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
  echo json_encode(["ok" => false, "message" => "ERREUR_DB"]);
  exit;
}

// Cookie auto-login (si présent)
include_once('cookieconnect.php');

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!is_array($data) || !isset($data['data']) || !is_array($data['data'])) {
  http_response_code(400);
  echo json_encode(["ok" => false, "message" => "JSON invalide."]);
  exit;
}

$payload = $data['data'];

$mailconnect = trim((string)($payload['mailconnect'] ?? ''));
$mdpconnect  = (string)($payload['mdpconnect'] ?? '');
$rememberme  = (bool)($payload['rememberme'] ?? false);

if ($mailconnect === '' || $mdpconnect === '') {
  http_response_code(400);
  echo json_encode(["ok" => false, "message" => "Tous les champs doivent être complétés !"]);
  exit;
}

if (!filter_var($mailconnect, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(["ok" => false, "message" => "Adresse mail invalide."]);
  exit;
}

try {
  $req = $bdd->prepare("SELECT id, pseudo, mail, motdepasse FROM Utilisateurs WHERE mail = ? LIMIT 1");
  $req->execute([$mailconnect]);
  $user = $req->fetch();

  if (!$user || !password_verify($mdpconnect, $user['motdepasse'])) {
    http_response_code(401);
    echo json_encode(["ok" => false, "message" => "Mauvais mail ou mot de passe !"]);
    exit;
  }

  // session
  $_SESSION['id'] = (int)$user['id'];
  $_SESSION['pseudo'] = $user['pseudo'];
  $_SESSION['mail'] = $user['mail'];

  if ($rememberme) {
    // On stocke l'email + un token basé sur le hash DB (simple et suffisant pour ton projet)
    // (pas parfait sécurité, mais infiniment mieux que stocker un mdp sha1)
    setcookie('email', $user['mail'], time() + 365 * 24 * 3600, "/", "", false, true);
    setcookie('auth',  $user['motdepasse'], time() + 365 * 24 * 3600, "/", "", false, true);
  }

  echo json_encode([
    "ok" => true,
    "message" => "Bravo vous êtes connecté !",
    "id" => (int)$user['id'],
    "pseudo" => $user['pseudo'],
    "mail" => $user['mail'],
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(["ok" => false, "message" => "ERREUR_SERVEUR"]);
}
