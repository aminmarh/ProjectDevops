import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Sedeconnecter.css";

const Sedeconnecter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("userId");

    window.myGlobalLogin = false;
    window.myGlobalLoginId = null;
    window.myGlobalPseudo = "";
    window.myGlobalMail = "";
    window.myGlobalId = "";
    window.myGlobalPath = "";

    navigate("/connexion", { replace: true });
  }, [navigate]);

  return (
    <section className="logout-page">
      <div className="logout-card">
        <h1>Vous êtes déconnecté</h1>
        <p>Redirection vers la page de connexion…</p>

        <div className="logout-actions">
          <Link to="/connexion" className="logout-btn">
            Aller à Connexion
          </Link>
          <Link to="/" className="logout-btn ghost">
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Sedeconnecter;
