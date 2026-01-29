import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "./image/logo-paris.png";

function Navbar() {
  const navRef = useRef(null);
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const syncAuth = () => {
    const id = localStorage.getItem("userId");
    if (id) {
      setIsLoggedIn(true);
      setUserId(id);
    } else {
      setIsLoggedIn(false);
      setUserId(null);
    }
  };

  useEffect(() => {
    syncAuth();
  }, []);

  useEffect(() => {
    syncAuth();
    navRef.current?.classList.remove("responsive_nav");
  }, [location.pathname]);

  const toggleNavbar = () => {
    navRef.current?.classList.toggle("responsive_nav");
  };

  return (
    <header className="site-header">
      <Link to="/" className="logo">
        <img src={logo} alt="Logo Ville" />
      </Link>

      <nav ref={navRef} className="site-nav">
        <Link to="/" className="nav-link">Accueil</Link>
        <Link to="/transport" className="nav-link">Transport</Link>
        <Link to="/nousretrouver" className="nav-link">Nous retrouver</Link>
        <Link to="/sondage" className="nav-link">Sondage</Link>

        <div className="nav-actions nav-actions-mobile">
          {isLoggedIn ? (
            <>
              <Link to={`/profil?id=${userId}`}>
                <button className="btn btn-ghost">Mon profil</button>
              </Link>
              <Link to="/sedeconnecter">
                <button className="btn btn-primary">Déconnexion</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/connexion">
                <button className="btn btn-ghost">Connexion</button>
              </Link>
              <Link to="/inscription">
                <button className="btn btn-primary">Inscription</button>
              </Link>
            </>
          )}
        </div>

        <button className="nav-btn nav-close-btn" onClick={toggleNavbar}>
          <FaTimes />
        </button>
      </nav>

      <div className="nav-actions nav-actions-desktop">
        {isLoggedIn ? (
          <>
            <Link to={`/profil?id=${userId}`}>
              <button className="btn btn-ghost">Mon profil</button>
            </Link>
            <Link to="/sedeconnecter">
              <button className="btn btn-primary">Déconnexion</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/connexion">
              <button className="btn btn-ghost">Connexion</button>
            </Link>
            <Link to="/inscription">
              <button className="btn btn-primary">Inscription</button>
            </Link>
          </>
        )}
      </div>

      <button className="nav-btn nav-open-btn" onClick={toggleNavbar}>
        <FaBars />
      </button>
    </header>
  );
}

export default Navbar;
