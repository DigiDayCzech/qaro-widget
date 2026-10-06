import { put } from "@vercel/blob";
import { createHash } from "node:crypto";

/* Zkracovat jde jen URL našeho widget rendereru, nic jiného. */
const ZAKLADY = String.raw`https:\/\/(?:(?:dominikdigiday|digidayczech)\.github\.io\/qaro-widget|qaro-widget[a-z0-9-]*\.vercel\.app)`;
const POVOLENE = [
  new RegExp(`^${ZAKLADY}\\/w\\/\\?c=[A-Za-z0-9_-]+$`),
  new RegExp(`^${ZAKLADY}\\/cez\\/w\\/\\?h=[A-Za-z0-9_-]{10,80}&s=(?:250|468|728)$`)   /* ČEZ odstávky */
];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Použij POST." });

  const url = typeof req.body?.url === "string" ? req.body.url.trim() : "";
  if (!url || url.length > 8192 || !POVOLENE.some((re) => re.test(url))) {
    return res.status(400).json({ error: "Zkrátit jde jen URL widgetu z generátoru." });
  }

  /* id = hash konfigurace, stejný widget má vždy stejný krátký odkaz */
  const id = createHash("sha256").update(url).digest("hex").slice(0, 8);

  await put(`s/${id}.json`, JSON.stringify({ url, created: new Date().toISOString() }), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json"
  });

  return res.status(200).json({ id, shortUrl: `https://${req.headers.host}/s/${id}` });
}
