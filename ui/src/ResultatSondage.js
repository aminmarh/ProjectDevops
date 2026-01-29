import React, { useEffect, useState } from "react";
import "./Sondage.css";

function ResultatSondage() {
  const [latestEntry, setLatestEntry] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: "" });

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setStatus({ loading: true, error: "" });

      try {
        const res = await fetch("https://ville-de-paris.local/api/resondage.php", {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("HTTP " + res.status);

        const data = await res.json();
        setLatestEntry(data);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
          setStatus({ loading: false, error: "Impossible de charger les résultats." });
          return;
        }
      }

      setStatus((s) => ({ ...s, loading: false }));
    };

    load();
    return () => controller.abort();
  }, []);

  const transports = Array.isArray(latestEntry?.transports) ? latestEntry.transports : [];

  return (
    <section className="sondage-bg">
      <div className="sondage-wrap">
        <div className="sondage-card">
          <h3>Résultat du sondage</h3>

          {status.loading ? (
            <p className="loading">Chargement...</p>
          ) : status.error ? (
            <p className="feedback error">{status.error}</p>
          ) : (
            <>
              <div className="bloc">
                <h2>Mes informations</h2>
                <p className="line"><span className="k">Moi</span> : {latestEntry?.prenom} {latestEntry?.nom}</p>
                <p className="line"><span className="k">Date de naissance</span> : {latestEntry?.age}</p>
                <p className="line"><span className="k">Ville</span> : {latestEntry?.ville}</p>
                <p className="line"><span className="k">Transports choisis</span> : {transports.length ? transports.join(", ") : "-"}</p>
              </div>

              <div className="bloc">
                <h2>Répartition par âge</h2>
                <p className="line">Enfants (0 - 14 ans) : <b>{latestEntry?.enfants ?? 0}</b></p>
                <p className="line">Adolescents (15 - 24 ans) : <b>{latestEntry?.adolescents ?? 0}</b></p>
                <p className="line">Adultes (25 - 64 ans) : <b>{latestEntry?.adultes ?? 0}</b></p>
                <p className="line">Aînés (65 ans et +) : <b>{latestEntry?.aines ?? 0}</b></p>
              </div>

              <div className="bloc">
                <h2>Statistiques générales</h2>
                <p className="line">Nombre total de répondants : <b>{latestEntry?.total ?? 0}</b></p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default ResultatSondage;
