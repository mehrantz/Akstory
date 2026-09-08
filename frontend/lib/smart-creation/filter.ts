import type { PhotoAnalysis } from "@/lib/smart-creation/analyze";

const MIN_EDGE = 280;
const MIN_PIXELS = 90_000;
const MIN_BYTES = 6_000;
const MAX_BYTES = 40_000_000;

export function filterPhotos(items: PhotoAnalysis[]): PhotoAnalysis[] {
  return items.filter((item) => {
    if (!item.ok) return false;
    if (Math.min(item.width, item.height) < MIN_EDGE) return false;
    if (item.width * item.height < MIN_PIXELS) return false;
    if (item.fileSize > 0 && item.fileSize < MIN_BYTES) return false;
    if (item.fileSize > MAX_BYTES) return false;
    return true;
  });
}
