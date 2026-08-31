"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { templates } from "@/data/catalog";
import { createProjectId, saveDraft } from "@/lib/draft";

const categories = ["همه", "سفر", "داستان ما", "کودک", "خانواده"];

export default function TemplatesPage() {
  const router = useRouter();
  const [category, setCategory] = useState("همه");
  const visible = useMemo(
    () => (category === "همه" ? templates : templates.filter((t) => t.category === category)),
    [category],
  );

  function useTemplate(templateId: string) {
    const projectId = createProjectId();
    saveDraft({ templateId, projectId });
    router.push(`/editor/${projectId}`);
  }

  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <section className="page-shell">
        <div className="page-kicker">قالب‌ها</div>
        <h1>قالب داستان تصویری‌ات را انتخاب کن</h1>
        <p className="page-lead">هر قالب یک شروع ویرایشی است؛ بعداً در ادیتور همه چیز قابل تغییر است.</p>

        <div className="templates-toolbar page-toolbar">
          <h3>دسته‌بندی</h3>
          <div>
            {categories.map((item) => (
              <button key={item} type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="template-grid">
          {visible.map((item) => (
            <article className="template-card" key={item.id}>
              <div className="template-preview" style={{ background: item.color }}>
                <div className="cover" style={{ background: item.accent }}>
                  <span>{item.title}</span>
                  <small>AKSTORY</small>
                </div>
                <div className="cover-shadow" />
              </div>
              <div className="template-info">
                <span>{item.style}</span>
                <h4>{item.title}</h4>
                <p>
                  {item.subtitle} — مناسب {item.usage}
                </p>
                <div>
                  <strong>از {item.price} تومان</strong>
                  <button type="button" onClick={() => useTemplate(item.id)}>
                    استفاده از قالب <ArrowLeft size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="page-note">
          هنوز عکس نزدی؟ اول برو به <Link href="/create/upload">بارگذاری عکس</Link>
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
