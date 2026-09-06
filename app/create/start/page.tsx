"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { createProjectId, loadDraft, saveDraft } from "@/lib/draft";
import { filesToPhotos, savePhotos } from "@/lib/photos";

function ensureProjectId() {
  const existing = loadDraft().projectId;
  if (existing) return existing;
  const projectId = createProjectId();
  saveDraft({ projectId });
  return projectId;
}

function SmartArt() {
  return (
    <svg className="mode-art" viewBox="0 0 220 140" fill="none" aria-hidden="true">
      <rect x="38" y="28" width="118" height="86" rx="6" stroke="#c8c4bf" strokeWidth="1.6" />
      <rect x="50" y="40" width="42" height="28" rx="3" stroke="#d2cec8" />
      <rect x="100" y="40" width="42" height="28" rx="3" stroke="#d2cec8" />
      <rect x="50" y="76" width="42" height="24" rx="3" stroke="#d2cec8" />
      <rect x="100" y="76" width="42" height="24" rx="3" stroke="#d2cec8" />
      <path d="M148 86c18 4 36 18 40 38" stroke="#bdb8b2" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M164 108c8 2 14 8 16 16" stroke="#bdb8b2" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="186" cy="72" r="16" stroke="#b7b2ac" strokeWidth="1.6" />
      <path d="M186 64v9l6 4" stroke="#b7b2ac" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ManualArt() {
  return (
    <svg className="mode-art compact" viewBox="0 0 200 120" fill="none" aria-hidden="true">
      <path d="M42 28h52c8 0 14 6 14 14v56H56c-8 0-14-6-14-14V28z" stroke="#c8c4bf" strokeWidth="1.6" />
      <path d="M108 28h50c8 0 14 6 14 14v56h-52c-8 0-14-6-14-14V28z" stroke="#c8c4bf" strokeWidth="1.6" />
      <path d="M108 30v66" stroke="#d5d0ca" />
      <path d="M150 86c12 6 22 16 26 28" stroke="#bdb8b2" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M158 102c8 3 12 10 14 16" stroke="#bdb8b2" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function CreateStartPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const draft = useMemo(() => loadDraft(), []);
  const backHref = draft.templateId ? `/shop/${draft.templateId}` : "/create/templates";

  function goToEditor(mode: "smart" | "manual", photoCount = 0) {
    const projectId = ensureProjectId();
    saveDraft({ createMode: mode, projectId, photoCount });
    router.push(`/editor/${projectId}`);
  }

  async function handleFiles(fileList: FileList | File[] | null) {
    if (!fileList || fileList.length === 0 || busy) return;
    setBusy(true);
    setError("");
    try {
      const photos = await filesToPhotos(fileList);
      if (photos.length === 0) {
        setError("یک تصویر معتبر انتخاب کن.");
        setBusy(false);
        return;
      }
      const projectId = ensureProjectId();
      savePhotos(projectId, photos);
      goToEditor("smart", photos.length);
    } catch {
      setError("بارگذاری عکس‌ها ممکن نشد. دوباره امتحان کن.");
      setBusy(false);
    }
  }

  return (
    <main className="mode-page">
      <div className="mode-deco deco-tr" aria-hidden="true" />
      <div className="mode-deco deco-bl" aria-hidden="true" />

      <header className="mode-header">
        <Link className="mode-back" href={backHref}>
          <ChevronRight size={18} />
          بازگشت
        </Link>
        <Link className="brand" href="/" aria-label="عکستوری، صفحه اصلی">
          <strong>akstory</strong>
        </Link>
      </header>

      <section className="mode-split">
        <article className="mode-col smart">
          <h1>فتوبوک هوشمند</h1>
          <p>
            عکس‌هایت را بارگذاری کن تا چیدمان کتاب سریع ساخته شود. بهترین شات‌ها انتخاب می‌شوند، تکراری‌ها و
            عکس‌های ضعیف کنار می‌روند و همه به ترتیب زمان مرتب می‌شوند — بدون اینکه خودت صفحه‌ها را بچینی.
          </p>
          <SmartArt />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(event) => {
              handleFiles(event.target.files);
              event.target.value = "";
            }}
          />
          <button className="mode-add" type="button" disabled={busy} onClick={() => inputRef.current?.click()}>
            <Plus size={18} />
            {busy ? "در حال آماده‌سازی…" : "افزودن عکس‌ها"}
          </button>
          <div
            className={dragOver ? "mode-drop active" : "mode-drop"}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragOver(false);
              handleFiles(event.dataTransfer.files);
            }}
          >
            یا عکس‌ها را اینجا بکش و رها کن
          </div>
          {error ? <small className="mode-error">{error}</small> : null}
        </article>

        <article className="mode-col manual">
          <h2>فتوبوک دستی</h2>
          <p>کنترل کامل فرآیند ساخت را خودت به دست بگیر.</p>
          <ManualArt />
          <button className="mode-editor" type="button" onClick={() => goToEditor("manual")}>
            ورود به ادیتور
            <ChevronLeft size={16} />
          </button>
        </article>
      </section>
    </main>
  );
}
