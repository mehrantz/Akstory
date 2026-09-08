import type { PhotoAnalysis } from "@/lib/smart-creation/analyze";
import { faceScore } from "@/lib/smart-creation/faces";

export type RankedPhoto = PhotoAnalysis & {
  score: number;
  reasons: string[];
  unique: boolean;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function qualityScore(item: PhotoAnalysis) {
  if (item.fileSize <= 0) return 0.4;
  if (item.fileSize < 20_000) return clamp01(item.fileSize / 20_000) * 0.4;
  if (item.fileSize < 80_000) return 0.5 + ((item.fileSize - 20_000) / 60_000) * 0.25;
  if (item.fileSize <= 700_000) return 0.78 + clamp01((item.fileSize - 80_000) / 620_000) * 0.22;
  return 0.82;
}

function resolutionScore(item: PhotoAnalysis) {
  return clamp01((item.width * item.height) / 2_000_000);
}

function aspectScore(item: PhotoAnalysis) {
  const ratio = item.aspectRatio;
  if (!ratio) return 0;
  const portrait = Math.abs(ratio - 0.75);
  const landscape = Math.abs(ratio - 4 / 3);
  const square = Math.abs(ratio - 1);
  const story = Math.abs(ratio - 9 / 16);
  const distance = Math.min(portrait, landscape, square, story);
  if (ratio > 2.6 || ratio < 0.35) return 0.25;
  return clamp01(1 - distance / 0.55);
}

function dateScore(item: PhotoAnalysis, newest: number, oldest: number) {
  if (!item.lastModified) return 0.35;
  if (newest <= oldest) return 0.8;
  const recency = (item.lastModified - oldest) / (newest - oldest);
  return 0.55 + recency * 0.45;
}

function reasonsFor(item: PhotoAnalysis, parts: {
  quality: number;
  resolution: number;
  aspect: number;
  unique: boolean;
}) {
  const reasons: string[] = [];
  if (parts.quality >= 0.72) reasons.push("high quality");
  if (parts.resolution >= 0.6) reasons.push("high resolution");
  if (parts.aspect >= 0.7) reasons.push("balanced frame");
  if (item.lastModified) reasons.push("has date");
  if (item.faceCount >= 2) reasons.push("contains faces");
  else if (item.faceCount === 1) reasons.push("contains faces");
  if (item.faceCount >= 2) reasons.push("group moment");
  if (parts.unique) reasons.push("unique photo");
  else reasons.push("similar shot");
  return reasons;
}

export function rankPhotos(items: PhotoAnalysis[], uniqueIds: Set<string>): RankedPhoto[] {
  if (items.length === 0) return [];
  const dated = items.filter((item) => item.lastModified > 0).map((item) => item.lastModified);
  const newest = dated.length ? Math.max(...dated) : 0;
  const oldest = dated.length ? Math.min(...dated) : 0;

  return items
    .map((item) => {
      const quality = qualityScore(item);
      const resolution = resolutionScore(item);
      const aspect = aspectScore(item);
      const date = dateScore(item, newest, oldest);
      const faces = faceScore(item.faceCount);
      const unique = uniqueIds.has(item.photoId);
      const raw = quality * 0.35 + resolution * 0.15 + aspect * 0.1 + date * 0.1 + faces * 0.3;
      const score = Math.round(raw * 100);
      return {
        ...item,
        unique,
        score,
        reasons: reasonsFor(item, { quality, resolution, aspect, unique }),
      };
    })
    .sort((a, b) => b.score - a.score);
}
