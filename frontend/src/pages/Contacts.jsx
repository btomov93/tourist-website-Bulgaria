import { useState } from "react";

export default function Contacts({ lang, t }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  function submit(e) {
    e.preventDefault();
    const ok = lang === "bg" ? "Готово" : "OK";
    const empty = lang === "bg" ? "Празно съобщение" : "Empty message";
    setStatus(
      `(${name || (lang === "bg" ? "Гост" : "Guest")}) ${t.contactFormTitle}: ${
        message ? ok : empty
      }`
    );
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="contactsLayout">
      <h2 className="pageTitle">{t.contactsTitle}</h2>

      <div className="contactsGrid">
        <div className="contactCard">
          <h3 className="contactTitle">{t.contactsEmail}</h3>
          <p className="contactValue">
            <a href="mailto:info@bulgariatourism.example">info@bulgariatourism.example</a>
          </p>

          <h3 className="contactTitle">{t.contactsPhone}</h3>
          <p className="contactValue">
            <a href="tel:+359888123456">+359 888 123 456</a>
          </p>
        </div>

        <div className="contactCard">
          <h3 className="contactTitle">{t.contactFormTitle}</h3>
          <form className="contactForm" onSubmit={submit}>
            <label className="formLabel">
              {t.contactName}
              <input
                className="formInput"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.contactName}
              />
            </label>

            <label className="formLabel">
              {t.contactEmail}
              <input
                className="formInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.contactEmail}
                type="email"
              />
            </label>

            <label className="formLabel">
              {t.contactMessage}
              <textarea
                className="formTextarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.contactMessage}
              />
            </label>

            <button className="primaryBtn" type="submit">
              {t.contactSubmit}
            </button>

            {status && <div className="statusText">{status}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

