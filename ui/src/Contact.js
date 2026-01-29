import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import "./Contact.css";

function Contact() {
  const [state, handleSubmit] = useForm("xlekbkdv");

  if (state.succeeded) {
    return (
      <section className="contact-success">
        <div className="success-card">
          <h3>Message envoyé</h3>
          <p>Votre message a bien été envoyé. Nous vous répondrons dès que possible.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-page">
      <div className="contact-container">
        <header className="contact-header">
          <h3>Nous retrouver</h3>
          <p>Informations pratiques et formulaire de contact</p>
        </header>

        <div className="contact-grid">
          <div className="contact-left">
            <div className="map-card">
              <iframe
                title="Mairie de Paris - Hôtel de Ville"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.99933299402!2d2.351008!3d48.856614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06dca2db%3A0xf2b8d51b5d3f02a8!2sH%C3%B4tel%20de%20Ville%20de%20Paris!5e0!3m2!1sfr!2sfr!4v0000000000000"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="info-card">
              <h4>Emplacement</h4>
              <p>Hôtel de Ville de Paris — 5 Rue de Lobau, 75004 Paris</p>

              <h4>Horaires</h4>
              <p>
                Du lundi au vendredi<br />
                Horaires selon service (accueil, démarches, etc.)
              </p>

              <a className="info-link" href="https://www.paris.fr" target="_blank" rel="noreferrer">
                Accéder au site officiel de la Ville de Paris →
              </a>
            </div>
          </div>

          <div className="contact-right">
            <div className="form-card">
              <h4>Envoyez-nous un message</h4>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="field">
                  <input type="text" id="nom" name="nom" placeholder="Nom*" required />
                  <ValidationError prefix="Nom" field="nom" errors={state.errors} />
                </div>

                <div className="field">
                  <input type="email" id="email" name="email" placeholder="E-mail*" required />
                  <ValidationError prefix="Email" field="email" errors={state.errors} />
                </div>

                <div className="field">
                  <input type="tel" id="tel" name="tel" placeholder="Téléphone" />
                  <ValidationError prefix="Téléphone" field="tel" errors={state.errors} />
                </div>

                <div className="field">
                  <input type="text" id="objet" name="objet" placeholder="Objet du message*" required />
                  <ValidationError prefix="Objet" field="objet" errors={state.errors} />
                </div>

                <div className="field">
                  <textarea id="message" name="message" placeholder="Écrivez votre message..." required />
                  <ValidationError prefix="Message" field="message" errors={state.errors} />
                </div>

                <button className="envoyer" type="submit" disabled={state.submitting}>
                  {state.submitting ? "Envoi..." : "Soumettre"}
                </button>

                {state.errors?.length ? (
                  <p className="form-error">Certains champs sont invalides. Vérifiez et réessayez.</p>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
