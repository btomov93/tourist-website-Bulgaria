const express = require("express");
const { pool } = require("../db");

const router = express.Router();
const wikiCache = new Map();

const SELECT_FIELDS = `
  id,
  title_en,
  title_bg,
  description_en,
  description_bg,
  details_en,
  details_bg,
  image_url,
  map_url,
  gallery_urls,
  town,
  category
`;

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "bulgaria-tourism-demo/1.0",
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function getWikiSummaryImage(query) {
  const key = `summary:${query}`;
  if (wikiCache.has(key)) return wikiCache.get(key);

  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const data = await fetchJson(url);
    const image = data?.originalimage?.source || data?.thumbnail?.source || null;
    wikiCache.set(key, image);
    return image;
  } catch (_err) {
    wikiCache.set(key, null);
    return null;
  }
}

async function getWikiGalleryImages(query, limit = 10) {
  const key = `gallery:${query}:${limit}`;
  if (wikiCache.has(key)) return wikiCache.get(key);

  try {
    const search = `${query} Bulgaria -logo -map`;
    const url =
      `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*` +
      `&generator=search&gsrnamespace=6&gsrlimit=40&gsrsearch=${encodeURIComponent(search)}` +
      `&prop=imageinfo&iiprop=url`;
    const data = await fetchJson(url);
    const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
    const urls = pages
      .map((p) => p?.imageinfo?.[0]?.url)
      .filter(Boolean)
      .filter((u) => !u.toLowerCase().includes(".svg"))
      .slice(0, limit);
    wikiCache.set(key, urls);
    return urls;
  } catch (_err) {
    wikiCache.set(key, []);
    return [];
  }
}

async function enrichPlace(row, includeGallery = false) {
  const query = row.title_en;
  const summaryImage = await getWikiSummaryImage(query);
  const gallery = await getWikiGalleryImages(query, 10);
  const fallbackImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Bulgaria_on_the_globe_%28Europe_centered%29.svg/1024px-Bulgaria_on_the_globe_%28Europe_centered%29.svg.png";
  const bestCover = summaryImage || gallery[0] || row.image_url || fallbackImage;

  return {
    ...row,
    image_url: bestCover,
    gallery_urls: includeGallery
      ? (gallery.length ? gallery : [bestCover])
      : (Array.isArray(row.gallery_urls) ? row.gallery_urls : []),
  };
}

router.get("/", async (req, res, next) => {
  try {
    const { town, category } = req.query;

    const where = [];
    const values = [];

    if (town) {
      values.push(town);
      where.push(`town = $${values.length}`);
    }

    if (category) {
      values.push(category);
      where.push(`category = $${values.length}`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT ${SELECT_FIELDS}
       FROM places
       ${whereSql}
       ORDER BY id`,
      values
    );

    const enriched = await Promise.all(result.rows.map((row) => enrichPlace(row, false)));
    res.json(enriched);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const result = await pool.query(
      `SELECT ${SELECT_FIELDS}
       FROM places
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Place not found" });
    }

    const enriched = await enrichPlace(result.rows[0], true);
    res.json(enriched);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const {
      title_en,
      title_bg,
      description_en,
      description_bg,
      details_en,
      details_bg,
      image_url,
      map_url,
      gallery_urls,
      town,
      category,
    } = req.body || {};

    const result = await pool.query(
      `INSERT INTO places (
        title_en,
        title_bg,
        description_en,
        description_bg,
        details_en,
        details_bg,
        image_url,
        map_url,
        gallery_urls,
        town,
        category
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11)
       RETURNING ${SELECT_FIELDS}`,
      [
        title_en,
        title_bg,
        description_en,
        description_bg,
        details_en || null,
        details_bg || null,
        image_url,
        map_url || null,
        JSON.stringify(Array.isArray(gallery_urls) ? gallery_urls : []),
        town,
        category,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

