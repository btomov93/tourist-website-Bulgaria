import { Link } from "react-router-dom";
import { useState } from "react";
import { prefetchPlace } from "../services/api";

const CARD_FALLBACK_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Bulgaria_on_the_globe_%28Europe_centered%29.svg/1024px-Bulgaria_on_the_globe_%28Europe_centered%29.svg.png";

export default function PlaceCard({ place, lang, isFavorite, onToggleFavorite, t }) {
  const title = lang === "bg" ? place.title_bg : place.title_en;
  const description = lang === "bg" ? place.description_bg : place.description_en;
  const [imgSrc, setImgSrc] = useState(place.image_url || CARD_FALLBACK_IMAGE);

  return (
    <Link
      to={`/places/${place.id}`}
      className="placeCardLink"
      onMouseEnter={() => prefetchPlace(place.id)}
      onFocus={() => prefetchPlace(place.id)}
    >
      <article className="placeCard">
        <img
          className="placeImage"
          src={imgSrc}
          alt={title}
          loading="lazy"
          onError={() => setImgSrc(CARD_FALLBACK_IMAGE)}
        />
        <div className="placeBody">
          <div className="placeTitleRow">
            <h3 className="placeTitle">{title}</h3>
            <button
              type="button"
              className={isFavorite ? "favoriteBtn active" : "favoriteBtn"}
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(place.id);
              }}
              aria-label={isFavorite ? t.removeFavorite : t.addFavorite}
              title={isFavorite ? t.removeFavorite : t.addFavorite}
            >
              {isFavorite ? "★" : "☆"}
            </button>
          </div>
          <p className="placeDescription">{description}</p>
        </div>
      </article>
    </Link>
  );
}

