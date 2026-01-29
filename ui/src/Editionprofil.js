import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Editionprofil.css";

const Editionprofil = () => {
  const navigate = useNavigate();

  const userId = window.myGlobalLoginId || window.myGlobalId;
  const initialPseudo = window.myGlobalPseudo || "";
  const initialMail = window.myGlobalMail || "";

  const [formData, setFormData] = useState({
    id: userId,
    newpseudo: initialPseudo,
    newmail: initialMail,
    newmdp1: "",
    newmdp2: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) navigate("/connexion");
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newmdp1 || formData.newmdp2) {
      if (formData.newmdp1 !== formData.newmdp2) {
        setStatus({ type: "error", message: "Les mots de passe ne correspondent pas." });
        return;
      }
      if (formData.newmdp1.length < 6) {
        setStatus({ type: "error", message: "Mot de passe trop court (min 6 caractères)." });
        return;
      }
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("https://ville-de-paris.local/api/editionprofil.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      const text = await res.text();

      const ok =
        text.toLowerCase().includes("bien été modifié") ||
        text.toLowerCase().includes("bien été modifie") ||
        text.toLowerCase().includes("mot de passe") && text.toLowerCase().includes("modif");

      if (ok) {
        setStatus({ type: "success", message: "Profil mis à jour. Redirection..." });
        setTimeout(() => navigate(`/profil?id=${userId}`), 900);
      } else {
        setStatus({ type: "error", message: text || "Mise à jour impossible." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Erreur réseau. Réessaie." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="edit-page">
      <div className="edit-card">
        <div className="edit-head">
          <h3>Édition du profil</h3>
          <p>Vous pourrez bientôt modifier votre avatar.</p>
        </div>

        <form className="edit-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            className="echamps"
            type="text"
            placeholder="Nouveau pseudo"
            name="newpseudo"
            value={formData.newpseudo}
            onChange={handleChange}
          />

          <input
            className="echamps"
            type="email"
            placeholder="Nouveau mail"
            name="newmail"
            value={formData.newmail}
            onChange={handleChange}
          />

          <input
            className="echamps"
            type="password"
            placeholder="Nouveau mot de passe"
            name="newmdp1"
            value={formData.newmdp1}
            onChange={handleChange}
          />

          <input
            className="echamps"
            type="password"
            placeholder="Confirmez votre mot de passe"
            name="newmdp2"
            value={formData.newmdp2}
            onChange={handleChange}
          />

          <div className="btn-row">
            <button className="majbtn" type="submit" disabled={loading}>
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </button>

            <Link to={`/profil?id=${userId}`} className="abtn">
              Annuler
            </Link>
          </div>

          {status.message ? (
            <p className={`feedback ${status.type}`}>{status.message}</p>
          ) : null}
        </form>
      </div>
    </section>
  );
};

export default Editionprofil;
