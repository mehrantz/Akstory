export type GuideRect = { x: number; y: number; w: number; h: number };

export type Guides = { v: number[]; h: number[] };

export type SnapMode = "move" | "left" | "right" | "top" | "bottom" | "nw" | "ne" | "sw" | "se";

const THRESHOLD = 1.15;
const MATCH = 0.28;

function nearest(value: number, targets: number[]) {
  let best = THRESHOLD;
  let snapped = value;
  for (const target of targets) {
    const distance = Math.abs(value - target);
    if (distance < best) {
      best = distance;
      snapped = target;
    }
  }
  return snapped;
}

function shift(moving: number[], targets: number[]) {
  let best = THRESHOLD;
  let delta = 0;
  for (const value of moving) {
    for (const target of targets) {
      const distance = Math.abs(value - target);
      if (distance < best) {
        best = distance;
        delta = target - value;
      }
    }
  }
  return best < THRESHOLD ? delta : 0;
}

function hits(values: number[], targets: number[]) {
  const found = new Set<number>();
  for (const value of values) {
    for (const target of targets) {
      if (Math.abs(value - target) <= MATCH) found.add(Math.round(target * 100) / 100);
    }
  }
  return [...found];
}

export function snapBox(raw: GuideRect, others: GuideRect[], mode: SnapMode): { rect: GuideRect; guides: Guides } {
  const xTargets = [0, 50, 100, ...others.flatMap((item) => [item.x, item.x + item.w / 2, item.x + item.w])];
  const yTargets = [0, 50, 100, ...others.flatMap((item) => [item.y, item.y + item.h / 2, item.y + item.h])];

  if (mode === "move") {
    const dx = shift([raw.x, raw.x + raw.w / 2, raw.x + raw.w], xTargets);
    const dy = shift([raw.y, raw.y + raw.h / 2, raw.y + raw.h], yTargets);
    const rect = { ...raw, x: raw.x + dx, y: raw.y + dy };
    return {
      rect,
      guides: {
        v: hits([rect.x, rect.x + rect.w / 2, rect.x + rect.w], xTargets),
        h: hits([rect.y, rect.y + rect.h / 2, rect.y + rect.h], yTargets),
      },
    };
  }

  const snapL = mode === "left" || mode === "nw" || mode === "sw";
  const snapR = mode === "right" || mode === "ne" || mode === "se";
  const snapT = mode === "top" || mode === "nw" || mode === "ne";
  const snapB = mode === "bottom" || mode === "sw" || mode === "se";

  const left = snapL ? nearest(raw.x, xTargets) : raw.x;
  const right = snapR ? nearest(raw.x + raw.w, xTargets) : raw.x + raw.w;
  const top = snapT ? nearest(raw.y, yTargets) : raw.y;
  const bottom = snapB ? nearest(raw.y + raw.h, yTargets) : raw.y + raw.h;
  const rect = {
    x: left,
    y: top,
    w: Math.max(8, right - left),
    h: Math.max(8, bottom - top),
  };

  return {
    rect,
    guides: {
      v: hits([rect.x, rect.x + rect.w / 2, rect.x + rect.w], xTargets),
      h: hits([rect.y, rect.y + rect.h / 2, rect.y + rect.h], yTargets),
    },
  };
}
