import Link from "next/link";
import { brandValues } from "@/data/catalog";

export function HomeBrand() {
  return (
    <section className="brand-story" id="brand">
      <div className="brand-visual" aria-hidden="true">
        <div className="brand-book" />
        <p>داستان پشت داستان‌ها</p>
      </div>
      <div className="brand-copy glass-brand">
        <span>با برند آشنا شو</span>
        <h2>عکستوری برای خاطره‌هایی است که ارزش ورق زدن دارند</h2>
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
