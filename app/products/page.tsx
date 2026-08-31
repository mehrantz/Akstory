import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { bookProducts } from "@/data/catalog";

export default function ProductsPage() {
  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <section className="page-shell">
        <div className="page-kicker">محصولات</div>
        <h1>نوع کتاب و کیفیت چاپ</h1>
        <p className="page-lead">کلاسیک برای خاطره‌های روزمره، پریمیوم برای هدیه‌های ماندگار.</p>
        <div className="product-pick-grid">
          {bookProducts.map((product) => (
            <article key={product.id} className="product-pick-card static">
              <span>{product.name}</span>
              <h3>{product.nameFa}</h3>
              <p>{product.tagline}</p>
              <strong>از {product.priceFrom} تومان</strong>
              <ul>
                {product.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
                <li>سایز استاندارد آلبوم رومیزی</li>
                <li>بسته‌بندی مناسب ارسال</li>
              </ul>
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
