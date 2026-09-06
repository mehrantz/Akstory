"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Sparkles, Star } from "lucide-react";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { shopTemplates } from "@/data/catalog";
import { createProjectId, saveDraft } from "@/lib/draft";

const categories = ["همه", "سفر", "داستان ما", "کودک", "خانواده", "جشن", "روزمره"];

export default function TemplatesPage() {
  const router = useRouter();
  const [category, setCategory] = useState("همه");
  const visible = useMemo(
    () => (category === "همه" ? shopTemplates : shopTemplates.filter((template) => template.category === category)),
    [category],
  );

  function selectTemplate(templateId: string) {
    const projectId = createProjectId();
    saveDraft({ templateId, projectId });
    router.push(`/editor/${projectId}`);
  }

  return (
    <main className="shop-page">
      <AnnouncementBar />
      <SiteHeader />
      <section className="shop-intro">
        <div className="shop-intro-copy">
          <span className="shop-eyebrow"><Sparkles size={15} /> فروشگاه عکستوری</span>
          <h1>خاطره‌هایت،<br /><em>در یک جلد ماندگار</em></h1>
          <p>از میان شش سری شروع کن. عکس‌ها، نوشته‌ها و چیدمان هر صفحه را خودت می‌سازی؛ ما آن را به یک کتاب واقعی تبدیل می‌کنیم.</p>
        </div>
        <div className="shop-intro-note">
          <strong>۶ سری</strong>
          <span>برای شش جور قصه</span>
          <ul>
            <li><Check size={15} /> جلد سخت و چاپ حرفه‌ای</li>
            <li><Check size={15} /> قابل شخصی‌سازی تا آخرین صفحه</li>
          </ul>
        </div>
      </section>

      <section className="shop-catalog" aria-labelledby="shop-catalog-title">
        <div className="shop-toolbar">
          <div>
            <span>مجموعه‌ها</span>
            <h2 id="shop-catalog-title">قصهٔ تو از کجا شروع می‌شود؟</h2>
          </div>
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
        </div>

        <div className="shop-product-grid">
          {visible.map((item) => (
            <article className="shop-product-card" key={item.id}>
              <button className="shop-product-visual" type="button" onClick={() => selectTemplate(item.id)} aria-label={`مشاهده ${item.title}`}>
                {item.image ? (
                  <Image src={item.image} alt={`کتاب عکس ${item.title}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" />
                ) : null}
                {item.badge ? <span className="shop-badge">{item.badge}</span> : null}
                <span className="shop-visual-action">دیدن این قالب <ArrowLeft size={16} /></span>
              </button>
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
                <button className="shop-product-cta" type="button" onClick={() => selectTemplate(item.id)}>
                  ساخت با این سری <ArrowLeft size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="shop-upload-note">
          <div>
            <span>قالب را بعداً هم می‌توانی عوض کنی</span>
            <strong>اول عکس‌هایت را جمع کنیم؟</strong>
          </div>
          <Link href="/create/upload">بارگذاری عکس‌ها <ArrowLeft size={17} /></Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
