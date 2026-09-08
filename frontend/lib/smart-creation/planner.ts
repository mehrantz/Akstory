import { layoutSlotCount } from "@/lib/editor-book";
import type { PhotoAnalysis } from "@/lib/smart-creation/analyze";
import { matchLayout, pickChunk } from "@/lib/smart-creation/layout-matcher";

export type PagePlan = {
  layout: string;
  photoIds: string[];
};

export type InnerSpreadPlan = {
  right: PagePlan;
  left: PagePlan;
};

export type BookPlan = {
  cover: PagePlan;
  innerSpreads: InnerSpreadPlan[];
};

const EMPTY_PAGE: PagePlan = { layout: "full", photoIds: [] };

function pairPages(pages: PagePlan[]): InnerSpreadPlan[] {
  const spreads: InnerSpreadPlan[] = [];
  for (let index = 0; index < pages.length; index += 2) {
    spreads.push({
      right: pages[index] ?? EMPTY_PAGE,
      left: pages[index + 1] ?? EMPTY_PAGE,
    });
  }
  if (spreads.length === 0) spreads.push({ right: EMPTY_PAGE, left: EMPTY_PAGE });
  return spreads;
}

export function planBook(photos: PhotoAnalysis[]): BookPlan {
  if (photos.length === 0) {
    return { cover: EMPTY_PAGE, innerSpreads: pairPages([]) };
  }

  const coverPhoto = photos[0];
  const cover: PagePlan = {
    layout: matchLayout([coverPhoto]),
    photoIds: [coverPhoto.photoId],
  };

  const innerPages: PagePlan[] = [];
  const queue = photos.slice(1);
  while (queue.length) {
    const chunk = pickChunk(queue);
    innerPages.push({
      layout: matchLayout(chunk),
      photoIds: chunk.map((item) => item.photoId),
    });
    queue.splice(0, chunk.length);
  }

  return { cover, innerSpreads: pairPages(innerPages) };
}

export function plannedSlotCount(plan: BookPlan) {
  const pages = [plan.cover, ...plan.innerSpreads.flatMap((item) => [item.right, item.left])];
  return pages.reduce((sum, page) => sum + layoutSlotCount(page.layout), 0);
}
