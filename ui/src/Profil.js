import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Profil.css";
import defaultAvatar from "./avatars/default.jpeg";

import avatar1 from "./avatars/avatar1.jpeg";
import avatar2 from "./avatars/avatar2.jpeg";
import avatar3 from "./avatars/avatar3.jpeg";

const AVATARS = {
  "default.jpeg": defaultAvatar,
  "avatar1.jpeg": avatar1,
  "avatar2.jpeg": avatar2,
  "avatar3.jpeg": avatar3,
};

const Profil = () => {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const requestedId = params.get("id");

  const [profil, setProfil] = useState({
    pseudo: "",
    avatar: "default.jpeg",
    mail: "",
    id: requestedId || "",
  });

  const [status, setStatus] = useState({ loading: true, error: "" });

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setStatus({ loading: true, error: "" });

      try {
        const body = new URLSearchParams();
        if (requestedId) body.set("id", requestedId);

        const res = await fetch("https://ville-de-paris.local/api/profil.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
          body: body.toString(),
          signal: controller.signal,
        });

        const text = await res.text();
        const clean = text.trim();

        if (!res.ok || clean.startsWith("ERREUR_")) {
          const msg =
            clean === "ERREUR_ID_MANQUANT"
              ? "Impossible de charger le profil : aucun ID (pas connecté ?)."
              : clean === "ERREUR_USER_NOT_FOUND"
              ? "Utilisateur introuvable."
              : clean === "ERREUR_DB"
              ? "Base de données indisponible."
              : "Erreur serveur lors du chargement du profil.";

          setStatus({ loading: false, error: msg });
          return;
        }

        const lines = clean.split("\n").map((l) => l.trim());
        const pseudo = lines[0] || "";
        const avatar = lines[1] || "default.jpeg";
        const mail = lines[2] || "";
        const id = lines[3] || requestedId || "";

        setProfil({ pseudo, avatar, mail, id });

        window.myGlobalPseudo = pseudo;
        window.myGlobalMail = mail;
        window.myGlobalId = id;

        setStatus({ loading: false, error: "" });
      } catch (e) {
        if (e.name !== "AbortError") {
          setStatus({ loading: false, error: "Impossible de charger le profil (réseau/serveur)." });
        }
      }
    };

    load();
    return () => controller.abort();
  }, [requestedId]);

  const avatarSrc = AVATARS[profil.avatar] || defaultAvatar;

  return (
    <section className="profile-page">
      <div className="profile-card">
        <h3 className="nomprofil">
          {status.loading ? "Chargement..." : `Profil de ${profil.pseudo || "Utilisateur"}`}
        </h3>

        {status.error ? (
          <p className="feedback error">{status.error}</p>
        ) : (
          <div className="profil">
            <div className="profil-1">
              <img className="sizeimg" src={avatarSrc} alt="Avatar" />
            </div>

            <div className="profil-2">
              <div className="row">
                <span className="label">Pseudo</span> <span>{profil.pseudo || "-"}</span>
              </div>
              <div className="row">
                <span className="label">Mail</span> <span>{profil.mail || "-"}</span>
              </div>
              <div className="row">
                <span className="label">ID</span> <span>{profil.id || "-"}</span>
              </div>
            </div>
          </div>
        )}

        <div className="actions">
          <Link to="/editionprofil" className="action-btn">Éditer mon profil</Link>
          <Link to="/sedeconnecter" className="action-btn danger">Se déconnecter</Link>
        </div>
      </div>
    </section>
  );
};

export default Profil;
