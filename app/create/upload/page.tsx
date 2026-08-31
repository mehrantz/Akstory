"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, ImagePlus, Trash2 } from "lucide-react";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { saveDraft } from "@/lib/draft";

type LocalPhoto = { id: string; url: string; name: string };

export default function UploadPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    const next: LocalPhoto[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      next.push({ id: `${file.name}-${file.size}-${file.lastModified}`, url: URL.createObjectURL(file), name: file.name });
    });
    setPhotos((prev) => [...prev, ...next]);
  }, []);

  const countLabel = useMemo(() => `${photos.length.toLocaleString("fa-IR")} عکس`, [photos.length]);

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  function movePhoto(index: number, dir: -1 | 1) {
    setPhotos((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function continueToTemplates() {
    saveDraft({ photoCount: photos.length });
    router.push("/create/templates");
  }

  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <section className="page-shell">
        <div className="page-kicker">گام بارگذاری</div>
        <h1>عکس‌های خاطره‌ات را اینجا اضافه کن</h1>
        <p className="page-lead">کشیدن و رها کردن، یا انتخاب از گالری. بعداً ترتیب را تنظیم می‌کنی.</p>

        <label
          className={`upload-dropzone ${dragOver ? "active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
        >
          <ImagePlus size={36} />
          <strong>عکس‌ها را اینجا رها کن</strong>
          <span>JPG، PNG یا HEIC — می‌توانی چند فایل با هم انتخاب کنی</span>
          <input type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
        </label>

        <div className="upload-meta">
          <b>{countLabel}</b>
          <Link href="/create">بازگشت به انتخاب موضوع</Link>
        </div>

        {photos.length > 0 && (
          <div className="upload-grid">
            {photos.map((photo, index) => (
              <figure key={photo.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.name} />
                <figcaption>
                  <button type="button" onClick={() => movePhoto(index, -1)} disabled={index === 0}>
                    ↑
                  </button>
                  <button type="button" onClick={() => movePhoto(index, 1)} disabled={index === photos.length - 1}>
                    ↓
                  </button>
                  <button type="button" onClick={() => removePhoto(photo.id)} aria-label="حذف">
                    <Trash2 size={16} />
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="wizard-actions">
          <button type="button" className="primary-button" disabled={photos.length === 0} onClick={continueToTemplates}>
            ادامه به انتخاب قالب <ArrowLeft size={18} />
          </button>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
