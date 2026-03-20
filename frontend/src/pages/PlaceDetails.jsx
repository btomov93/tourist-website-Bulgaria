import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPlaceById } from "../services/api";

const DETAILS_FALLBACK_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Bulgaria_on_the_globe_%28Europe_centered%29.svg/1024px-Bulgaria_on_the_globe_%28Europe_centered%29.svg.png";

function buildGallery(place, lang) {
  const fromDb = Array.isArray(place.gallery_urls) ? place.gallery_urls : [];
  if (fromDb.length >= 10) return fromDb.slice(0, 10);
  if (fromDb.length > 0) return fromDb;

  const query = encodeURIComponent(`${lang === "bg" ? place.title_bg : place.title_en} Bulgaria`);
  const generated = Array.from({ length: 10 }, (_, i) => {
    return `https://source.unsplash.com/1400x900/?${query}&sig=${place.id}-${i + 1}`;
  });
  return generated;
}

function buildTenSentenceDetails(place, lang) {
  if (lang === "bg" && place.details_bg) return place.details_bg;
  if (lang === "en" && place.details_en) return place.details_en;

  if (lang === "bg") {
    return [
      `${place.title_bg} е едно от най-впечатляващите места в България.`,
      `Тази дестинация се намира в района на ${place.town} и е лесно достъпна.`,
      "Мястото е любимо на туристи заради съчетанието между история и природа.",
      "Най-подходящото време за посещение е пролетта и есента, когато времето е приятно.",
      "На място ще откриете гледки, които са отлични за снимки и спокойни разходки.",
      "Ако обичате културен туризъм, ще намерите много интересни факти и местни истории.",
      "Районът предлага и традиционна българска кухня в близки ресторанти.",
      "Препоръчително е да отделите поне половин ден, за да разгледате всичко спокойно.",
      "Носете удобни обувки и вода, особено ако планирате по-дълга разходка.",
      `${place.title_bg} е чудесен избор за семейна екскурзия или уикенд приключение.`,
    ].join(" ");
  }

  return [
    `${place.title_en} is one of the most impressive destinations in Bulgaria.`,
    `The site is in the ${place.town} area and is relatively easy to reach.`,
    "Visitors love this place because it combines history, scenery, and local culture.",
    "Spring and autumn are usually the best seasons for a comfortable visit.",
    "You can enjoy beautiful viewpoints that are perfect for photography.",
    "If you enjoy cultural travel, the area offers many interesting local stories.",
    "Nearby restaurants often serve authentic Bulgarian cuisine worth trying.",
    "Plan at least half a day so you can explore without rushing.",
    "Wear comfortable shoes and carry water, especially for longer walks.",
    `${place.title_en} is a great choice for a weekend trip or a family outing.`,
  ].join(" ");
}

export default function PlaceDetails({ lang, t }) {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [brokenImages, setBrokenImages] = useState({});

  function loadPlace() {
    setLoading(true);
    setError("");
    return getPlaceById(id)
      .then((data) => {
        setPlace(data);
      })
      .catch((err) => {
        setError(err?.message || "Unknown error");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    getPlaceById(id)
      .then((data) => {
        if (!alive) return;
        setPlace(data);
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
  }, [id]);

  const gallery = useMemo(() => {
    if (!place) return [];
    return buildGallery(place, lang);
  }, [place, lang]);

  const title = place ? (lang === "bg" ? place.title_bg : place.title_en) : "";
  const detailsText = place ? buildTenSentenceDetails(place, lang) : "";

  function previousPhoto() {
    setPhotoIndex((idx) => (idx === 0 ? gallery.length - 1 : idx - 1));
  }

  function nextPhoto() {
    setPhotoIndex((idx) => (idx === gallery.length - 1 ? 0 : idx + 1));
  }

  function onTouchStart(e) {
    setTouchStartX(e.changedTouches[0].clientX);
  }

  function onTouchEnd(e) {
    if (touchStartX == null) return;
    const endX = e.changedTouches[0].clientX;
    const delta = endX - touchStartX;
    if (Math.abs(delta) > 35) {
      if (delta > 0) previousPhoto();
      else nextPhoto();
    }
    setTouchStartX(null);
  }

  function getImageSrc(src, idx) {
    return brokenImages[idx] ? DETAILS_FALLBACK_IMAGE : src;
  }

  function markBroken(idx) {
    setBrokenImages((prev) => ({ ...prev, [idx]: true }));
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "ArrowLeft") previousPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gallery.length]);

  if (loading) {
    return (
      <div className="pageContainer">
        <div className="skeleton skeletonLargeTitle" />
        <div className="skeleton skeletonCarousel" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="pageContainer statusError">
        {t.detailsError} {error}{" "}
        <button type="button" className="retryBtn" onClick={loadPlace}>
          {t.retry}
        </button>
      </div>
    );
  }
  if (!place) return <div className="pageContainer statusError">{t.detailsError}</div>;

  return (
    <section className="pageContainer detailsFadeIn">
      <Link to="/places" className="textLink">
        {t.backToPlaces}
      </Link>

      <h1 className="detailTitle">{title}</h1>

      <div
        className="carousel"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          className="carouselImage"
          src={getImageSrc(gallery[photoIndex] || place.image_url || DETAILS_FALLBACK_IMAGE, photoIndex)}
          alt={title}
          onError={() => markBroken(photoIndex)}
        />
        <button
          type="button"
          className="carouselBtn left"
          onClick={previousPhoto}
          aria-label={t.previousPhoto}
        >
          {t.previousPhoto}
        </button>
        <button
          type="button"
          className="carouselBtn right"
          onClick={nextPhoto}
          aria-label={t.nextPhoto}
        >
          {t.nextPhoto}
        </button>
      </div>

      <div className="carouselMeta">
        {photoIndex + 1} / {gallery.length || 1}
      </div>

      <div className="detailsPanel">
        <h2 className="sectionTitle">{t.placeDetailsTitle}</h2>
        <p className="detailsText">{detailsText}</p>
        <a className="primaryBtn mapsBtn" href={place.map_url || "#"} target="_blank" rel="noreferrer">
          {t.mapsButton}
        </a>
      </div>

      <h2 className="sectionTitle">{t.galleryTitle}</h2>
      <div className="thumbGrid">
        {gallery.map((src, idx) => (
          <button
            type="button"
            key={src}
            className={idx === photoIndex ? "thumbItem active" : "thumbItem"}
            onClick={() => setPhotoIndex(idx)}
          >
            <img
              src={getImageSrc(src, idx)}
              alt={`${title} ${idx + 1}`}
              onError={() => markBroken(idx)}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

