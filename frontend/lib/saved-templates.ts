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
const DB_NAME = "akstory";
const DB_STORE = "coverTemplates";
const DB_RECORD = "all";

export const SHIRAZ_TEMPLATE_PREVIEW = "/images/templates/shiraz-preview.png";
export const YAZD_TEMPLATE_PREVIEW = "/images/templates/yazd-preview.png";

function normalizeList(items: SavedCoverTemplate[]) {
  return items
    .filter((item) => item?.id && item.spread)
    .map((item) => ({
      ...item,
      spread: normalizeSpreads([item.spread])[0],
      photos: Array.isArray(item.photos) ? item.photos : [],
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function readLocal(): SavedCoverTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedCoverTemplate[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(items: SavedCoverTemplate[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items.map((item) => ({ ...item, photos: item.photos.slice(0, 2) }))),
      );
    } catch {
      // IndexedDB remains the source of truth when localStorage is full.
    }
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DB_STORE)) db.createObjectStore(DB_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readDb(): Promise<SavedCoverTemplate[] | null> {
  if (typeof window === "undefined" || !window.indexedDB) return null;
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const request = db.transaction(DB_STORE, "readonly").objectStore(DB_STORE).get(DB_RECORD);
      request.onsuccess = () => {
        const value = request.result;
        resolve(Array.isArray(value) ? (value as SavedCoverTemplate[]) : []);
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

async function writeDb(items: SavedCoverTemplate[]) {
  if (typeof window === "undefined" || !window.indexedDB) return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const request = db.transaction(DB_STORE, "readwrite").objectStore(DB_STORE).put(items, DB_RECORD);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function persist(items: SavedCoverTemplate[]) {
  const next = normalizeList(items);
  await writeDb(next);
  writeLocal(next);
  return next;
}

export async function loadSavedCoverTemplates() {
  const fromDb = await readDb();
  if (fromDb && fromDb.length) return normalizeList(fromDb);
  const fromLocal = normalizeList(readLocal());
  if (fromLocal.length) await writeDb(fromLocal);
  return fromLocal;
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

export async function saveCoverTemplate(spread: Spread, photos: ProjectPhoto[]) {
  const item: SavedCoverTemplate = {
    id: uid("tpl"),
    title: coverTitle(spread),
    createdAt: new Date().toISOString(),
    spread: JSON.parse(JSON.stringify(spread)) as Spread,
    photos: photosForSpread(spread, photos).map((photo) => ({ ...photo })),
  };
  const current = await loadSavedCoverTemplates();
  return persist([item, ...current.filter((entry) => entry.id !== item.id)]);
}

export async function deleteSavedCoverTemplate(id: string) {
  const current = await loadSavedCoverTemplates();
  return persist(current.filter((item) => item.id !== id));
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
