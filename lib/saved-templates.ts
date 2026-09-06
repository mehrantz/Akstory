import { normalizeSpreads, uid, type Spread } from "@/lib/editor-book";
import type { ProjectPhoto } from "@/lib/photos";

export type SavedCoverTemplate = {
  id: string;
  title: string;
  createdAt: string;
  spread: Spread;
  photos: ProjectPhoto[];
  previewImage?: string;
};

const STORAGE_KEY = "akstory.savedCoverTemplates";
export const SHIRAZ_TEMPLATE_PREVIEW = "/images/templates/shiraz-preview.png";
export const YAZD_TEMPLATE_PREVIEW = "/images/templates/yazd-preview.png";

function readAll(): SavedCoverTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedCoverTemplate[];
    return parsed
      .filter((item) => !item.id.startsWith("builtin-"))
      .map((item) => ({
        ...item,
        spread: normalizeSpreads([item.spread])[0],
      }));
  } catch {
    return [];
  }
}

function writeAll(items: SavedCoverTemplate[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.filter((item) => !item.id.startsWith("builtin-"))));
}

function sortTemplates(items: SavedCoverTemplate[]) {
  const rank = (item: SavedCoverTemplate) => {
    if (item.title === "شیراز") return 0;
    if (item.title === "یزد") return 1;
    return 2;
  };

  return [...items].sort((a, b) => {
    const byRank = rank(a) - rank(b);
    if (byRank !== 0) return byRank;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

function migrateTemplates(items: SavedCoverTemplate[]) {
  const ordered = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  let changed = ordered.length !== items.length;

  const migrated = ordered.slice(0, 2).map((item, index) => {
    if (index === 0) {
      const next = { ...item, title: "شیراز", previewImage: SHIRAZ_TEMPLATE_PREVIEW };
      if (item.title !== next.title || item.previewImage !== next.previewImage) changed = true;
      return next;
    }
    const next = { ...item, title: "یزد", previewImage: YAZD_TEMPLATE_PREVIEW };
    if (item.title !== next.title || item.previewImage !== next.previewImage) changed = true;
    return next;
  });

  if (changed) writeAll(migrated);
  return migrated;
}

export function loadSavedCoverTemplates() {
  return sortTemplates(migrateTemplates(readAll()));
}

function coverTitle(spread: Spread) {
  const title = spread.pages[0]?.texts.find((item) => item.role === "title")?.text?.trim();
  return title || "قالب جلد";
}

function photosForSpread(spread: Spread, photos: ProjectPhoto[]) {
  const ids = new Set<string>();
  spread.pages.forEach((page) => {
    page.slots.forEach((slot) => {
      if (slot.photoId) ids.add(slot.photoId);
    });
  });
  return photos.filter((photo) => ids.has(photo.id));
}

export function saveCoverTemplate(spread: Spread, photos: ProjectPhoto[]) {
  const item: SavedCoverTemplate = {
    id: uid("tpl"),
    title: coverTitle(spread),
    createdAt: new Date().toISOString(),
    spread: JSON.parse(JSON.stringify(spread)) as Spread,
    photos: photosForSpread(spread, photos).map((photo) => ({ ...photo })),
  };
  writeAll([item, ...readAll()].slice(0, 2));
  return item;
}

export function deleteSavedCoverTemplate(id: string) {
  writeAll(readAll().filter((item) => item.id !== id));
}

export function cloneCoverSpread(source: Spread): Spread {
  const copy = JSON.parse(JSON.stringify(source)) as Spread;
  copy.id = uid("spread");
  copy.label = "جلد";
  copy.pages = copy.pages.map((page) => ({
    ...page,
    id: uid("page"),
    slots: page.slots.map((slot) => ({ ...slot, id: uid("slot") })),
    texts: page.texts.map((text) => ({ ...text, id: uid("tx") })),
    decors: page.decors.map((decor) => ({ ...decor, id: uid("dc") })),
  })) as Spread["pages"];
  if (copy.spineTexts?.length) {
    copy.spineTexts = copy.spineTexts.map((text) => ({ ...text, id: uid("tx") }));
  }
  return normalizeSpreads([copy])[0];
}
