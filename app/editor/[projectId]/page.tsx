"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, Redo2, Save, Undo2 } from "lucide-react";
import { loadDraft } from "@/lib/draft";
import { templates } from "@/data/catalog";

const tabs = ["عکس‌ها", "قالب‌ها", "چیدمان", "پس‌زمینه", "متن", "استیکر"];
const pages = ["جلد", "صفحه ۱", "۲–۳", "۴–۵"];

export default function EditorPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const draft = useMemo(() => loadDraft(), []);
  const template = templates.find((t) => t.id === draft.templateId) ?? templates[0];
  const [tab, setTab] = useState(tabs[0]);
  const [page, setPage] = useState(pages[0]);
  const [saved, setSaved] = useState(false);

  return (
    <main className="editor-shell">
      <header className="editor-toolbar">
        <Link href="/create/templates">بازگشت</Link>
        <div className="editor-toolbar-actions">
          <button type="button" aria-label="Undo">
            <Undo2 size={18} />
          </button>
          <button type="button" aria-label="Redo">
            <Redo2 size={18} />
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.setItem(
                `akstory.project.${projectId}`,
                JSON.stringify({
                  projectId,
                  templateId: template.id,
                  page,
                  tab,
                  updatedAt: new Date().toISOString(),
                }),
              );
              setSaved(true);
              setTimeout(() => setSaved(false), 1500);
            }}
          >
            <Save size={18} /> {saved ? "ذخیره شد" : "ذخیره"}
          </button>
          <Link href={`/preview/${projectId}`}>پیش‌نمایش</Link>
          <Link className="primary-button" href={`/preview/${projectId}`}>
            سفارش <ArrowLeft size={16} />
          </Link>
        </div>
      </header>

      <div className="editor-body">
        <aside className="editor-sidebar">
          <div className="editor-tabs">
            {tabs.map((item) => (
              <button key={item} type="button" className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="editor-panel">
            <h3>{tab}</h3>
            <p>
              MVP ادیتور: پنل «{tab}» آماده اتصال به بوم است. قالب فعلی: <b>{template.title}</b>
            </p>
            <p className="page-note">نسخه بعدی: افزودن / جابه‌جایی / تغییر اندازه تصویر با Konva.</p>
          </div>
        </aside>

        <section className="editor-canvas-wrap">
          <div className="editor-canvas" style={{ background: template.color }}>
            <div className="editor-page-card" style={{ background: template.accent }}>
              <span>{page}</span>
              <strong>{template.title}</strong>
              <small>پروژه {projectId}</small>
            </div>
          </div>
        </section>
      </div>

      <nav className="editor-pages">
        {pages.map((item) => (
          <button key={item} type="button" className={page === item ? "active" : ""} onClick={() => setPage(item)}>
            {item}
          </button>
        ))}
      </nav>
    </main>
  );
}
