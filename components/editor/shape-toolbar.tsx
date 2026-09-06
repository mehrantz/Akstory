"use client";

import { useEffect, useRef, useState } from "react";
import { Layers, SquareDashed, Trash2 } from "lucide-react";
import type { Decor, ShapeStroke } from "@/lib/editor-book";

const COLORS = ["#7db8b4", "#ffffff", "#111111", "#c45c48", "#e8c978", "#174b87", "#d9a7a1", "#2c2c2c"];
const STROKES: { id: ShapeStroke; label: string }[] = [
  { id: "none", label: "بدون حاشیه" },
  { id: "solid", label: "خط ساده" },
  { id: "dashed", label: "خط‌چین" },
];

type Props = {
  shape: Decor;
  onChange: (patch: Partial<Decor>) => void;
  onDelete: () => void;
};

export function ShapeToolbar({ shape, onChange, onDelete }: Props) {
  const [open, setOpen] = useState<"color" | "stroke" | "layer" | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(null);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className={`ed-textbar ed-mediabar${shape.y > 62 ? " above" : ""}`} ref={root} onPointerDown={(event) => event.stopPropagation()}>
      <div className="ed-tb-group">
        <button type="button" className="ed-tb-color" onClick={() => setOpen(open === "color" ? null : "color")} aria-label="رنگ شکل">
          <i style={{ background: shape.fill }} />
        </button>
        {open === "color" ? (
          <div className="ed-tb-menu colors">
            {COLORS.map((color) => (
              <button key={color} type="button" className="swatch" style={{ background: color }} onClick={() => { onChange({ fill: color }); setOpen(null); }} />
            ))}
            <label className="ed-tb-hex">
              دلخواه
              <input type="color" value={shape.fill} onChange={(event) => onChange({ fill: event.target.value })} />
            </label>
          </div>
        ) : null}
      </div>

      <span className="ed-tb-check" aria-hidden="true" />
      <div className="ed-tb-step">
        <button type="button" onClick={() => onChange({ opacity: Math.max(10, shape.opacity - 10) })}>−</button>
        <span>{shape.opacity}٪</span>
        <button type="button" onClick={() => onChange({ opacity: Math.min(100, shape.opacity + 10) })}>+</button>
      </div>

      <div className="ed-tb-group">
        <button type="button" onClick={() => setOpen(open === "stroke" ? null : "stroke")} aria-label="حاشیه">
          <SquareDashed size={15} />
        </button>
        {open === "stroke" ? (
          <div className="ed-tb-menu">
            {STROKES.map((item) => (
              <button key={item.id} type="button" className={shape.stroke === item.id ? "on" : ""} onClick={() => { onChange({ stroke: item.id }); setOpen(null); }}>
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {shape.kind !== "ellipse" ? (
        <>
          <button type="button" className="ed-tb-radius" onClick={() => onChange({ radius: shape.radius ? 0 : 12 })} aria-label="گردی گوشه">
            <i />
          </button>
          <div className="ed-tb-step">
            <button type="button" onClick={() => onChange({ radius: Math.max(0, shape.radius - 2) })}>−</button>
            <span>{shape.radius}</span>
            <button type="button" onClick={() => onChange({ radius: Math.min(40, shape.radius + 2) })}>+</button>
          </div>
        </>
      ) : null}

      <div className="ed-tb-group">
        <button type="button" onClick={() => setOpen(open === "layer" ? null : "layer")} aria-label="لایه">
          <Layers size={15} />
        </button>
        {open === "layer" ? (
          <div className="ed-tb-menu">
            <button type="button" onClick={() => { onChange({ z: shape.z + 10 }); setOpen(null); }}>بیاور جلو</button>
            <button type="button" onClick={() => { onChange({ z: Math.max(1, shape.z - 10) }); setOpen(null); }}>ببر عقب</button>
          </div>
        ) : null}
      </div>

      <button type="button" onClick={onDelete} aria-label="حذف">
        <Trash2 size={15} />
      </button>
    </div>
  );
}
