export type SlotRect = { x: number; y: number; w: number; h: number };

export type PhotoLayout = {
  id: string;
  cells: SlotRect[];
};

function box(x: number, y: number, w: number, h: number): SlotRect {
  return { x, y, w, h };
}

export const PHOTO_LAYOUTS: PhotoLayout[] = [
  { id: "full", cells: [box(4, 4, 92, 92)] },
  { id: "split-v", cells: [box(4, 4, 45, 92), box(51, 4, 45, 92)] },
  {
    id: "hero-3stack",
    cells: [box(4, 4, 54, 92), box(60, 4, 36, 28), box(60, 36, 36, 28), box(60, 68, 36, 28)],
  },
  { id: "stack-h-2", cells: [box(4, 4, 92, 44), box(4, 52, 92, 44)] },
  {
    id: "grid-4",
    cells: [box(4, 4, 45, 44), box(51, 4, 45, 44), box(4, 52, 45, 44), box(51, 52, 45, 44)],
  },
  { id: "hero-right", cells: [box(4, 4, 36, 92), box(42, 4, 54, 92)] },
  { id: "strips-3", cells: [box(4, 4, 29, 92), box(35.5, 4, 29, 92), box(67, 4, 29, 92)] },
  {
    id: "grid-6",
    cells: [
      box(4, 4, 45, 28),
      box(51, 4, 45, 28),
      box(4, 36, 45, 28),
      box(51, 36, 45, 28),
      box(4, 68, 45, 28),
      box(51, 68, 45, 28),
    ],
  },
  {
    id: "mixed-l4",
    cells: [box(4, 4, 45, 58), box(51, 4, 21, 28), box(74, 4, 22, 28), box(51, 34, 21, 28), box(74, 34, 22, 28), box(4, 66, 92, 30)],
  },
  {
    id: "sidebar-4r",
    cells: [box(4, 4, 54, 92), box(60, 4, 17, 44), box(79, 4, 17, 44), box(60, 52, 17, 44), box(79, 52, 17, 44)],
  },
  {
    id: "sidebar-4l",
    cells: [box(4, 4, 17, 44), box(23, 4, 17, 44), box(4, 52, 17, 44), box(23, 52, 17, 44), box(42, 4, 54, 92)],
  },
  { id: "stack-h-3", cells: [box(4, 4, 92, 28), box(4, 36, 92, 28), box(4, 68, 92, 28)] },
  { id: "strips-4", cells: [box(4, 4, 21, 92), box(27.5, 4, 21, 92), box(51, 4, 21, 92), box(74.5, 4, 21, 92)] },
  {
    id: "mixed-4",
    cells: [box(4, 4, 45, 50), box(51, 4, 45, 23), box(51, 31, 45, 23), box(4, 58, 92, 38)],
  },
];

const ALIASES: Record<string, string> = {
  hero: "full",
  "grid-2": "split-v",
};

export function layoutById(id: string): PhotoLayout | undefined {
  const resolved = ALIASES[id] ?? id;
  return PHOTO_LAYOUTS.find((item) => item.id === resolved);
}

export function layoutCells(id: string) {
  return layoutById(id)?.cells ?? [];
}
