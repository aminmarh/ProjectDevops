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

$host = "mysql-service";
$dbname = "VilleDeParis";
$username = "root";
$password = "rootpassword";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!is_array($data) || !isset($data['data']) || !is_array($data['data'])) {
  http_response_code(400);
  echo json_encode(["ok" => false, "message" => "JSON invalide."]);
  exit;
}

$payload = $data['data'];

$pseudo = trim((string)($payload['pseudo'] ?? ''));
$mail   = trim((string)($payload['mail'] ?? ''));
$mdp    = (string)($payload['mdp'] ?? '');
$mdp2   = (string)($payload['mdp2'] ?? '');

if ($pseudo === '' || $mail === '' || $mdp === '' || $mdp2 === '') {
  http_response_code(400);
  echo json_encode(["ok" => false, "message" => "Tous les champs doivent être complétés !"]);
  exit;
}

if (strlen($pseudo) > 255) {
  http_response_code(400);
  echo json_encode(["ok" => false, "message" => "Votre pseudo ne doit pas dépasser 255 caractères."]);
  exit;
}

if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(["ok" => false, "message" => "Votre adresse mail n'est pas valide !"]);
  exit;
}

if ($mdp !== $mdp2) {
  http_response_code(400);
  echo json_encode(["ok" => false, "message" => "Vos mots de passe ne correspondent pas !"]);
  exit;
}

if (strlen($mdp) < 6) {
  http_response_code(400);
  echo json_encode(["ok" => false, "message" => "Mot de passe trop court (min 6 caractères)."]);
  exit;
}

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

try {
  $reqpseudo = $bdd->prepare("SELECT 1 FROM Utilisateurs WHERE pseudo = ? LIMIT 1");
  $reqpseudo->execute([$pseudo]);
  if ($reqpseudo->fetch()) {
    http_response_code(409);
    echo json_encode(["ok" => false, "message" => "Pseudo déjà utilisé !"]);
    exit;
  }

  $reqmail = $bdd->prepare("SELECT 1 FROM Utilisateurs WHERE mail = ? LIMIT 1");
  $reqmail->execute([$mail]);
  if ($reqmail->fetch()) {
    http_response_code(409);
    echo json_encode(["ok" => false, "message" => "Adresse mail déjà utilisée !"]);
    exit;
  }

  $hash = password_hash($mdp, PASSWORD_DEFAULT);

  $insert = $bdd->prepare("INSERT INTO Utilisateurs (pseudo, mail, motdepasse) VALUES (?,?,?)");
  $insert->execute([$pseudo, $mail, $hash]);

  http_response_code(201);
  echo json_encode([
    "ok" => true,
    "message" => "Bravo vous êtes inscrit",
    "id" => (int)$bdd->lastInsertId(),
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(["ok" => false, "message" => "ERREUR_SERVEUR"]);
}
