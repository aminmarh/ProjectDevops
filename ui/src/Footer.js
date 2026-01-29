import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import logo from "./image/logo-paris.png";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="box-container">
          <div className="box">
            <h3>Navigation</h3>
            <Link to="/" className="nav-link">Accueil</Link>
            <Link to="/transport" className="nav-link">Transport</Link>
            <Link to="/nousretrouver" className="nav-link">Nous retrouver</Link>
            <Link to="/sondage" className="nav-link">Sondage</Link>
          </div>

          <div className="box">
            <h3>Contact</h3>
            <p>Hôtel de Ville de Paris</p>
            <p>5 Rue de Lobau, 75004 Paris</p>
            <p>Standard : 3975</p>
            <a className="nav-link" href="https://www.paris.fr" target="_blank" rel="noreferrer">
              Site officiel
            </a>
          </div>

          <div className="box">
            <h3>Suivez-nous</h3>

            <a className="social-link" href="https://www.linkedin.com/company/villedeparis/" target="_blank" rel="noreferrer">
              <FaLinkedin /> LinkedIn
            </a>

            <a className="social-link" href="https://www.facebook.com/paris" target="_blank" rel="noreferrer">
              <FaFacebook /> Facebook
            </a>

            <a className="social-link" href="https://www.instagram.com/paris/" target="_blank" rel="noreferrer">
              <FaInstagram /> Instagram
            </a>

            <a className="social-link" href="https://x.com/paris" target="_blank" rel="noreferrer">
              <FaXTwitter /> X
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <Link to="/" className="logo">
            <img src={logo} alt="Logo Ville de Paris" />
          </Link>

          <div className="credit">
            <span>© {new Date().getFullYear()} — Ville de Paris — Mentions légales</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
