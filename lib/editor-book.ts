import type { TemplateItem } from "@/data/catalog";
import { layoutCells } from "@/lib/photo-layouts";
import type { ProjectPhoto } from "@/lib/photos";

export type PageLayout = string;

export type TextAlign = "right" | "center" | "left" | "justify";
export type TextRole = "kicker" | "title" | "year" | "note" | "body" | "spine";

export type TextBlock = {
  id: string;
  role: TextRole;
  text: string;
  x: number;
  y: number;
  w: number;
  z: number;
  fontFamily: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: TextAlign;
};

export type PhotoFilter = "none" | "grayscale" | "sepia" | "warm" | "cool";
export type ShapeStroke = "none" | "solid" | "dashed";

export type PhotoSlot = {
  id: string;
  photoId: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  zoom: number;
  rotate: number;
  flipX: boolean;
  opacity: number;
  border: boolean;
  borderWidth: number;
  filter: PhotoFilter;
};

export type Decor = {
  id: string;
  kind: "rect" | "ellipse" | "sticker";
  value: string;
  fill: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  opacity: number;
  stroke: ShapeStroke;
  radius: number;
};

export const TEXT_FONTS = [
  { id: '"Instrument Serif", Georgia, serif', label: "اینسترومنت" },
  { id: "Peyda", label: "پیدا" },
  { id: "Sarbaz", label: "سرباز" },
  { id: "Pinar", label: "پینار" },
  { id: "Potk", label: "پوتک" },
  { id: "Georgia, serif", label: "سریف" },
  { id: '"Times New Roman", Times, serif', label: "تایمز" },
  { id: "Arial, sans-serif", label: "آریال" },
  { id: "Tahoma, sans-serif", label: "تahoma" },
];

export const TEXT_SIZES = [12, 14, 16, 18, 22, 28, 36, 48, 64, 80, 96, 120, 122];

export function styleFromText(item: TextBlock): Omit<TextBlock, "id" | "role" | "text" | "x" | "y" | "w" | "z"> {
  return {
    fontFamily: item.fontFamily,
    fontSize: item.fontSize,
    color: item.color,
    bold: item.bold,
    italic: item.italic,
    underline: item.underline,
    align: item.align,
  };
}

function textDefaults(role: TextRole, kind: BookPage["kind"], index = 0): Omit<TextBlock, "id" | "role" | "text"> {
  const base = {
    z: index + 1,
    fontFamily: "Peyda",
    color: kind === "inner" ? "#2c2c2c" : "#ffffff",
    bold: false,
    italic: false,
    underline: false,
    align: "center" as TextAlign,
  };
  if (role === "kicker") return { ...base, x: 10, y: 6, w: 80, fontSize: 13 };
  if (role === "title" && kind === "cover-back") return { ...base, x: 8, y: 30, w: 84, fontSize: 26, bold: true };
  if (role === "title") return { ...base, x: 8, y: 64, w: 84, fontSize: 34, italic: true, fontFamily: '"Instrument Serif", Georgia, serif' };
  if (role === "year") return { ...base, x: 8, y: 76, w: 84, fontSize: 86, bold: true, fontFamily: '"Instrument Serif", Georgia, serif' };
  if (role === "note") return { ...base, x: 12, y: 62, w: 76, fontSize: 13 };
  if (role === "spine") return { ...base, x: 12, y: index === 0 ? 8 : 70, w: 76, fontSize: index === 0 ? 13 : 11, color: "#ffffff" };
  return { ...base, x: 14, y: 36 + index * 10, w: 72, fontSize: 16 };
}

export function createText(role: TextRole, text: string, kind: BookPage["kind"] = "inner", index = 0): TextBlock {
  return { id: uid("tx"), role, text, ...textDefaults(role, kind, index) };
}

export function createSpineTexts(title: string): TextBlock[] {
  return [createText("spine", title, "cover-front", 0), createText("spine", "۱۴۰۵", "cover-front", 1)];
}

export function spinePage(texts: TextBlock[], background = "transparent"): BookPage {
  return {
    id: "spine",
    kind: "cover-front",
    background,
    layout: "blank",
    slots: [],
    texts,
    decors: [],
  };
}

const PHOTO_STYLE = {
  zoom: 100,
  rotate: 0,
  flipX: false,
  opacity: 100,
  border: false,
  borderWidth: 5,
  filter: "none" as PhotoFilter,
};

export function createSlot(index = 0, layout: PageLayout = "hero"): PhotoSlot {
  const cell = layoutCells(layout)[index];
  return {
    id: uid("slot"),
    photoId: null,
    x: cell?.x ?? 18,
    y: cell?.y ?? 16,
    w: cell?.w ?? 64,
    h: cell?.h ?? 42,
    z: index + 1,
    ...PHOTO_STYLE,
  };
}

export function createDecor(kind: Decor["kind"], index = 0): Decor {
  return {
    id: uid("dc"),
    kind,
    value: kind === "sticker" ? "✦" : "",
    fill: "#7db8b4",
    x: 12 + index * 8,
    y: 12 + index * 8,
    w: kind === "ellipse" ? 18 : 22,
    h: kind === "ellipse" ? 18 : 18,
    z: 20 + index,
    opacity: 100,
    stroke: "none",
    radius: 0,
  };
}

export function normalizeText(item: Partial<TextBlock> & Pick<TextBlock, "id" | "role" | "text">, kind: BookPage["kind"], index = 0): TextBlock {
  return { ...createText(item.role, item.text, kind, index), ...item };
}

export function normalizeSlot(item: Partial<PhotoSlot> & Pick<PhotoSlot, "id">, index = 0, layout: PageLayout = "hero"): PhotoSlot {
  return { ...createSlot(index, layout), ...item };
}

export function normalizeDecor(item: Partial<Decor> & Pick<Decor, "id" | "kind">, index = 0): Decor {
  const next = { ...createDecor(item.kind, index), ...item };
  if (!item.fill && item.value?.startsWith("#")) next.fill = item.value;
  return next;
}

export function normalizePage(item: BookPage): BookPage {
  const background = item.kind === "inner" && (item.background === "#6eaaa6" || !item.background) ? INNER_BG : item.background;
  return {
    ...item,
    background,
    texts: item.texts.map((text, index) => normalizeText(text, item.kind, index)),
    slots: item.slots.map((slot, index) => normalizeSlot(slot, index, item.layout)),
    decors: item.decors.map((decor, index) => normalizeDecor(decor, index)),
  };
}

export function normalizeSpreads(spreads: Spread[]): Spread[] {
  return spreads.map((spread) => {
    const pages = spread.pages.map(normalizePage) as Spread["pages"];
    const isCover = pages[0]?.kind === "cover-front";
    let spineTexts = (spread.spineTexts ?? []).map((text, index) => normalizeText({ ...text, role: text.role ?? "spine" }, "cover-front", index));
    if (isCover && spineTexts.length === 0) {
      const title = pages[0].texts.find((item) => item.role === "title")?.text ?? spread.spineText ?? "لحظه‌ها";
      spineTexts = spread.spineText ? [createText("spine", spread.spineText, "cover-front", 0)] : createSpineTexts(title);
    }
    return { ...spread, pages, spineTexts };
  });
}

export type BookPage = {
  id: string;
  kind: "cover-front" | "cover-back" | "inner";
  background: string;
  layout: PageLayout;
  slots: PhotoSlot[];
  texts: TextBlock[];
  decors: Decor[];
};

export type Spread = {
  id: string;
  label: string;
  pages: [BookPage, BookPage];
  spineText?: string;
  spineTexts?: TextBlock[];
};

export type BookProject = {
  projectId: string;
  templateId: string | null;
  spreads: Spread[];
};

const DEFAULT_BG = "#7db8b4";
const INNER_BG = "#ffffff";

export function uid(prefix = "el") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function slots(count: number, layout: PageLayout = "hero"): PhotoSlot[] {
  return Array.from({ length: count }, (_, index) => createSlot(index, layout));
}

function page(partial: Omit<BookPage, "id" | "decors"> & { decors?: Decor[] }): BookPage {
  return { id: uid("page"), decors: [], ...partial };
}

export function layoutSlotCount(layout: PageLayout) {
  return layoutCells(layout).length;
}

export function applyLayout(current: BookPage, layout: PageLayout): BookPage {
  const cells = layoutCells(layout);
  const nextSlots = cells.map((cell, index) => {
    const keep = current.slots[index];
    return {
      ...(keep ?? createSlot(index, layout)),
      ...cell,
      id: keep?.id ?? uid("slot"),
      photoId: keep?.photoId ?? null,
      z: index + 1,
    };
  });
  return { ...current, layout, slots: nextSlots };
}

export function createDefaultBook(template?: TemplateItem | null): Spread[] {
  const bg = template?.color ?? DEFAULT_BG;
  const title = template?.title ?? "تابستان ۱۴۰۵";
  const note = template?.subtitle ?? "اینجا یک یادداشت کوتاه دربارهٔ این فصل و چیزی که برایت معنا داشت بنویس.";

  const coverFront = page({
    kind: "cover-front",
    background: bg,
    layout: "hero",
    slots: slots(1),
    texts: [createText("kicker", "لحظه‌ها", "cover-front", 0), createText("title", title, "cover-front", 1), createText("year", "۱۴۰۵", "cover-front", 2)],
  });
  const coverBack = page({
    kind: "cover-back",
    background: bg,
    layout: "note",
    slots: [],
    texts: [createText("kicker", "لحظه‌ها", "cover-back", 0), createText("title", title, "cover-back", 1), createText("note", note, "cover-back", 2)],
  });

  const inner = (label: string, left: PageLayout, right: PageLayout): Spread => ({
    id: uid("spread"),
    label,
    pages: [
      page({ kind: "inner", background: INNER_BG, layout: right, slots: slots(layoutSlotCount(right), right), texts: [] }),
      page({ kind: "inner", background: INNER_BG, layout: left, slots: slots(layoutSlotCount(left), left), texts: [] }),
    ],
  });

  return [
    { id: uid("spread"), label: "جلد", pages: [coverFront, coverBack], spineTexts: createSpineTexts(title) },
    inner("۱–۲", "grid-2", "hero"),
    inner("۳–۴", "grid-4", "note"),
    inner("۵–۶", "hero", "grid-2"),
  ];
}

export function fillEmptySlots(spreads: Spread[], photos: ProjectPhoto[]): Spread[] {
  let index = 0;
  return spreads.map((spread) => ({
    ...spread,
    pages: spread.pages.map((item) => ({
      ...item,
      slots: item.slots.map((slot) => {
        if (slot.photoId || index >= photos.length) return slot;
        return { ...slot, photoId: photos[index++].id };
      }),
    })) as Spread["pages"],
  }));
}

export function createInnerSpread(label: string): Spread {
  return {
    id: uid("spread"),
    label,
    pages: [
      page({ kind: "inner", background: INNER_BG, layout: "hero", slots: slots(1, "hero"), texts: [] }),
      page({ kind: "inner", background: INNER_BG, layout: "grid-2", slots: slots(2, "grid-2"), texts: [] }),
    ],
  };
}

export function relabelSpreads(spreads: Spread[]): Spread[] {
  return spreads.map((spread, index) => {
    if (index === 0) return { ...spread, label: "جلد" };
    const start = (index - 1) * 2 + 1;
    return { ...spread, label: `${start}–${start + 1}` };
  });
}

export function loadBookProject(projectId: string): BookProject | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`akstory.project.${projectId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BookProject;
    if (!parsed?.spreads?.length) return null;
    return { ...parsed, spreads: normalizeSpreads(parsed.spreads) };
  } catch {
    return null;
  }
}

export function saveBookProject(project: BookProject) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `akstory.project.${project.projectId}`,
    JSON.stringify({ ...project, updatedAt: new Date().toISOString() }),
  );
}
