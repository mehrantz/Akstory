import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { brandValues } from "@/data/catalog";

export default function AboutPage() {
  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <section className="page-shell about-page">
        <div className="page-kicker">درباره</div>
        <h1>داستان پشت داستان‌ها</h1>
        <p className="page-lead">
          همیشه آن آدمی بودیم که همه‌چیز را ثبت می‌کند. عکس‌ها لایق بیشتر از ماندن توی گوشی‌اند. عکستوری جایی است که
          خاطره‌ها خانه پیدا می‌کنند — برای ورق زدن، هدیه دادن، و ماندن.
        </p>
        <div className="brand-values about-values">
          {brandValues.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
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
