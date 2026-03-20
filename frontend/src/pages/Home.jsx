import { Link } from "react-router-dom";

export default function Home({ t }) {
  return (
    <section className="hero">
      <div className="heroBg" aria-hidden="true" />
      <div className="heroInner">
        <h1 className="heroTitle">{t.discoverTitle}</h1>
        <p className="heroDescription">{t.discoverDescription}</p>
        <div className="heroCta">
          <Link to="/places" className="primaryBtn">
            {t.navPlaces}
          </Link>
        </div>
      </div>
    </section>
  );
}

