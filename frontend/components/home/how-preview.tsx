import Link from "next/link";
import { howSteps } from "@/data/catalog";

export function HomeHowPreview() {
  return (
    <section className="how-light" id="how">
      <div className="how-light-head">
        <span>ساخت در سه قدم</span>
        <h2>ساخت یک کتاب خاطرات، ساده‌تر از همیشه</h2>
        <p>فقط عکس‌هایت را انتخاب کن؛ عکستوری کمک می‌کند آن‌ها را به یک کتاب زیبا و حرفه‌ای تبدیل کنی.</p>
      </div>
      <div className="how-light-steps">
        {howSteps.map((step) => (
          <article key={step.n}>
            <b>{step.n}</b>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
      <Link className="text-link" href="/how-it-works">
        مسیر کامل ساخت
      </Link>
    </section>
  );
}
