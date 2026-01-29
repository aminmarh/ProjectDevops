import React from 'react';
import culture from './image/culture.jpg';
import logement from './image/logement.jpg';
import mobilite from './image/mobilite.jpg';
import paris2024 from './image/paris2024.jpg';
import "./Accueil.css";

function Accueil() {
    return(
        <div className='b-body'>

            <section className='premier'>
                <h3>Bienvenue à Paris</h3>
                <div className='bouton'>
                    <a 
                      href='https://www.paris.fr' 
                      target="_blank" 
                      rel="noreferrer"
                      className='bouton1'
                    >
                      Découvrir Paris
                    </a>
                </div>
            </section>

            <section className='actu'>
                <h3 className='titre'>Actualités de la Ville de Paris</h3>

                <div className='box-card'>

                    <div className="cards">
                        <div className='image-container'>
                            <img src={paris2024} alt="Paris 2024"/>
                        </div>
                        <div className="card-footer">
                            <span>Janvier 2026</span>
                            <h3>Paris se prépare aux grands événements internationaux</h3>
                            <p>
                                Infrastructures, mobilités, sécurité et accueil : la Ville de Paris poursuit ses
                                grands chantiers pour accueillir les événements internationaux et améliorer le quotidien des Parisiens.
                            </p>
                            <a href="https://www.paris.fr" className="read-more">
                                Voir plus <span>&rarr;</span>
                            </a>
                        </div>
                    </div>

                    <div className="cards">
                        <div className='image-container'>
                            <img src={logement} alt="Logement Paris"/>
                        </div>
                        <div className="card-footer">
                            <span>Décembre 2025</span>
                            <h3>Logement : nouvelles mesures pour un habitat plus accessible</h3>
                            <p>
                                La Ville renforce ses dispositifs en faveur du logement social, de la rénovation énergétique
                                et de l’encadrement des loyers.
                            </p>
                            <a href="https://www.paris.fr/pages/logement-urbain-189" className="read-more">
                                Voir plus <span>&rarr;</span>
                            </a>
                        </div>
                    </div>

                    <div className="cards">
                        <div className='image-container'>
                            <img src={mobilite} alt="Mobilité Paris"/>
                        </div>
                        <div className="card-footer">
                            <span>Novembre 2025</span>
                            <h3>Mobilité : Paris accélère sur le vélo et les transports propres</h3>
                            <p>
                                Déploiement de nouvelles pistes cyclables, bus électriques et réaménagement
                                des grands axes pour une ville plus respirable.
                            </p>
                            <a href="https://www.paris.fr/pages/se-deplacer-207" className="read-more">
                                Voir plus <span>&rarr;</span>
                            </a>
                        </div>
                    </div>

                    <div className="cards">
                        <div className='image-container'>
                            <img src={culture} alt="Culture Paris"/>
                        </div>
                        <div className="card-footer">
                            <span>Octobre 2025</span>
                            <h3>Culture : une programmation renforcée dans tous les arrondissements</h3>
                            <p>
                                Musées, bibliothèques, festivals, événements de quartier : Paris multiplie
                                les initiatives pour rendre la culture accessible à tous.
                            </p>
                            <a href="https://www.paris.fr/pages/culture-202" className="read-more">
                                Voir plus <span>&rarr;</span>
                            </a>
                        </div>
                    </div>

                </div>    
            </section>

        </div>
    );
}

export default Accueil;
