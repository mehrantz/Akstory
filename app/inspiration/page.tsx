import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { templates } from "@/data/catalog";

export default function InspirationPage() {
  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <section className="page-shell">
        <div className="page-kicker">الهام</div>
        <h1>داستان‌هایی که ارزش ورق زدن دارند</h1>
        <p className="page-lead">نمونه‌های سفر، خانواده، عشق و کودک — به سبک ادیتوریال.</p>
        <div className="inspiration-grid">
          {templates.map((item, index) => (
            <article key={item.id} className={`inspiration-card span-${(index % 3) + 1}`} style={{ background: item.color }}>
              <span>{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </article>
          ))}
        </div>
        <div className="home-section-cta">
          <Link className="primary-button" href="/create">
            داستان خودت را بساز <ArrowLeft size={18} />
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
