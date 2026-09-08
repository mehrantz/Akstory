"use client";

import { useEffect, useRef, useState } from "react";
import { AlignCenter, Bookmark, ChevronDown, Layers, Trash2, Underline } from "lucide-react";
import { TEXT_FONTS, TEXT_SIZES, type TextAlign, type TextBlock } from "@/lib/editor-book";

const COLORS = ["#ffffff", "#111111", "#f6f3ee", "#c45c48", "#7db8b4", "#e8c978", "#174b87"];

type Props = {
  text: TextBlock;
  onChange: (patch: Partial<TextBlock>) => void;
  onDelete: () => void;
  onApplyAll: () => void;
  onBookmark: () => void;
};

export function TextToolbar({ text, onChange, onDelete, onApplyAll, onBookmark }: Props) {
  const [open, setOpen] = useState<"font" | "size" | "color" | "style" | "align" | "layer" | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(null);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const fontLabel = TEXT_FONTS.find((item) => item.id === text.fontFamily)?.label ?? "پیدا";

  return (
    <div className={`ed-textbar${text.y > 68 ? " above" : ""}`} ref={root} onPointerDown={(event) => event.stopPropagation()}>
      <div className="ed-tb-group">
        <button type="button" className="ed-tb-wide" onClick={() => setOpen(open === "font" ? null : "font")}>
          <span>{fontLabel}</span>
          <ChevronDown size={12} />
        </button>
        {open === "font" ? (
          <div className="ed-tb-menu">
            {TEXT_FONTS.map((item) => (
              <button key={item.id} type="button" onClick={() => { onChange({ fontFamily: item.id }); setOpen(null); }}>
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="ed-tb-group">
        <div className="ed-tb-size">
          <input
            type="number"
            min={8}
            max={220}
            step={0.1}
            value={text.fontSize}
            onChange={(event) => onChange({ fontSize: Number(event.target.value) || 12 })}
            aria-label="اندازه قلم"
          />
          <button type="button" onClick={() => setOpen(open === "size" ? null : "size")} aria-label="اندازه‌های آماده">
            <ChevronDown size={12} />
          </button>
        </div>
        {open === "size" ? (
          <div className="ed-tb-menu">
            {TEXT_SIZES.map((size) => (
              <button key={size} type="button" className={text.fontSize === size ? "on" : ""} onClick={() => { onChange({ fontSize: size }); setOpen(null); }}>
                {size}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="ed-tb-group">
        <button type="button" className="ed-tb-color" onClick={() => setOpen(open === "color" ? null : "color")} aria-label="رنگ متن">
          <i style={{ background: text.color }} />
        </button>
        {open === "color" ? (
          <div className="ed-tb-menu colors">
            {COLORS.map((color) => (
              <button key={color} type="button" className="swatch" style={{ background: color }} onClick={() => { onChange({ color }); setOpen(null); }} />
            ))}
            <label className="ed-tb-hex">
              دلخواه
              <input type="color" value={text.color} onChange={(event) => onChange({ color: event.target.value })} />
            </label>
          </div>
        ) : null}
      </div>

      <div className="ed-tb-group">
        <button type="button" onClick={() => setOpen(open === "style" ? null : "style")} aria-label="سبک متن">
          <Underline size={15} />
          <ChevronDown size={11} />
        </button>
        {open === "style" ? (
          <div className="ed-tb-menu">
            <button type="button" className={text.bold ? "on" : ""} onClick={() => onChange({ bold: !text.bold })}>
              پررنگ
            </button>
            <button type="button" className={text.italic ? "on" : ""} onClick={() => onChange({ italic: !text.italic })}>
              ایتالیک
            </button>
            <button type="button" className={text.underline ? "on" : ""} onClick={() => onChange({ underline: !text.underline })}>
              زیرخط
            </button>
          </div>
        ) : null}
      </div>

      <div className="ed-tb-group">
        <button type="button" onClick={() => setOpen(open === "align" ? null : "align")} aria-label="چینش">
          <AlignCenter size={15} />
          <ChevronDown size={11} />
        </button>
        {open === "align" ? (
          <div className="ed-tb-menu">
            {([
              ["right", "راست"],
              ["center", "وسط"],
              ["left", "چپ"],
              ["justify", "تراز"],
            ] as [TextAlign, string][]).map(([id, label]) => (
              <button key={id} type="button" className={text.align === id ? "on" : ""} onClick={() => { onChange({ align: id }); setOpen(null); }}>
                {label}
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
            <button type="button" onClick={() => { onChange({ z: text.z + 10 }); setOpen(null); }}>
              بیاور جلو
            </button>
            <button type="button" onClick={() => { onChange({ z: Math.max(1, text.z - 10) }); setOpen(null); }}>
              ببر عقب
            </button>
          </div>
        ) : null}
      </div>

      <button type="button" onClick={onDelete} aria-label="حذف">
        <Trash2 size={15} />
      </button>
      <button type="button" onClick={onBookmark} aria-label="ذخیره سبک">
        <Bookmark size={15} />
      </button>
      <button type="button" className="ed-tb-apply" onClick={onApplyAll}>
        اعمال روی همه
      </button>
    </div>
  );
}
