import React, { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import { DatePicker, Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { transportsParisGrouped } from "./data";
import "./Sondage.css";

const MAX_TRANSPORTS = 10;

function Sondage() {
  const navigate = useNavigate();

  const page1Ref = useRef(null);
  const page2Ref = useRef(null);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dateNaissance, setDateNaissance] = useState(null);

  const [formData, setFormData] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);

  const [status, setStatus] = useState({ loading: false, message: "", type: "" });

  useEffect(() => {
    const opts = { threshold: 0.6 };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.target) return;
        if (e.isIntersecting) {
          e.target.classList.add("zoom");
          e.target.classList.remove("dezoom");
        } else {
          e.target.classList.add("dezoom");
          e.target.classList.remove("zoom");
        }
      });
    }, opts);

    if (page1Ref.current) obs.observe(page1Ref.current);
    if (page2Ref.current) obs.observe(page2Ref.current);

    return () => obs.disconnect();
  }, []);

  const handleSelectChange = (selected) => {
    const safe = selected || [];
    if (safe.length <= MAX_TRANSPORTS) setSelectedOptions(safe);
  };

  const onFinish = (values) => {
    setFormData(values);
    setCanSubmit(true);
    page2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const transportsValues = useMemo(
    () => selectedOptions.map((o) => o.value),
    [selectedOptions]
  );

  const handleSubmit = async () => {
    if (!formData) {
      setStatus({ loading: false, type: "error", message: "Remplissez d’abord le formulaire." });
      return;
    }
    if (!dateNaissance) {
      setStatus({ loading: false, type: "error", message: "Date de naissance obligatoire." });
      return;
    }
    if (transportsValues.length === 0) {
      setStatus({ loading: false, type: "error", message: "Sélectionnez au moins un aliment." });
      return;
    }

    setStatus({ loading: true, type: "", message: "" });

    try {
      const payload = new URLSearchParams();
      payload.set("formData", JSON.stringify(formData));
      payload.set("transports", JSON.stringify(transportsValues));
      payload.set("dateNaissance", dateNaissance);

      const res = await fetch("https://ville-de-paris.local/api/sondage.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: payload.toString(),
      });

      const text = await res.text();

      if (text.toLowerCase().includes("bien été envoyé") || text.toLowerCase().includes("bien ete envoye")) {
        setStatus({ loading: false, type: "success", message: "Données envoyées. Redirection..." });
        navigate("/resultatsondage");
      } else {
        setStatus({ loading: false, type: "error", message: text || "Envoi impossible." });
      }
    } catch (e) {
      console.error(e);
      setStatus({ loading: false, type: "error", message: "Erreur réseau. Réessaie." });
    }
  };

  return (
    <section className="mainContainer">
      <div className="poll">
        <div className="page1" ref={page1Ref}>
          <h3 className="stitle">Sondage</h3>

          <Form
            className="quiz"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            style={{ maxWidth: 900 }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Nom"
              name="nom"
              rules={[{ required: true, message: "Veuillez mettre votre nom !" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Prénom"
              name="prenom"
              rules={[{ required: true, message: "Veuillez mettre votre prénom !" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Date de naissance"
              name="date_naissance"
              rules={[{ required: true, message: "Veuillez mettre votre date de naissance !" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                onChange={(_, dateString) => setDateNaissance(dateString)}
              />
            </Form.Item>

            <Form.Item
              label="Adresse"
              name="adresse"
              rules={[{ required: true, message: "Veuillez mettre votre adresse !" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Code postal"
              name="code_postal"
              rules={[{ required: true, message: "Veuillez mettre votre code postal !" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Ville"
              name="ville"
              rules={[{ required: true, message: "Veuillez mettre votre ville !" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Téléphone"
              name="telephone"
              rules={[{ required: true, message: "Veuillez mettre votre téléphone !" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
              <Button type="primary" htmlType="submit">
                Passer à la sélection des transports
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div className="page2" ref={page2Ref}>
          <p>Choisissez jusqu’à {MAX_TRANSPORTS} transports.</p>

          <Select
            options={transportsParisGrouped}
            isMulti
            maxMenuHeight={200}
            value={selectedOptions}
            onChange={handleSelectChange}
            placeholder="Choisissez vos transports"
            isOptionDisabled={() => selectedOptions.length >= MAX_TRANSPORTS}
          />

          <div className="actions-sondage">
            <button
              className="b-valider"
              onClick={handleSubmit}
              disabled={!canSubmit || transportsValues.length === 0 || status.loading}
            >
              {status.loading ? "Envoi..." : "Valider"}
            </button>

            {status.message ? (
              <p className={`response ${status.type}`}>{status.message}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sondage;
