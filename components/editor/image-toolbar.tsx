"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  BringToFront,
  ImagePlus,
  Layers,
  Maximize2,
  RotateCcw,
  RotateCw,
  Square,
  Trash2,
  WandSparkles,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { PhotoFilter, PhotoSlot } from "@/lib/editor-book";

type Props = {
  slot: PhotoSlot;
  onChange: (patch: Partial<PhotoSlot>) => void;
  onReplace: (files: FileList) => void;
  onDelete: () => void;
};

const FILTERS: { id: PhotoFilter; label: string }[] = [
  { id: "none", label: "بدون افکت" },
  { id: "grayscale", label: "سیاه‌وسفید" },
  { id: "sepia", label: "سپیا" },
  { id: "warm", label: "گرم" },
  { id: "cool", label: "سرد" },
];

export function ImageToolbar({ slot, onChange, onReplace, onDelete }: Props) {
  const [open, setOpen] = useState<"order" | "opacity" | "filter" | "layer" | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(null);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className={`ed-textbar ed-mediabar${slot.y > 62 ? " above" : ""}`} ref={root} onPointerDown={(event) => event.stopPropagation()}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          if (event.target.files?.length) onReplace(event.target.files);
          event.target.value = "";
        }}
      />
      <button type="button" onClick={() => fileRef.current?.click()} aria-label="تعویض عکس">
        <ImagePlus size={15} />
      </button>

      <div className="ed-tb-group">
        <button type="button" onClick={() => setOpen(open === "order" ? null : "order")} aria-label="ترتیب">
          <BringToFront size={15} />
        </button>
        {open === "order" ? (
          <div className="ed-tb-menu">
            <button type="button" onClick={() => { onChange({ z: slot.z + 10 }); setOpen(null); }}>بیاور جلو</button>
            <button type="button" onClick={() => { onChange({ z: Math.max(1, slot.z - 10) }); setOpen(null); }}>ببر عقب</button>
          </div>
        ) : null}
      </div>

      <button type="button" onClick={() => onChange({ zoom: Math.min(260, slot.zoom + 10) })} aria-label="بزرگ‌نمایی">
        <ZoomIn size={15} />
      </button>
      <button type="button" onClick={() => onChange({ zoom: Math.max(40, slot.zoom - 10) })} aria-label="کوچک‌نمایی">
        <ZoomOut size={15} />
      </button>
      <button type="button" onClick={() => onChange({ zoom: 100, rotate: 0, flipX: false })} aria-label="جا دادن در کادر">
        <Maximize2 size={15} />
      </button>
      <button type="button" onClick={() => onChange({ rotate: (slot.rotate - 90 + 360) % 360 })} aria-label="چرخش چپ">
        <RotateCcw size={15} />
      </button>
      <button type="button" onClick={() => onChange({ rotate: (slot.rotate + 90) % 360 })} aria-label="چرخش راست">
        <RotateCw size={15} />
      </button>
      <button type="button" className={slot.flipX ? "on" : ""} onClick={() => onChange({ flipX: !slot.flipX })} aria-label="قرینه افقی">
        <ArrowLeftRight size={15} />
      </button>

      <div className="ed-tb-group">
        <button type="button" className="ed-tb-check" onClick={() => setOpen(open === "opacity" ? null : "opacity")} aria-label="شفافیت" />
        {open === "opacity" ? (
          <div className="ed-tb-menu">
            <div className="ed-tb-step">
              <button type="button" onClick={() => onChange({ opacity: Math.max(10, slot.opacity - 10) })}>−</button>
              <span>{slot.opacity}٪</span>
              <button type="button" onClick={() => onChange({ opacity: Math.min(100, slot.opacity + 10) })}>+</button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="ed-tb-step">
        <button type="button" onClick={() => onChange({ zoom: Math.max(40, slot.zoom - 10) })}>−</button>
        <span>{slot.zoom}٪</span>
        <button type="button" onClick={() => onChange({ zoom: Math.min(260, slot.zoom + 10) })}>+</button>
      </div>

      <button type="button" className={slot.border ? "on" : ""} onClick={() => onChange({ border: !slot.border })} aria-label="حاشیه">
        <Square size={15} />
      </button>

      <div className="ed-tb-group">
        <button type="button" onClick={() => setOpen(open === "filter" ? null : "filter")} aria-label="افکت">
          <WandSparkles size={15} />
        </button>
        {open === "filter" ? (
          <div className="ed-tb-menu">
            {FILTERS.map((item) => (
              <button key={item.id} type="button" className={slot.filter === item.id ? "on" : ""} onClick={() => { onChange({ filter: item.id }); setOpen(null); }}>
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="ed-tb-group">
        <button type="button" onClick={() => setOpen(open === "layer" ? null : "layer")} aria-label="لایه">
          <Layers size={15} />
        </button>
        {open === "layer" ? (
          <div className="ed-tb-menu">
            <button type="button" onClick={() => { onChange({ z: slot.z + 20 }); setOpen(null); }}>بالاترین لایه</button>
            <button type="button" onClick={() => { onChange({ z: Math.max(1, slot.z - 20) }); setOpen(null); }}>پایین‌ترین لایه</button>
          </div>
        ) : null}
      </div>

      <button type="button" onClick={onDelete} aria-label="حذف">
        <Trash2 size={15} />
      </button>
    </div>
  );
}
