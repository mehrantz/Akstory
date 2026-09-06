"use client";

import type { Spread } from "@/lib/editor-book";
import type { ProjectPhoto } from "@/lib/photos";

function isStickerImage(value: string) {
  return value.startsWith("/") || value.startsWith("http") || /\.(png|jpe?g|webp|gif|svg)$/i.test(value);
}

export function TemplateCoverPreview({ spread, photos }: { spread: Spread; photos: ProjectPhoto[] }) {
  return (
    <div className="ed-tpl-preview">
      {spread.pages.map((page) => (
        <div key={page.id} className="ed-tpl-page" style={{ background: page.background }}>
          {page.slots.map((slot) => {
            const photo = photos.find((item) => item.id === slot.photoId);
            if (!photo) return null;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={slot.id}
                src={photo.dataUrl}
                alt=""
                style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${slot.w}%`, height: `${slot.h}%` }}
              />
            );
          })}
          {page.decors.map((decor) =>
            decor.kind === "sticker" && isStickerImage(decor.value) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={decor.id}
                src={decor.value}
                alt=""
                style={{ left: `${decor.x}%`, top: `${decor.y}%`, width: `${decor.w}%`, height: `${decor.h}%` }}
              />
            ) : null,
          )}
          {page.texts.slice(0, 3).map((text) => (
            <span
              key={text.id}
              style={{
                left: `${text.x}%`,
                top: `${text.y}%`,
                width: `${text.w}%`,
                color: text.color,
                fontSize: `${Math.max(8, text.fontSize * 0.22)}px`,
                fontWeight: text.bold ? 800 : 500,
                textAlign: text.align,
              }}
            >
              {text.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
