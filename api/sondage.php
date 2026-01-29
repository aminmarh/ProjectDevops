<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: text/plain; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

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

/**
 * React envoie en x-www-form-urlencoded :
 * - formData (JSON)
 * - transports (JSON)
 * - dateNaissance (string "DD/MM/YYYY")
 */
$formDataRaw = $_POST['formData'] ?? null;
$transportsRaw = $_POST['transports'] ?? null;
$dateNaissanceStr = $_POST['dateNaissance'] ?? null;

if (!$formDataRaw || !$transportsRaw || !$dateNaissanceStr) {
  http_response_code(400);
  echo "CHAMPS_MANQUANTS";
  exit;
}

$formData = json_decode($formDataRaw, true);
$transportsArr = json_decode($transportsRaw, true);

if (!is_array($formData) || !is_array($transportsArr)) {
  http_response_code(400);
  echo "JSON_INVALIDE";
  exit;
}

$nom        = trim($formData['nom'] ?? '');
$prenom     = trim($formData['prenom'] ?? '');
$adresse    = trim($formData['adresse'] ?? '');
$code_postal= trim($formData['code_postal'] ?? '');
$ville      = trim($formData['ville'] ?? '');
$telephone  = trim($formData['telephone'] ?? '');

$nameRegex = "/^[a-zA-ZÀ-ÿ' -]{2,80}$/u"; // accepte espaces, accents, tirets, apostrophes

if ($nom === '' || !preg_match($nameRegex, $nom)) {
  http_response_code(400);
  echo "NOM_INVALIDE";
  exit;
}

if ($prenom === '' || !preg_match($nameRegex, $prenom)) {
  http_response_code(400);
  echo "PRENOM_INVALIDE";
  exit;
}

$adresseRegex = "/^[0-9a-zA-ZÀ-ÿ' ,.-]{5,120}$/u"; // Adresse: on accepte chiffres + lettres + espaces + , . - '
if ($adresse === '' || !preg_match($adresseRegex, $adresse)) {
  http_response_code(400);
  echo "ADRESSE_INVALIDE";
  exit;
}

if ($ville === '' || !preg_match($nameRegex, $ville)) {
  http_response_code(400);
  echo "VILLE_INVALIDE";
  exit;
}

if ($code_postal === '' || !preg_match("/^\d{5}$/", $code_postal)) {
  http_response_code(400);
  echo "CODE_POSTAL_INVALIDE";
  exit;
}

if ($telephone === '' || !preg_match("/^(\+33|0)[1-9][0-9]{8}$/", $telephone)) {
  http_response_code(400);
  echo "TELEPHONE_INVALIDE";
  exit;
}

$date = DateTime::createFromFormat('d/m/Y', $dateNaissanceStr);
if (!$date) {
  http_response_code(400);
  echo "DATE_INVALIDE";
  exit;
}
$dateNaissanceSql = $date->format('Y-m-d');

$transportsArr = array_values(array_filter($transportsArr, fn($x) => is_string($x) && trim($x) !== ''));
if (count($transportsArr) === 0) {
  http_response_code(400);
  echo "TRANSPORTS_VIDE";
  exit;
}

$transports = implode(", ", $transportsArr);

try {
  $insert = $bdd->prepare("
    INSERT INTO sondage (nom, prenom, dateNaiss, adresse, code_postal, ville, telephone, transports)
    VALUES (?,?,?,?,?,?,?,?)
  ");
  $insert->execute([$nom, $prenom, $dateNaissanceSql, $adresse, (int)$code_postal, $ville, $telephone, $transports]);

  echo "Vos données ont bien été envoyé";
} catch (Throwable $e) {
  http_response_code(500);
  echo "ERREUR_INSERT";
}
