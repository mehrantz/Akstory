import fs from "fs";
import path from "path";
import sharp from "sharp";

const STICKER_DIR = path.resolve("public/sticker");
const OUT_FILE = path.resolve("data/sticker-categories.json");

function pixelScores(r, g, b) {
  if (r + g + b < 35) return null;

  let beach = 0;
  let flower = 0;
  let animal = 0;

  if (b > r + 18 && b > g - 5) beach += 2.2;
  if (b > 120 && g > 110 && r < 170) beach += 1.4;
  if (r > 185 && g > 165 && b < 130) beach += 1.6;
  if (r > 210 && g > 200 && b > 150 && b < 230) beach += 1.1;

  if (r > 185 && g < 130 && b > 90 && b < 190) flower += 2.1;
  if (r > 205 && g < 105 && b < 110) flower += 2.2;
  if (r > 205 && g > 175 && b < 90) flower += 1.7;
  if (g > r + 25 && g > b + 15 && r > 50 && g < 210) flower += 1.3;
  if (r > 140 && b > 110 && g < 110) flower += 1.5;

  if (r > 95 && r < 205 && g > 55 && g < 165 && b < 105) animal += 2;
  if (r > 175 && g > 95 && g < 175 && b < 95) animal += 1.7;
  if (Math.abs(r - g) < 28 && Math.abs(g - b) < 28 && r > 75 && r < 185) animal += 1.2;
  if (r > 115 && g > 75 && b < 75) animal += 0.9;

  return { beach, flower, animal };
}

async function classifyFile(file) {
  const { data } = await sharp(path.join(STICKER_DIR, file))
    .resize(72, 72, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const scores = { beach: 0, flower: 0, animal: 0 };
  let count = 0;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const hit = pixelScores(data[i], data[i + 1], data[i + 2]);
    if (!hit) continue;
    scores.beach += hit.beach;
    scores.flower += hit.flower;
    scores.animal += hit.animal;
    count += 1;
  }

  if (count === 0) return "beach";

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return ranked[0][0];
}

const files = fs
  .readdirSync(STICKER_DIR)
  .filter((name) => /^sticker_\d+\.png$/i.test(name))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const categories = { beach: [], flower: [], animal: [] };

for (const file of files) {
  const id = file.replace(/\.png$/i, "");
  const category = await classifyFile(file);
  categories[category].push(id);
}

fs.writeFileSync(OUT_FILE, `${JSON.stringify(categories, null, 2)}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      total: files.length,
      beach: categories.beach.length,
      flower: categories.flower.length,
      animal: categories.animal.length,
    },
    null,
    2,
  ),
);
