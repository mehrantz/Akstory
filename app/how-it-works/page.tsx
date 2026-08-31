import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { howSteps } from "@/data/catalog";

const details = [
  "موضوع و نوع کتاب را انتخاب می‌کنی.",
  "عکس‌ها را بارگذاری و مرتب می‌کنی.",
  "قالب را برمی‌گزینی و در ادیتور داستان را می‌سازی.",
  "پیش‌نمایش واقعی می‌بینی و سفارش می‌دهی.",
];

export default function HowItWorksPage() {
  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <section className="page-shell">
        <div className="page-kicker">مسیر ساخت</div>
        <h1>چطور عکستوری کار می‌کند؟</h1>
        <p className="page-lead">از گوشی تا کتاب چاپی؛ مسیر کوتاه، شفاف و قابل پیگیری.</p>
        <div className="steps how-full-steps">
          {howSteps.map((step) => (
            <article key={step.n}>
              <b>{step.n}</b>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <ol className="detail-list">
          {details.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <div className="home-section-cta">
          <Link className="primary-button" href="/create">
            شروع ساخت عکستوری <ArrowLeft size={18} />
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
