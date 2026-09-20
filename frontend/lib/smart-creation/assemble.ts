import type { TemplateItem } from "@/data/catalog";
import {
  applyLayout,
  createDefaultBook,
  createInnerSpread,
  fillEmptySlots,
  layoutSlotCount,
  relabelSpreads,
  type BookPage,
  type BookProject,
} from "@/lib/editor-book";
import { layoutCells } from "@/lib/photo-layouts";
import type { ProjectPhoto } from "@/lib/photos";
import { applySavedCoverToSpreads, type SavedCoverTemplate } from "@/lib/saved-templates";
import type { PhotoAnalysis } from "@/lib/smart-creation/analyze";
import { assignPhotosToSlots } from "@/lib/smart-creation/layout-matcher";
import type { BookPlan, PagePlan } from "@/lib/smart-creation/planner";

function fillMatchingSlots(page: BookPage, photoIds: string[], analyses: Map<string, PhotoAnalysis>): BookPage {
  const laid = applyLayout(page, page.layout);
  if (photoIds.length === 0) return laid;
  const photos = photoIds.map((id) => analyses.get(id)).filter((item): item is PhotoAnalysis => Boolean(item));
  const assigned = assignPhotosToSlots(photos, layoutCells(laid.layout));
  const slots = laid.slots.map((slot, index) => ({
    ...slot,
    photoId: assigned?.[index]?.photoId ?? null,
  }));
  return { ...laid, slots };
}

function buildPage(source: BookPage, plan: PagePlan, analyses: Map<string, PhotoAnalysis>) {
  const next = applyLayout(source, plan.layout);
  return fillMatchingSlots({ ...next, layout: plan.layout }, plan.photoIds, analyses);
}

export function assembleBook(input: {
  projectId: string;
  templateId: string | null;
  template?: TemplateItem | null;
  coverTemplate?: SavedCoverTemplate | null;
  photos: ProjectPhoto[];
  analyses: PhotoAnalysis[];
  plan: BookPlan;
}): BookProject {
  const analyses = new Map(input.analyses.map((item) => [item.photoId, item]));
  const defaults = input.coverTemplate
    ? applySavedCoverToSpreads(createDefaultBook(input.template), input.coverTemplate)
    : createDefaultBook(input.template);
  const coverSource = defaults[0];
  const cover = {
    ...coverSource,
    pages: input.coverTemplate
      ? (fillEmptySlots([coverSource], input.photos)[0].pages as typeof coverSource.pages)
      : ([
          buildPage(coverSource.pages[0], input.plan.cover, analyses),
          coverSource.pages[1],
        ] as typeof coverSource.pages),
  };

  const inners = input.plan.innerSpreads.map((item, index) => {
    const spread = createInnerSpread(`${index * 2 + 1}–${index * 2 + 2}`);
    return {
      ...spread,
      pages: [
        buildPage(spread.pages[0], item.right, analyses),
        buildPage(spread.pages[1], item.left, analyses),
      ] as typeof spread.pages,
    };
  });

  return {
    projectId: input.projectId,
    templateId: input.templateId,
    spreads: relabelSpreads([cover, ...inners]),
  };
}

export function usedPhotoCount(plan: BookPlan) {
  return [plan.cover, ...plan.innerSpreads.flatMap((item) => [item.right, item.left])].reduce(
    (sum, page) => sum + Math.min(page.photoIds.length, layoutSlotCount(page.layout)),
    0,
  );
}
