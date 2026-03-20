import { NavLink } from "react-router-dom";

export default function Header({ lang, setLang, t, theme, setTheme }) {
  return (
    <header className="siteHeader">
      <div className="siteHeaderInner">
        <nav className="topNav" aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
            {t.navHome}
          </NavLink>
          <NavLink
            to="/places"
            className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
          >
            {t.navPlaces}
          </NavLink>
          <NavLink
            to="/contacts"
            className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
          >
            {t.navContacts}
          </NavLink>
        </nav>

        <div className="langSwitch">
          <button
            type="button"
            className={lang === "en" ? "langBtn active" : "langBtn"}
            onClick={() => setLang("en")}
          >
            <img
              className="flagIcon"
              src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f1ec-1f1e7.png"
              alt="UK flag"
            />{" "}
            EN
          </button>
          <button
            type="button"
            className={lang === "bg" ? "langBtn active" : "langBtn"}
            onClick={() => setLang("bg")}
          >
            <img
              className="flagIcon"
              src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f1e7-1f1ec.png"
              alt="Bulgaria flag"
            />{" "}
            BG
          </button>
          <button
            type="button"
            className="themeBtn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? `☀️ ${t.lightMode}` : `🌙 ${t.darkMode}`}
          </button>
        </div>
      </div>
    </header>
  );
}

