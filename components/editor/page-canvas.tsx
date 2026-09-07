"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Plus } from "lucide-react";
import { ImageToolbar } from "@/components/editor/image-toolbar";
import { ShapeToolbar } from "@/components/editor/shape-toolbar";
import { TextToolbar } from "@/components/editor/text-toolbar";
import { snapBox, type GuideRect } from "@/lib/align-guides";
import type { BookPage, Decor, PhotoFilter, PhotoSlot, TextBlock } from "@/lib/editor-book";
import type { ProjectPhoto } from "@/lib/photos";

export type FocusTarget = { type: "text" | "slot" | "decor"; id: string };

type Props = {
  page: BookPage;
  photos: ProjectPhoto[];
  selected: boolean;
  focus: FocusTarget | null;
  holding: string | null;
  onSelectPage: () => void;
  onFocus: (focus: FocusTarget | null) => void;
  onChange: (updater: (page: BookPage) => BookPage, history?: string) => void;
  onApplyAll: (text: TextBlock) => void;
  onPlace: (slotId: string, photoId: string) => void;
  onReplace: (slotId: string, files: FileList) => void;
  pickLabel?: string | null;
  onPick?: () => void;
};

type Box = { x: number; y: number; w: number; h?: number };
type DragMode = "move" | "left" | "right" | "top" | "bottom" | "nw" | "ne" | "sw" | "se";

const SIDE_MAP: Record<string, DragMode> = {
  n: "top",
  e: "right",
  s: "bottom",
  w: "left",
  nw: "nw",
  ne: "ne",
  se: "se",
  sw: "sw",
};

function photoById(photos: ProjectPhoto[], id: string | null) {
  return photos.find((item) => item.id === id) ?? null;
}

function isStickerImage(value: string) {
  return value.startsWith("/") || value.startsWith("http") || /\.(png|jpe?g|webp|gif|svg)$/i.test(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function photoFilter(filter: PhotoFilter) {
  if (filter === "grayscale") return "grayscale(1)";
  if (filter === "sepia") return "sepia(.85)";
  if (filter === "warm") return "sepia(.28) saturate(1.25)";
  if (filter === "cool") return "hue-rotate(195deg) saturate(.9)";
  return "none";
}

export function PageCanvas({ page, photos, selected, focus, holding, onSelectPage, onFocus, onChange, onApplyAll, onPlace, onReplace, pickLabel, onPick }: Props) {
  const root = useRef<HTMLElement>(null);
  const suppressClick = useRef(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [guides, setGuides] = useState<{ v: number[]; h: number[] }>({ v: [], h: [] });

  useEffect(() => {
    if (focus?.type !== "text") setEditingId(null);
  }, [focus]);

  useEffect(() => {
    if (!editingId) return;
    const node = root.current?.querySelector(".ed-text.editing .ed-text-edit") as HTMLElement | null;
    node?.focus();
  }, [editingId]);

  function startDrag(
    event: React.PointerEvent,
    current: Box,
    apply: (next: Box) => void,
    mode: DragMode = "move",
    onDone?: (moved: boolean) => void,
    options?: { keepMenu?: boolean; id?: string },
  ) {
    event.preventDefault();
    event.stopPropagation();
    const box = root.current?.getBoundingClientRect();
    if (!box) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const measured = measureRect(current, options?.id);
    const origin = { x: current.x, y: current.y, w: current.w, h: measured.h };
    const hasHeight = current.h != null;
    const siblings = siblingRects(options?.id);
    let moved = false;
    if (mode === "move" && !options?.keepMenu) setDragging(true);

    function commit(next: Box) {
      if (!moved) return;
      const raw = { x: next.x, y: next.y, w: next.w, h: next.h ?? origin.h };
      const { rect, guides: nextGuides } = snapBox(raw, siblings, mode);
      setGuides(nextGuides);
      apply({
        x: rect.x,
        y: rect.y,
        w: rect.w,
        ...(hasHeight ? { h: rect.h } : {}),
      });
    }

    function onMove(next: PointerEvent) {
      const dx = ((next.clientX - startX) / box!.width) * 100;
      const dy = ((next.clientY - startY) / box!.height) * 100;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 0.35) {
        moved = true;
        setDragging(true);
        if (!options?.keepMenu) onFocus(null);
      }

      if (mode === "right") {
        commit({ x: origin.x, y: origin.y, w: clamp(origin.w + dx, 8, 100 - origin.x), h: origin.h });
        return;
      }
      if (mode === "left") {
        const nextX = clamp(origin.x + dx, 0, origin.x + origin.w - 8);
        commit({ x: nextX, y: origin.y, w: clamp(origin.w - (nextX - origin.x), 8, 100), h: origin.h });
        return;
      }
      if (mode === "bottom") {
        commit({ x: origin.x, y: origin.y, w: origin.w, h: clamp(origin.h + dy, 8, 100 - origin.y) });
        return;
      }
      if (mode === "top") {
        const nextY = clamp(origin.y + dy, 0, origin.y + origin.h - 8);
        commit({ x: origin.x, y: nextY, w: origin.w, h: clamp(origin.h - (nextY - origin.y), 8, 100) });
        return;
      }
      if (mode === "se") {
        commit({
          x: origin.x,
          y: origin.y,
          w: clamp(origin.w + dx, 8, 100 - origin.x),
          h: clamp(origin.h + dy, 8, 100 - origin.y),
        });
        return;
      }
      if (mode === "ne") {
        const nextY = clamp(origin.y + dy, 0, origin.y + origin.h - 8);
        commit({
          x: origin.x,
          y: nextY,
          w: clamp(origin.w + dx, 8, 100 - origin.x),
          h: clamp(origin.h - (nextY - origin.y), 8, 100),
        });
        return;
      }
      if (mode === "sw") {
        const nextX = clamp(origin.x + dx, 0, origin.x + origin.w - 8);
        commit({
          x: nextX,
          y: origin.y,
          w: clamp(origin.w - (nextX - origin.x), 8, 100),
          h: clamp(origin.h + dy, 8, 100 - origin.y),
        });
        return;
      }
      if (mode === "nw") {
        const nextX = clamp(origin.x + dx, 0, origin.x + origin.w - 8);
        const nextY = clamp(origin.y + dy, 0, origin.y + origin.h - 8);
        commit({
          x: nextX,
          y: nextY,
          w: clamp(origin.w - (nextX - origin.x), 8, 100),
          h: clamp(origin.h - (nextY - origin.y), 8, 100),
        });
        return;
      }
      commit({
        x: clamp(origin.x + dx, 0, 100 - origin.w),
        y: clamp(origin.y + dy, 0, hasHeight ? 100 - origin.h : 90),
        w: origin.w,
        h: origin.h,
      });
    }

    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setDragging(false);
      setGuides({ v: [], h: [] });
      if (moved) {
        suppressClick.current = true;
        onChange((currentPage) => currentPage, "جابه‌جایی");
      }
      onDone?.(moved);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function patchText(id: string, patch: Partial<TextBlock>, history?: string) {
    onChange((current) => ({
      ...current,
      texts: current.texts.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }), history);
  }

  function patchSlot(id: string, patch: Partial<PhotoSlot>, history?: string) {
    onChange((current) => ({
      ...current,
      slots: current.slots.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }), history);
  }

  function patchDecor(id: string, patch: Partial<Decor>, history?: string) {
    onChange((current) => ({
      ...current,
      decors: current.decors.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }), history);
  }

  function measureRect(current: Box, id?: string): GuideRect {
    if (current.h != null) return { x: current.x, y: current.y, w: current.w, h: current.h };
    const pageBox = root.current?.getBoundingClientRect();
    const node = id ? (root.current?.querySelector(`[data-el="${id}"]`) as HTMLElement | null) : null;
    if (!pageBox || !node) return { x: current.x, y: current.y, w: current.w, h: 8 };
    return { x: current.x, y: current.y, w: current.w, h: (node.getBoundingClientRect().height / pageBox.height) * 100 };
  }

  function siblingRects(skipId?: string): GuideRect[] {
    return [
      ...page.texts.filter((item) => item.id !== skipId).map((item) => measureRect(item, item.id)),
      ...page.slots.filter((item) => item.id !== skipId).map((item) => ({ x: item.x, y: item.y, w: item.w, h: item.h })),
      ...page.decors.filter((item) => item.id !== skipId).map((item) => ({ x: item.x, y: item.y, w: item.w, h: item.h })),
    ];
  }

  function Handles({ id, item, apply, box }: { id: string; item: Box; apply: (next: Box) => void; box?: boolean }) {
    const keys = box ? ["nw", "n", "ne", "e", "se", "s", "sw", "w"] : ["left", "right"];
    return (
      <>
        {keys.map((key) => {
          const mode = box ? SIDE_MAP[key] : (key as DragMode);
          return (
            <i
              key={key}
              data-handle={key}
              className={`ed-handle ${key}`}
              onPointerDown={(event) => startDrag(event, item, apply, mode, undefined, { keepMenu: true, id })}
            />
          );
        })}
      </>
    );
  }

  return (
    <article
      ref={root}
      className={`ed-page ${page.kind}${selected ? " selected" : ""}`}
      style={{ background: page.background }}
      onClick={() => {
        if (pickLabel) {
          onPick?.();
          return;
        }
        if (suppressClick.current) {
          suppressClick.current = false;
          return;
        }
        onSelectPage();
        onFocus(null);
      }}
    >
      {guides.v.map((value) => (
        <i key={`v-${value}`} className="ed-guide v" style={{ left: `${value}%` }} />
      ))}
      {guides.h.map((value) => (
        <i key={`h-${value}`} className="ed-guide h" style={{ top: `${value}%` }} />
      ))}
      {pickLabel ? (
        <button type="button" className="ed-pick" onClick={(event) => { event.stopPropagation(); onPick?.(); }}>
          {pickLabel}
        </button>
      ) : null}
      {page.texts.map((item) => {
        const active = focus?.type === "text" && focus.id === item.id && !dragging;
        const editing = editingId === item.id;
        return (
          <div
            key={item.id}
            data-el={item.id}
            className={`ed-node ed-text${active ? " on" : ""}${editing ? " editing" : ""}`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.w}%`,
              zIndex: item.z + (active ? 40 : 0),
            }}
            onClick={(event) => {
              event.stopPropagation();
              if (suppressClick.current) {
                suppressClick.current = false;
                return;
              }
              onSelectPage();
              onFocus({ type: "text", id: item.id });
            }}
            onPointerDown={(event) => {
              if ((event.target as HTMLElement).closest("[data-handle], .ed-textbar")) return;
              if (editing && (event.target as HTMLElement).closest(".ed-text-edit")) return;
              const already = focus?.type === "text" && focus.id === item.id;
              startDrag(event, item, (next) => patchText(item.id, { x: next.x, y: next.y, w: next.w }), "move", (moved) => {
                if (moved) return;
                onSelectPage();
                onFocus({ type: "text", id: item.id });
                if (already) setEditingId(item.id);
              }, { id: item.id });
            }}
            onDoubleClick={(event) => {
              event.stopPropagation();
              onFocus({ type: "text", id: item.id });
              setEditingId(item.id);
            }}
          >
            <div
              className="ed-text-edit"
              contentEditable={editing}
              suppressContentEditableWarning
              style={{
                color: item.color,
                fontFamily: item.fontFamily,
                fontSize: `${item.fontSize}px`,
                fontWeight: item.bold ? 800 : 500,
                fontStyle: item.italic ? "italic" : "normal",
                textDecoration: item.underline ? "underline" : "none",
                textAlign: item.align,
              }}
              onPointerDown={(event) => {
                if (editing) event.stopPropagation();
              }}
              onBlur={(event) => {
                patchText(item.id, { text: event.currentTarget.textContent ?? "" }, "ویرایش متن");
              }}
            >
              {item.text}
            </div>
            {active ? (
              <>
                <Handles id={item.id} item={item} apply={(next) => patchText(item.id, { x: next.x, y: next.y, w: next.w })} />
                <TextToolbar
                  text={item}
                  onChange={(patch) => patchText(item.id, patch, "قالب‌بندی متن")}
                  onDelete={() => {
                    setEditingId(null);
                    onFocus(null);
                    onChange((current) => ({ ...current, texts: current.texts.filter((text) => text.id !== item.id) }), "حذف متن");
                  }}
                  onApplyAll={() => onApplyAll(item)}
                  onBookmark={() => {
                    sessionStorage.setItem("akstory.textStyle", JSON.stringify({
                      fontFamily: item.fontFamily,
                      fontSize: item.fontSize,
                      color: item.color,
                      bold: item.bold,
                      italic: item.italic,
                      underline: item.underline,
                      align: item.align,
                    }));
                  }}
                />
              </>
            ) : null}
          </div>
        );
      })}

      {page.slots.map((slot) => {
        const photo = photoById(photos, slot.photoId);
        const active = focus?.type === "slot" && focus.id === slot.id && !dragging;
        return (
          <div
            key={slot.id}
            data-el={slot.id}
            className={`ed-node ed-photo${active ? " on" : ""}${slot.border ? " framed" : ""}`}
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              width: `${slot.w}%`,
              height: `${slot.h}%`,
              zIndex: slot.z + (active ? 40 : 0),
              boxShadow: slot.border ? `0 0 0 ${slot.borderWidth || 5}px #fff` : undefined,
              outlineOffset: slot.border ? `${(slot.borderWidth || 5) + 3}px` : undefined,
            }}
            onClick={(event) => {
              event.stopPropagation();
              if (suppressClick.current) {
                suppressClick.current = false;
                return;
              }
              onSelectPage();
              onFocus({ type: "slot", id: slot.id });
              if (holding) onPlace(slot.id, holding);
            }}
            onPointerDown={(event) => {
              if ((event.target as HTMLElement).closest("[data-handle], .ed-textbar")) return;
              startDrag(event, slot, (next) => patchSlot(slot.id, { x: next.x, y: next.y, w: next.w, h: next.h }), "move", (moved) => {
                if (moved) return;
                onSelectPage();
                onFocus({ type: "slot", id: slot.id });
              }, { id: slot.id });
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const id = event.dataTransfer.getData("text/photo-id");
              if (id) onPlace(slot.id, id);
            }}
          >
            <div className="ed-photo-clip" style={{ opacity: slot.opacity / 100 }}>
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo.dataUrl}
                  alt=""
                  style={{
                    transform: `translate(-50%,-50%) scale(${slot.zoom / 100}) rotate(${slot.rotate}deg) scaleX(${slot.flipX ? -1 : 1})`,
                    filter: photoFilter(slot.filter),
                  }}
                />
              ) : slot.w * slot.h < 900 ? (
                <span className="plus">
                  <Plus size={18} />
                </span>
              ) : (
                <span>
                  <ImagePlus size={20} />
                  اینجا بکش
                </span>
              )}
            </div>
            {active ? (
              <>
                <Handles id={slot.id} box item={slot} apply={(next) => patchSlot(slot.id, { x: next.x, y: next.y, w: next.w, h: next.h })} />
                <ImageToolbar
                  slot={slot}
                  onChange={(patch) => patchSlot(slot.id, patch, "ویرایش عکس")}
                  onReplace={(files) => onReplace(slot.id, files)}
                  onDelete={() => {
                    onFocus(null);
                    onChange((current) => ({ ...current, slots: current.slots.filter((item) => item.id !== slot.id) }), "حذف عکس");
                  }}
                />
              </>
            ) : null}
          </div>
        );
      })}

      {page.decors.map((item) => {
        const active = focus?.type === "decor" && focus.id === item.id && !dragging;
        const radius = item.kind === "ellipse" ? "50%" : `${item.radius}px`;
        const stroke = item.stroke === "none" ? "none" : `1.5px ${item.stroke} #fff`;
        return (
          <div
            key={item.id}
            data-el={item.id}
            className={`ed-node ed-shape ${item.kind}${active ? " on" : ""}`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.w}%`,
              height: `${item.h}%`,
              zIndex: item.z + (active ? 40 : 0),
            }}
            onClick={(event) => {
              event.stopPropagation();
              if (suppressClick.current) {
                suppressClick.current = false;
                return;
              }
              onSelectPage();
              onFocus({ type: "decor", id: item.id });
            }}
            onPointerDown={(event) => {
              if ((event.target as HTMLElement).closest("[data-handle], .ed-textbar")) return;
              startDrag(event, item, (next) => patchDecor(item.id, { x: next.x, y: next.y, w: next.w, h: next.h }), "move", (moved) => {
                if (moved) return;
                onSelectPage();
                onFocus({ type: "decor", id: item.id });
              }, { id: item.id });
            }}
          >
            <div
              className="ed-shape-face"
              style={{
                background: item.kind === "sticker" ? "transparent" : item.fill,
                opacity: item.opacity / 100,
                border: item.kind === "sticker" ? 0 : stroke,
                borderRadius: radius,
              }}
            >
              {item.kind === "sticker" ? (
                isStickerImage(item.value) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.value} alt="" />
                ) : (
                  item.value
                )
              ) : null}
            </div>
            {active ? (
              <>
                <Handles id={item.id} box item={item} apply={(next) => patchDecor(item.id, { x: next.x, y: next.y, w: next.w, h: next.h })} />
                <ShapeToolbar
                  shape={item}
                  onChange={(patch) => patchDecor(item.id, patch, "ویرایش شکل")}
                  onDelete={() => {
                    onFocus(null);
                    onChange((current) => ({ ...current, decors: current.decors.filter((decor) => decor.id !== item.id) }), "حذف شکل");
                  }}
                />
              </>
            ) : null}
          </div>
        );
      })}
    </article>
  );
}
