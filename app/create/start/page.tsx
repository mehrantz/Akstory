"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Sparkles } from "lucide-react";
import { createProjectId, loadDraft, saveDraft } from "@/lib/draft";
import { saveBookProject } from "@/lib/editor-book";
import { filesToPhotos, savePhotos, type ProjectPhoto } from "@/lib/photos";
import { buildSmartBook, SMART_STEPS, type SmartProgress, type SmartSelectionReport } from "@/lib/smart-creation";

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

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function CreateStartPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<ProjectPhoto[]>([]);
  const [phase, setPhase] = useState<"idle" | "ready" | "building">("idle");
  const [progress, setProgress] = useState<SmartProgress>(0);
  const [report, setReport] = useState<SmartSelectionReport | null>(null);
  const draft = useMemo(() => loadDraft(), []);
  const backHref = draft.templateId ? `/shop/${draft.templateId}` : "/create/templates";

  function goToEditor(mode: "smart" | "manual", photoCount = 0) {
    const projectId = ensureProjectId();
    saveDraft({ createMode: mode, projectId, photoCount });
    router.push(`/editor/${projectId}`);
  }

  async function handleFiles(fileList: FileList | File[] | null) {
    if (!fileList || fileList.length === 0 || busy || phase === "building") return;
    setBusy(true);
    setError("");
    try {
      const incoming = await filesToPhotos(fileList);
      if (incoming.length === 0) {
        setError("یک تصویر معتبر انتخاب کن.");
        return;
      }
      const projectId = ensureProjectId();
      const next = [...photos, ...incoming];
      setPhotos(next);
      savePhotos(projectId, next);
      saveDraft({ createMode: "smart", projectId, photoCount: next.length });
      setPhase("ready");
    } catch {
      setError("بارگذاری عکس‌ها ممکن نشد. دوباره امتحان کن.");
    } finally {
      setBusy(false);
    }
  }

  async function startSmartBuild() {
    if (photos.length === 0 || phase === "building") return;
    setPhase("building");
    setProgress(0);
    setReport(null);
    setError("");
    const projectId = ensureProjectId();
    saveDraft({ createMode: "smart", projectId, photoCount: photos.length });
    const started = Date.now();
    try {
      const result = await buildSmartBook({
        projectId,
        templateId: draft.templateId,
        photos,
        onProgress: (step) => setProgress(step),
      });
      const elapsed = Date.now() - started;
      if (elapsed < 1800) await wait(1800 - elapsed);
      setProgress(4);
      setReport(result.report);
      saveBookProject(result.project);
      savePhotos(projectId, result.kept);
      saveDraft({ photoCount: result.kept.length });
      await wait(900);
      router.push(`/editor/${projectId}`);
    } catch {
      setPhase("ready");
      setError("ساخت هوشمند ممکن نشد. دوباره امتحان کن.");
    }
  }

  const percent = Math.min(100, (progress / SMART_STEPS.length) * 100);

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

      {phase === "building" ? (
        <section className="smart-build" aria-live="polite">
          <h1>در حال ساخت عکستوری شما...</h1>
          <div className="smart-build-bar" aria-hidden="true">
            <i style={{ width: `${percent}%` }} />
          </div>
          <ol className="smart-steps">
            {SMART_STEPS.map((label, index) => {
              const done = progress > index;
              const current = progress === index;
              return (
                <li key={label} className={done ? "done" : current ? "current" : ""}>
                  <span>{done ? "✓" : current ? "●" : "○"}</span>
                  {label}
                </li>
              );
            })}
          </ol>
          {report ? (
            <ul className="smart-report">
              <li>{report.reviewed.toLocaleString("fa-IR")} عکس بررسی شد</li>
              <li>{report.similar.toLocaleString("fa-IR")} عکس مشابه کنار گذاشته شد</li>
              <li>{report.selected.toLocaleString("fa-IR")} عکس برای کتاب انتخاب شد</li>
            </ul>
          ) : null}
        </section>
      ) : (
        <section className="mode-split">
          <article className="mode-col smart">
            <h1>فتوبوک هوشمند</h1>
            <p>عکس‌هایت را اضافه کن تا به صورت خودکار بهترین لحظه‌ها انتخاب شوند و یک عکستوری اولیه ساخته شود.</p>
            {phase === "idle" ? <SmartArt /> : null}
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
            {phase === "ready" ? (
              <div className="smart-ready">
                <strong>عکس‌های شما آماده است 🎉</strong>
                <p>
                  تعداد عکس‌ها:
                  <b> {photos.length.toLocaleString("fa-IR")} عدد</b>
                </p>
                <p>با ساخت هوشمند، ما یک نسخه اولیه از کتاب شما می‌سازیم.</p>
                <button className="mode-add smart-run" type="button" onClick={startSmartBuild}>
                  <Sparkles size={16} />
                  ساخت هوشمند عکستوری
                </button>
              </div>
            ) : null}
            <button className="mode-add" type="button" disabled={busy} onClick={() => inputRef.current?.click()}>
              <Plus size={18} />
              {busy ? "در حال آماده‌سازی…" : phase === "ready" ? "افزودن عکس بیشتر" : "افزودن عکس‌ها"}
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
      )}
    </main>
  );
}
