<?php

if (!isset($_SESSION['id'])
    && isset($_COOKIE['email'], $_COOKIE['auth'])
    && !empty($_COOKIE['email'])
    && !empty($_COOKIE['auth'])
) {
  $email = $_COOKIE['email'];
  $auth  = $_COOKIE['auth'];

  try {
    // On compare le hash stocké en DB avec celui du cookie auth
    // (si tu changes mot de passe -> cookie devient invalide)
    $req = $bdd->prepare("SELECT id, pseudo, mail, motdepasse FROM Utilisateurs WHERE mail = ? LIMIT 1");
    $req->execute([$email]);
    $user = $req->fetch(PDO::FETCH_ASSOC);

    if ($user && hash_equals((string)$user['motdepasse'], (string)$auth)) {
      $_SESSION['id'] = (int)$user['id'];
      $_SESSION['pseudo'] = $user['pseudo'];
      $_SESSION['mail'] = $user['mail'];
    }
  } catch (Throwable $e) { }
}
