import { Star } from "lucide-react";
import { testimonials } from "@/data/catalog";

export function HomeTestimonials() {
  return (
    <section className="reviews-board" id="reviews">
      <div className="reviews-head">
        <span>نظر خریدارها</span>
        <h2>تو عکس بگیر، ما خاطره ثبت میکنیم</h2>
        <p>امتیاز ۴.۸ از ۵ — بر اساس بازخورد نسخه نمایشی</p>
      </div>
      <div className="reviews-grid">
        {testimonials.map((item) => (
          <article key={item.name}>
            <div className="stars" aria-label="۵ از ۵">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={14} fill="currentColor" />
              ))}
            </div>
            <p>{item.quote}</p>
            <small>
              <b>تأییدشده</b> {item.name} — {item.city}
            </small>
          </article>
        ))}
      </div>
    </section>
  );
}
