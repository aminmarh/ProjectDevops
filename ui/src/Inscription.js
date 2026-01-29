import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Inscription.css";

function Inscription() {
  const [formData, setFormData] = useState({
    pseudo: "",
    mail: "",
    mdp: "",
    mdp2: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!formData.pseudo.trim()) {
      setStatus({ type: "error", message: "Le pseudo est obligatoire." });
      return;
    }
    if (!formData.mail.includes("@")) {
      setStatus({ type: "error", message: "Email invalide." });
      return;
    }
    if (formData.mdp.length < 6) {
      setStatus({ type: "error", message: "Mot de passe trop court (min 6 caractères)." });
      return;
    }
    if (formData.mdp !== formData.mdp2) {
      setStatus({ type: "error", message: "Les mots de passe ne correspondent pas." });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://ville-de-paris.local/api/inscription.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      // essaye JSON d'abord
      let payload = null;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        payload = await res.json();
      } else {
        const text = await res.text();
        payload = { ok: res.ok, message: text };
      }

      if (res.ok && payload?.ok) {
        setStatus({ type: "success", message: "Compte créé. Vous pouvez vous connecter." });
      } else {
        setStatus({ type: "error", message: payload?.message || "Inscription impossible." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Erreur réseau. Réessaie." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="inscription_form">
      <div className="boite-2">
        <h2>Inscrivez-vous</h2>

        <form onSubmit={handleSubmit} className="form-inscription">
          <input
            type="text"
            placeholder="Nom / Pseudo*"
            id="pseudo"
            name="pseudo"
            value={formData.pseudo}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            placeholder="E-mail*"
            id="mail"
            name="mail"
            value={formData.mail}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe*"
            id="mdp"
            name="mdp"
            value={formData.mdp}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            placeholder="Confirmez le mot de passe*"
            id="mdp2"
            name="mdp2"
            value={formData.mdp2}
            onChange={handleChange}
            required
          />

          <button type="submit" id="btn-i" disabled={loading}>
            {loading ? "Création..." : "S'inscrire"}
          </button>

          {status.message ? (
            <p className={`feedback ${status.type}`}>{status.message}</p>
          ) : null}
        </form>

        <div className="bottom-row">
          <Link to="/connexion" className="link-btn">
            Déjà un compte ? Se connecter →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Inscription;
