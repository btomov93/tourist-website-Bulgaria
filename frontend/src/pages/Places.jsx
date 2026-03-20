import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPlaces, getPlacesFiltered } from "../services/api";
import PlaceCard from "../components/PlaceCard";

const CATEGORY_ORDER = ["mountain", "sea", "city", "historical"];
const TOWN_TRANSLATIONS_BG = {
  Bansko: "Банско",
  Belogradchik: "Белоградчик",
  Burgas: "Бургас",
  Gabrovo: "Габрово",
  Kavarna: "Каварна",
  Koprivshtitsa: "Копривщица",
  Melnik: "Мелник",
  Nesebar: "Несебър",
  Plovdiv: "Пловдив",
  Rila: "Рила",
  Ruse: "Русе",
  Smolyan: "Смолян",
  Sofia: "София",
  Sozopol: "Созопол",
  Varna: "Варна",
  "Veliko Tarnovo": "Велико Търново",
};

function categoryLabel(category, t) {
  switch (category) {
    case "mountain":
      return t.categoryMountain;
    case "sea":
      return t.categorySea;
    case "city":
      return t.categoryCity;
    case "historical":
      return t.categoryHistorical;
    default:
      return category;
  }
}

function townLabel(town, lang) {
  if (lang === "bg") return TOWN_TRANSLATIONS_BG[town] || town;
  return town;
}

export default function Places({ lang, t }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [allPlaces, setAllPlaces] = useState([]); // for dropdown options
  const [places, setPlaces] = useState([]); // for the grid
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [townFilter, setTownFilter] = useState(searchParams.get("town") || "");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "");
  const [searchText, setSearchText] = useState(searchParams.get("search") || "");
  const [favoritesOnly, setFavoritesOnly] = useState(searchParams.get("favorites") === "1");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page") || 1));
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem("favorites");
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  });

  const [didInitialLoad, setDidInitialLoad] = useState(false);
  const PAGE_SIZE = 9;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    getPlaces()
      .then((data) => {
        if (!alive) return;
        const list = Array.isArray(data) ? data : [];
        setAllPlaces(list);
        setPlaces(list);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err?.message || "Unknown error");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
        setDidInitialLoad(true);
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (townFilter) next.set("town", townFilter);
    if (categoryFilter) next.set("category", categoryFilter);
    if (searchText.trim()) next.set("search", searchText.trim());
    if (favoritesOnly) next.set("favorites", "1");
    if (currentPage > 1) next.set("page", String(currentPage));
    setSearchParams(next, { replace: true });
  }, [townFilter, categoryFilter, searchText, favoritesOnly, currentPage, setSearchParams]);

  const towns = useMemo(() => {
    const set = new Set(allPlaces.map((p) => p.town));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allPlaces]);

  const categories = useMemo(() => {
    const set = new Set(allPlaces.map((p) => p.category));
    const list = Array.from(set);
    list.sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
    return list;
  }, [allPlaces]);

  useEffect(() => {
    if (!didInitialLoad) return;

    let alive = true;
    setLoading(true);
    setError("");

    getPlacesFiltered({
      town: townFilter || undefined,
      category: categoryFilter || undefined,
    })
      .then((data) => {
        if (!alive) return;
        setPlaces(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err?.message || "Unknown error");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [townFilter, categoryFilter, didInitialLoad]);

  const visiblePlaces = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return places.filter((p) => {
      const title = (lang === "bg" ? p.title_bg : p.title_en).toLowerCase();
      const titleEn = (p.title_en || "").toLowerCase();
      const titleBg = (p.title_bg || "").toLowerCase();
      const searchOk = !q || title.includes(q) || titleEn.includes(q) || titleBg.includes(q);
      const favoritesOk = !favoritesOnly || favorites.has(p.id);
      return searchOk && favoritesOk;
    });
  }, [places, searchText, favoritesOnly, favorites, lang]);

  const totalPages = Math.max(1, Math.ceil(visiblePlaces.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagePlaces = visiblePlaces.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function resetFilters() {
    setTownFilter("");
    setCategoryFilter("");
    setSearchText("");
    setFavoritesOnly(false);
    setCurrentPage(1);
  }

  function retryLoad() {
    setLoading(true);
    getPlacesFiltered({
      town: townFilter || undefined,
      category: categoryFilter || undefined,
    })
      .then((data) => {
        setPlaces(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((err) => {
        setError(err?.message || "Unknown error");
      })
      .finally(() => setLoading(false));
  }

  function renderSkeletons() {
    return (
      <div className="placesGrid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="placeCard skeletonCard" key={i} aria-hidden="true">
            <div className="skeleton skeletonImage" />
            <div className="placeBody">
              <div className="skeleton skeletonTitle" />
              <div className="skeleton skeletonText" />
              <div className="skeleton skeletonText short" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="placesLayout">
      <aside className="sidebar">
        <h2 className="sidebarTitle">{t.filtersTitle}</h2>

        <div className="filterBlock">
          <label className="filterLabel" htmlFor="townSelect">
            {t.filterAllTowns}
          </label>
          <select
            id="townSelect"
            className="filterSelect"
            value={townFilter}
            onChange={(e) => {
              setTownFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">{t.filterAllTowns}</option>
            {towns.map((town) => (
              <option key={town} value={town}>
                {townLabel(town, lang)}
              </option>
            ))}
          </select>
        </div>

        <div className="filterBlock">
          <label className="filterLabel" htmlFor="categorySelect">
            {t.filterCategoryLabel}
          </label>
          <select
            id="categorySelect"
            className="filterSelect"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">{t.filterAllCategories}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabel(cat, t)}
              </option>
            ))}
          </select>
        </div>

        <div className="filterBlock">
          <label className="filterLabel" htmlFor="searchInput">
            {t.filterSearchLabel}
          </label>
          <input
            id="searchInput"
            className="filterSelect"
            placeholder={t.filterSearchPlaceholder}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filterBlock">
          <label className="favoritesCheck">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(e) => {
                setFavoritesOnly(e.target.checked);
                setCurrentPage(1);
              }}
            />
            {t.favoritesOnly}
          </label>
        </div>

        <button type="button" className="themeBtn clearBtn" onClick={resetFilters}>
          {t.clearFilters}
        </button>

        <div className="filterMeta">
          <div>
            {visiblePlaces.length} {lang === "bg" ? "места" : "places"}
          </div>
        </div>
      </aside>

      <section className="placesContent">
        <h2 className="pageTitle">{t.placesTitle}</h2>

        {loading && renderSkeletons()}
        {error && (
          <div className="statusError">
            {t.placesError} {error}{" "}
            <button type="button" className="retryBtn" onClick={retryLoad}>
              {t.retry}
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {pagePlaces.length === 0 ? (
              <div className="statusText">{t.noPlacesFound}</div>
            ) : (
              <div className="placesGrid">
                {pagePlaces.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    lang={lang}
                    isFavorite={favorites.has(place.id)}
                    onToggleFavorite={toggleFavorite}
                    t={t}
                  />
                ))}
              </div>
            )}

            <div className="pagination">
              <button
                type="button"
                className="themeBtn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
              >
                {t.paginationPrevious}
              </button>
              <span className="paginationInfo">
                {t.pageLabel} {safePage} / {totalPages}
              </span>
              <button
                type="button"
                className="themeBtn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
              >
                {t.paginationNext}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

