import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";

const Places = lazy(() => import("./pages/Places.jsx"));
const Contacts = lazy(() => import("./pages/Contacts.jsx"));
const PlaceDetails = lazy(() => import("./pages/PlaceDetails.jsx"));

const translations = {
  en: {
    navHome: "Home",
    navPlaces: "Places",
    navContacts: "Contacts",
    discoverTitle: "Discover Bulgaria",
    discoverDescription:
      "Find inspiring destinations—from mountains and monasteries to seaside towns. Filter by town and category, then plan your next trip.",
    placesTitle: "Places to Visit",
    placesLoading: "Loading places...",
    placesError: "Failed to load places.",
    filtersTitle: "Filters",
    filterAllTowns: "All towns",
    filterAllCategories: "All categories",
    filterCategoryLabel: "Category",
    categoryMountain: "Mountain",
    categorySea: "Sea",
    categoryCity: "City",
    categoryHistorical: "Historical",
    contactsTitle: "Contacts",
    contactsEmail: "Email",
    contactsPhone: "Phone",
    contactFormTitle: "Send a message",
    contactName: "Name",
    contactEmail: "Email",
    contactMessage: "Message",
    contactSubmit: "Send",
    placeDetailsTitle: "About this place",
    mapsButton: "Open in Google Maps",
    backToPlaces: "Back to Places",
    galleryTitle: "Photo Gallery",
    previousPhoto: "Previous",
    nextPhoto: "Next",
    detailsLoading: "Loading place details...",
    detailsError: "Failed to load place details.",
    darkMode: "Dark",
    lightMode: "Light",
    filterSearchLabel: "Search",
    filterSearchPlaceholder: "Search by place name",
    clearFilters: "Clear filters",
    retry: "Retry",
    noPlacesFound: "No places found for current filters.",
    favoritesOnly: "Favorites only",
    addFavorite: "Add to favorites",
    removeFavorite: "Remove from favorites",
    pageLabel: "Page",
    paginationPrevious: "Previous",
    paginationNext: "Next",
    loadingPage: "Loading page...",
  },
  bg: {
    navHome: "Начало",
    navPlaces: "Забележителности",
    navContacts: "Контакти",
    discoverTitle: "Открий България",
    discoverDescription:
      "Намерете вдъхновяващи дестинации—от планини и манастири до морски градове. Филтрирайте по град и категория и планирайте следващото си пътуване.",
    placesTitle: "Места за посещение",
    placesLoading: "Зареждане на места...",
    placesError: "Неуспешно зареждане.",
    filtersTitle: "Филтри",
    filterAllTowns: "Всички градове",
    filterAllCategories: "Всички категории",
    filterCategoryLabel: "Категория",
    categoryMountain: "Планина",
    categorySea: "Море",
    categoryCity: "Град",
    categoryHistorical: "Исторически",
    contactsTitle: "Контакти",
    contactsEmail: "Имейл",
    contactsPhone: "Телефон",
    contactFormTitle: "Изпратете съобщение",
    contactName: "Име",
    contactEmail: "Имейл",
    contactMessage: "Съобщение",
    contactSubmit: "Изпрати",
    placeDetailsTitle: "За това място",
    mapsButton: "Отвори в Google Maps",
    backToPlaces: "Назад към местата",
    galleryTitle: "Фото галерия",
    previousPhoto: "Назад",
    nextPhoto: "Напред",
    detailsLoading: "Зареждане на детайли...",
    detailsError: "Неуспешно зареждане на детайли.",
    darkMode: "Тъмно",
    lightMode: "Светло",
    filterSearchLabel: "Търсене",
    filterSearchPlaceholder: "Търсене по име на място",
    clearFilters: "Изчисти филтрите",
    retry: "Опитай отново",
    noPlacesFound: "Няма намерени места за избраните филтри.",
    favoritesOnly: "Само любими",
    addFavorite: "Добави в любими",
    removeFavorite: "Премахни от любими",
    pageLabel: "Страница",
    paginationPrevious: "Назад",
    paginationNext: "Напред",
    loadingPage: "Зареждане на страница...",
  },
};

function getDefaultLang() {
  const saved = localStorage.getItem("lang");
  if (saved === "en" || saved === "bg") return saved;
  const browser = (navigator.language || "").toLowerCase();
  return browser.startsWith("bg") ? "bg" : "en";
}

export default function App() {
  const [lang, setLang] = useState(getDefaultLang);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const t = useMemo(() => translations[lang] || translations.en, [lang]);

  return (
    <div className="appRoot">
      <Header lang={lang} setLang={setLang} t={t} theme={theme} setTheme={setTheme} />
      <main className="appMain">
        <Suspense fallback={<div className="pageContainer statusText">{t.loadingPage}</div>}>
          <Routes>
            <Route path="/" element={<Home lang={lang} t={t} />} />
            <Route path="/places" element={<Places lang={lang} t={t} />} />
            <Route path="/places/:id" element={<PlaceDetails lang={lang} t={t} />} />
            <Route path="/contacts" element={<Contacts lang={lang} t={t} />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

