import React from "react";
import metro from "./image/metro.jpg";
import bus from "./image/bus.jpg";
import velo from "./image/velo.jpg";
import "./Transport.css";

function Transport() {
  return (
    <section className="transport-page">
      <h3 className="transport-title">Transports à Paris</h3>

      <div className="transport-section">
        <div className="transport-text">
          <h4>Se déplacer facilement dans Paris</h4>
          <p>
            Métro, bus, tram, RER, vélo, marche : Paris offre un réseau dense et rapide.
            Pour planifier vos trajets, vérifier les perturbations et acheter vos titres,
            les plateformes de référence sont Île-de-France Mobilités et la RATP.
          </p>

          <div className="transport-links">
            <a href="https://www.iledefrance-mobilites.fr/" target="_blank" rel="noreferrer">
              Île-de-France Mobilités →
            </a>
            <a href="https://www.ratp.fr/" target="_blank" rel="noreferrer">
              RATP →
            </a>
          </div>
        </div>

        <div className="transport-image">
          <img
            src={metro}
            alt="Métro à Paris"
          />
        </div>
      </div>

      <div className="transport-section reverse">
        <div className="transport-text">
          <h4>Tickets et abonnements</h4>
          <p>
            Les titres et abonnements sont gérés à l’échelle de l’Île-de-France
            (métro/RER/tram/bus). Le passe Navigo (physique ou dématérialisé) est la
            référence pour les abonnements. Pour les trajets occasionnels, vous pouvez
            utiliser des tickets dématérialisés selon les options disponibles.
          </p>
        </div>

        <div className="transport-image">
          <img
            src={bus}
            alt="Bus à Paris"
          />
        </div>
      </div>

      <div className="transport-section">
        <div className="transport-text">
          <h4>Mobilités douces</h4>
          <p>
            Pour réduire l’empreinte carbone et fluidifier les déplacements,
            Paris encourage la marche, le vélo et les solutions partagées.
            Pensez à vérifier les itinéraires cyclables, et les règles de circulation
            selon les zones.
          </p>
        </div>

        <div className="transport-image">
          <img
            src={velo}
            alt="Vélo à Paris"
          />
        </div>
      </div>
    </section>
  );
}

export default Transport;
