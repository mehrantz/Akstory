"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { shopTemplates } from "@/data/catalog";

const categories = ["همه", "سفر", "داستان ما", "کودک", "خانواده", "جشن", "روزمره"];

export default function TemplatesPage() {
  const [category, setCategory] = useState("همه");
  const visible = useMemo(
    () => (category === "همه" ? shopTemplates : shopTemplates.filter((template) => template.category === category)),
    [category],
  );

  return (
    <main className="shop-page">
      <AnnouncementBar />
      <section className="hero-banner shop-hero" id="top">
        <div className="hero-scene">
          <div className="hero-photo" aria-hidden="true">
            <img src="/images/hero-bg.jpg" alt="" />
          </div>
          <SiteHeader overlay />
          <div className="hero-overlay">
            <h1>
              خاطره‌هایت،
              <br />
              در یک جلد ماندگار
            </h1>
          </div>
        </div>
      </section>

      <section className="shop-catalog" aria-label="قالب‌های فروشگاه">
        <div className="shop-filters" role="group" aria-label="فیلتر مجموعه‌ها">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="shop-product-grid">
          {visible.map((item) => (
            <article className="shop-product-card" key={item.id}>
              <Link className="shop-product-visual" href={`/shop/${item.id}`} aria-label={`مشاهده ${item.title}`}>
                {item.image ? (
                  <Image src={item.image} alt={`کتاب عکس ${item.title}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" />
                ) : null}
                {item.badge ? <span className="shop-badge">{item.badge}</span> : null}
                <span className="shop-visual-action">دیدن این قالب <ArrowLeft size={16} /></span>
              </Link>
              <div className="shop-product-info">
                <div className="shop-product-meta">
                  <span>{item.series ?? item.style}</span>
                  <span className="shop-rating" aria-label={`پنج ستاره از ${item.reviews ?? 0} نظر`}>
                    <Star size={12} fill="currentColor" /> ۵٫۰ <i>({item.reviews ?? 0})</i>
                  </span>
                </div>
                <div className="shop-product-title-row">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                  <div className="shop-product-price">
                    <small>شروع از</small>
                    <strong>{item.price}</strong>
                    <small>تومان</small>
                  </div>
                </div>
                <Link className="shop-product-cta" href={`/shop/${item.id}`}>
                  ساخت با این سری <ArrowLeft size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
