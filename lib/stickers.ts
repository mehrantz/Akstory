import categories from "@/data/sticker-categories.json";

export type StickerCategory = "iran" | "beach" | "flower" | "animal";

export type StickerItem = {
  id: string;
  src: string;
  category: StickerCategory;
};

export const STICKER_CATEGORIES: { id: StickerCategory; label: string }[] = [
  { id: "iran", label: "ایران" },
  { id: "beach", label: "ساحل" },
  { id: "flower", label: "گل" },
  { id: "animal", label: "حیوانات" },
];

const AUTO_CATEGORIES = ["beach", "flower", "animal"] as const;

const IRAN_STICKERS: StickerItem[] = [
  { id: "iran-hafezieh", src: "/sticker/iran/hafezieh.png", category: "iran" },
  { id: "iran-badgir", src: "/sticker/iran/badgir.png", category: "iran" },
  { id: "iran-azadi-tower", src: "/sticker/iran/azadi-tower.png", category: "iran" },
];

export function stickerSrcFromId(id: string) {
  return `/sticker/${id}.png`;
}

export const STICKERS: StickerItem[] = [
  ...IRAN_STICKERS,
  ...AUTO_CATEGORIES.flatMap((category) =>
    categories[category].map((id) => ({
      id,
      src: stickerSrcFromId(id),
      category,
    })),
  ),
];

export function stickersByCategory(category: StickerCategory) {
  return STICKERS.filter((sticker) => sticker.category === category);
}
