import { layoutById, type SlotRect } from "@/lib/photo-layouts";
import { photoOrientation, type PhotoAnalysis, type PhotoOrientation } from "@/lib/smart-creation/analyze";

const CANDIDATES: Record<number, string[]> = {
  1: ["panorama-wide", "landscape-full", "portrait-full", "full"],
  2: ["stack-h-2", "split-v", "hero-right"],
  3: ["hero-support", "stack-h-3", "strips-3"],
  4: ["landscape-grid", "portrait-grid", "grid-4", "strips-4", "mixed-4"],
};

export function slotOrientation(cell: SlotRect): PhotoOrientation {
  return photoOrientation(cell.w / cell.h);
}

export function orientationsCompatible(photo: PhotoOrientation, slot: PhotoOrientation) {
  if (photo === slot) return true;
  if (photo === "square") return slot !== "panorama";
  if (photo === "panorama") return slot === "landscape";
  if (photo === "landscape") return slot === "panorama";
  return false;
}

function slotRank(orientation: PhotoOrientation) {
  if (orientation === "panorama") return 0;
  if (orientation === "portrait") return 1;
  if (orientation === "landscape") return 2;
  return 3;
}

export function assignPhotosToSlots(photos: PhotoAnalysis[], cells: SlotRect[]) {
  if (photos.length !== cells.length) return null;
  const remaining = [...photos];
  const assignment: PhotoAnalysis[] = Array.from({ length: cells.length });
  const order = cells
    .map((cell, index) => ({ index, orientation: slotOrientation(cell) }))
    .sort((a, b) => slotRank(a.orientation) - slotRank(b.orientation));

  for (const slot of order) {
    const matchIndex = remaining.findIndex((photo) => orientationsCompatible(photo.orientation, slot.orientation));
    if (matchIndex < 0) return null;
    assignment[slot.index] = remaining.splice(matchIndex, 1)[0];
  }
  return assignment;
}

function scoreLayout(photos: PhotoAnalysis[], layoutId: string) {
  const cells = layoutById(layoutId)?.cells;
  if (!cells) return -1;
  const assigned = assignPhotosToSlots(photos, cells);
  if (!assigned) return -1;
  let exact = 0;
  assigned.forEach((photo, index) => {
    if (photo.orientation === slotOrientation(cells[index])) exact += 1;
  });
  return exact * 10 + (photos.length === 1 ? 2 : 0);
}

export function matchLayout(photos: PhotoAnalysis[]) {
  if (photos.length === 0) return "full";
  const ids = CANDIDATES[Math.min(photos.length, 4)] ?? CANDIDATES[1];
  let best = ids[ids.length - 1];
  let bestScore = -1;
  for (const id of ids) {
    const score = scoreLayout(photos, id);
    if (score > bestScore) {
      best = id;
      bestScore = score;
    }
  }
  if (bestScore >= 0) return best;
  if (photos.length === 1) {
    if (photos[0].orientation === "portrait") return "portrait-full";
    if (photos[0].orientation === "panorama") return "panorama-wide";
    return "landscape-full";
  }
  return photos.every((item) => item.orientation === "portrait") ? "split-v" : "stack-h-2";
}

function mixedHero(queue: PhotoAnalysis[]) {
  const head = queue.slice(0, Math.min(3, queue.length));
  if (head.length < 3) return null;
  const wide = head.filter((item) => item.orientation === "landscape" || item.orientation === "panorama");
  const tall = head.filter((item) => item.orientation === "portrait" || item.orientation === "square");
  if (wide.length === 1 && tall.length === 2 && scoreLayout(head, "hero-support") >= 0) return head;
  return null;
}

export function pickChunk(queue: PhotoAnalysis[]) {
  const first = queue[0];
  if (!first) return [];
  if (first.orientation === "panorama") return [first];

  const hero = mixedHero(queue);
  if (hero) return hero;

  let same = 1;
  while (same < queue.length && same < 4 && queue[same].orientation === first.orientation) same += 1;
  for (let count = same; count >= 1; count -= 1) {
    const chunk = queue.slice(0, count);
    if (scoreLayout(chunk, matchLayout(chunk)) >= 0) return chunk;
  }

  for (let count = Math.min(4, queue.length); count >= 1; count -= 1) {
    const chunk = queue.slice(0, count);
    if (assignPhotosToSlots(chunk, layoutById(matchLayout(chunk))?.cells ?? [])) return chunk;
  }
  return [first];
}
