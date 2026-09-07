import Link from "next/link";
import { brandValues } from "@/data/catalog";

export function HomeBrand() {
  return (
    <section className="brand-story" id="brand">
      <div className="brand-visual" aria-hidden="true">
        <img src="/images/brand-visual.jpg" alt="" />
        <p>جایی که عکس‌ها ماندگار می‌شوند</p>
      </div>
      <div className="brand-copy">
        <span>کتابی که داستان خودت را روایت می‌کند</span>
        <h2>عکستوری؛ جایی که عکس‌ها تبدیل به خاطره می‌شوند</h2>
        <div className="brand-values">
          {brandValues.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <Link className="text-link" href="/about">
          داستان برند
        </Link>
      </div>
    </section>
  );
}
