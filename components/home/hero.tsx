import Link from "next/link";
import { shopCollections } from "@/data/catalog";
import { SiteHeader } from "@/components/layout/site-chrome";

export function HomeHero() {
  return (
    <section className="hero-banner" id="top">
      <div className="hero-scene">
        <div className="hero-photo" aria-hidden="true">
          <img src="/images/hero-bg.jpg" alt="" />
        </div>
        <SiteHeader overlay />
        <div className="hero-overlay">
          <h1>
            خاطراتت را تبدیل
            <br />
            به یک کتاب ماندگار کن
          </h1>
          <p>عکس‌های لحظه‌های ارزشمندت را انتخاب کن؛ ما آن‌ها را به یک کتاب زیبا و حرفه‌ای تبدیل می‌کنیم.</p>
          <div className="hero-actions">
            <Link className="hero-btn hero-btn-fill" href="/create/templates">
              ساخت اولین عکستوری
            </Link>
            <Link className="hero-btn hero-btn-ghost" href="/how-it-works">
              دیدن نمونه کتاب‌ها
            </Link>
          </div>
        </div>
        <nav className="collection-strip" aria-label="دسته‌بندی فروشگاه">
          {shopCollections.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
