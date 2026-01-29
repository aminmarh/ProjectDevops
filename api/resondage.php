<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=utf-8");

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
  echo json_encode(["error" => "ERREUR_DB"]);
  exit;
}

try {
  $qLast = $bdd->query("
    SELECT id, nom, prenom, ville, dateNaiss, transports
    FROM sondage
    ORDER BY id DESC
    LIMIT 1
  ");
  $last = $qLast->fetch();

  if (!$last) {
    echo json_encode([
      "nom" => "",
      "prenom" => "",
      "ville" => "",
      "dateNaiss" => null,
      "age" => null,
      "transports" => [],
      "enfants" => 0,
      "adolescents" => 0,
      "adultes" => 0,
      "aines" => 0,
      "total" => 0,
    ]);
    exit;
  }

  $transports = [];
  if (!empty($last["transports"])) {
    $transports = array_values(array_filter(array_map("trim", explode(",", $last["transports"]))));
  }

  $age = null;
  if (!empty($last["dateNaiss"])) {
    $dn = DateTime::createFromFormat("Y-m-d", $last["dateNaiss"]) ?: new DateTime($last["dateNaiss"]);
    $age = $dn ? $dn->diff(new DateTime("today"))->y : null;
  }

  $qTotal = $bdd->query("SELECT COUNT(*) AS total FROM sondage");
  $total = (int)($qTotal->fetch()["total"] ?? 0);

  $qStats = $bdd->query("
    SELECT
      SUM(TIMESTAMPDIFF(YEAR, dateNaiss, CURDATE()) BETWEEN 0 AND 14) AS enfants,
      SUM(TIMESTAMPDIFF(YEAR, dateNaiss, CURDATE()) BETWEEN 15 AND 24) AS adolescents,
      SUM(TIMESTAMPDIFF(YEAR, dateNaiss, CURDATE()) BETWEEN 25 AND 64) AS adultes,
      SUM(TIMESTAMPDIFF(YEAR, dateNaiss, CURDATE()) >= 65) AS aines
    FROM sondage
  ");
  $stats = $qStats->fetch();

  $finalResponse = [
    "nom" => $last["nom"] ?? "",
    "prenom" => $last["prenom"] ?? "",
    "ville" => $last["ville"] ?? "",
    "dateNaiss" => $last["dateNaiss"] ?? null,
    "age" => $age,
    "transports" => $transports,
    "total" => $total,
    "enfants" => (int)($stats["enfants"] ?? 0),
    "adolescents" => (int)($stats["adolescents"] ?? 0),
    "adultes" => (int)($stats["adultes"] ?? 0),
    "aines" => (int)($stats["aines"] ?? 0),
  ];

  echo json_encode($finalResponse, JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(["error" => "ERREUR_SERVEUR"]);
}
