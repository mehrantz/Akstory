"use client";

import { Copy, FilePlus, LayoutGrid, Plus, RectangleHorizontal, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import type { BookPage, Spread } from "@/lib/editor-book";
import type { ProjectPhoto } from "@/lib/photos";

type Props = {
  spreads: Spread[];
  spreadIndex: number;
  pageView: "spread" | "one";
  zoom: number;
  photos: ProjectPhoto[];
  onView: (view: "spread" | "one") => void;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onZoom: (zoom: number) => void;
  onAdd: () => void;
  onInsert: (at: number) => void;
  onDuplicate: () => void;
  onRemove: () => void;
};

function caption(spread: Spread, index: number) {
  if (index === 0 || spread.pages[0].kind === "cover-front") return "جلد";
  return `صفحه ${spread.label}`;
}

function MiniPage({ page, photos }: { page: BookPage; photos: ProjectPhoto[] }) {
  return (
    <span className="ed-thumb-page" style={{ background: page.background }}>
      {page.slots.map((slot) => {
        const photo = photos.find((item) => item.id === slot.photoId);
        return (
          <em key={slot.id} style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${slot.w}%`, height: `${slot.h}%` }}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo.dataUrl} alt="" />
            ) : null}
          </em>
        );
      })}
    </span>
  );
}

export function PageTray({
  spreads,
  spreadIndex,
  pageView,
  zoom,
  photos,
  onView,
  onSelect,
  onPrev,
  onNext,
  onZoom,
  onAdd,
  onInsert,
  onDuplicate,
  onRemove,
}: Props) {
  const current = spreads[spreadIndex];

  return (
    <div className="ed-tray">
      <div className="ed-tray-top">
        <div className="ed-tray-views">
          <button type="button" className={pageView === "one" ? "on" : ""} onClick={() => onView("one")}>
            <RectangleHorizontal size={14} />
            یک صفحه
          </button>
          <button type="button" className={pageView === "spread" ? "on" : ""} onClick={() => onView("spread")}>
            <LayoutGrid size={14} />
            همه صفحات
          </button>
        </div>
        <div className="ed-tray-nav">
          <button type="button" disabled={spreadIndex <= 0} onClick={onPrev}>
            صفحه قبل
          </button>
          <b>{current ? caption(current, spreadIndex) : "جلد"}</b>
          <button type="button" disabled={spreadIndex >= spreads.length - 1} onClick={onNext}>
            صفحه بعد
          </button>
        </div>
        <div className="ed-tray-zoom">
          <button type="button" aria-label="کوچک‌نمایی" onClick={() => onZoom(Math.max(30, zoom - 10))}>
            <ZoomOut size={15} />
          </button>
          <input
            type="number"
            min={30}
            max={160}
            value={zoom}
            onChange={(event) => onZoom(Math.min(160, Math.max(30, Number(event.target.value) || 50)))}
            aria-label="بزرگ‌نمایی"
          />
          <span>٪</span>
          <button type="button" aria-label="بزرگ‌نمایی" onClick={() => onZoom(Math.min(160, zoom + 10))}>
            <ZoomIn size={15} />
          </button>
        </div>
      </div>

      <div className="ed-tray-body">
        <div className="ed-tray-scroll">
          {spreads.map((item, index) => (
            <div key={item.id} className="ed-tray-pair">
              <button
                type="button"
                className={`ed-tray-item${index === spreadIndex ? " on" : ""}`}
                onClick={() => onSelect(index)}
              >
                <span className="ed-thumb-card">
                  <MiniPage page={item.pages[0]} photos={photos} />
                  <i className="ed-thumb-gutter" />
                  <MiniPage page={item.pages[1]} photos={photos} />
                </span>
                <small>{caption(item, index)}</small>
              </button>
              <div className="ed-tray-insert">
                <i />
                <button type="button" aria-label="افزودن صفحه بین صفحات" onClick={() => onInsert(index + 1)}>
                  <Plus size={13} />
                </button>
                <span className="ed-tray-tip">یک صفحه خالی بین این دو صفحه به پروژه اضافه می‌شود.</span>
              </div>
            </div>
          ))}
          <button type="button" className="ed-tray-item add" onClick={onAdd}>
            <span className="ed-thumb-card empty">
              <Plus size={22} />
            </span>
            <small>افزودن صفحه</small>
          </button>
        </div>

        <div className="ed-tray-actions">
          <button type="button" className="primary" onClick={onAdd}>
            <FilePlus size={15} />
            افزودن صفحات
          </button>
          <button type="button" onClick={onDuplicate}>
            <Copy size={15} />
            تکثیر
          </button>
          <button type="button" onClick={onRemove} disabled={spreads.length <= 1}>
            <Trash2 size={15} />
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}
