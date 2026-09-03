import Link from "next/link";
import { templates } from "@/data/catalog";

const featured = templates.filter((t) => t.featured).slice(0, 4);

export function HomeFeatured() {
  return (
    <section className="shop-popular" id="shop">
      <div className="section-head shop-head">
        <div>
          <span>فروشگاه</span>
          <h2>پرفروش‌ترین کتاب‌ها</h2>
        </div>
        <Link className="text-link" href="/create/templates">
          مشاهده همه
        </Link>
      </div>
      <div className="shop-grid">
        {featured.map((item) => (
          <Link className="shop-card" key={item.id} href={`/create?template=${item.id}`}>
            <div className="shop-card-visual" style={{ background: item.color }}>
              <div className="shop-cover" style={{ background: item.accent }}>
                <span>{item.title}</span>
              </div>
            </div>
            <div className="shop-card-info">
              <span>{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              <strong>از {item.price} تومان</strong>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
