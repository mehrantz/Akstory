"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { bookProducts, templates } from "@/data/catalog";
import { loadDraft } from "@/lib/draft";

export default function PreviewPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const draft = useMemo(() => loadDraft(), []);
  const template = templates.find((t) => t.id === draft.templateId) ?? templates[0];
  const product = bookProducts.find((p) => p.id === draft.bookTypeId) ?? bookProducts[0];

  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <section className="page-shell">
        <div className="page-kicker">پیش‌نمایش کتاب</div>
        <h1>کتابت این‌شکلی می‌شود</h1>
        <p className="page-lead">جلد، صفحات نمونه و برآورد قیمت — قبل از سفارش همه چیز را ببین.</p>

        <div className="preview-layout">
          <div className="preview-book" style={{ background: template.color }}>
            <div className="cover" style={{ background: template.accent, transform: "none" }}>
              <span>{template.title}</span>
              <small>AKSTORY</small>
            </div>
          </div>
          <div className="preview-summary">
            <h2>{template.title}</h2>
            <p>{template.subtitle}</p>
            <ul>
              <li>نوع کتاب: {product.nameFa}</li>
              <li>تعداد عکس (نسخه نمایشی): {draft.photoCount || "—"}</li>
              <li>شناسه پروژه: {projectId}</li>
            </ul>
            <strong className="preview-price">از {product.priceFrom} تومان</strong>
            <div className="wizard-actions">
              <Link className="text-link" href={`/editor/${projectId}`}>
                ویرایش کتاب
              </Link>
              <Link className="primary-button" href="/orders">
                ادامه سفارش <ArrowLeft size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
