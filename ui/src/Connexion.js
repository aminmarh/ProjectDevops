import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Connexion.css";

const Connexion = () => {
  const [formData, setFormData] = useState({
    mailconnect: "",
    mdpconnect: "",
    rememberme: false,
  });

  const [response, setResponse] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse({ type: '', message: '' });

    try {
      const res = await fetch("https://ville-de-paris.local/api/connexion.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      const payload = await res.json();

      if (res.ok && payload.ok) {
        const userId = String(payload.id);

        localStorage.setItem("userId", userId);

        setResponse({ type: 'success', message: "Connexion réussie. Redirection..." });
        navigate(`/profil?id=${userId}`);
        return;
      }

      setResponse({ type: 'error', message: payload.message || "Connexion impossible." });
    } catch (err) {
      console.error(err);
      setResponse({ type: 'error', message: "Erreur réseau. Réessaie." });
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="connexion">
      <div className="boite">
        <h2>Connectez-vous</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="champs"
            name="mailconnect"
            placeholder="E-mail"
            value={formData.mailconnect}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            className="champs"
            name="mdpconnect"
            placeholder="Mot de passe"
            value={formData.mdpconnect}
            onChange={handleChange}
            required
          />

          <div className="remember">
            <input
              type="checkbox"
              name="rememberme"
              id="remembercheckbox"
              checked={formData.rememberme}
              onChange={handleChange}
            />
            <label className="label" htmlFor="remembercheckbox">
              Se souvenir de moi
            </label>
          </div>

          <button type="submit" id="btn" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          {response.message ? (
            <p className={`feedback ${response.type}`}>{response.message}</p>
          ) : null}

          <div className="btn-bas">
            <Link to="/inscription" className="link-btn">
              S'inscrire
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Connexion;
