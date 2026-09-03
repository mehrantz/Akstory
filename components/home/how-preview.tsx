import Link from "next/link";
import { howSteps } from "@/data/catalog";

export function HomeHowPreview() {
  return (
    <section className="how-light" id="how">
      <div className="how-light-head">
        <span>ساخت در سه قدم</span>
        <h2>آن‌قدر ساده که در یک نشستن تمام می‌شود</h2>
        <p>بدون اپ. قالب را بردار، عکس بگذار، جزئیات را عوض کن.</p>
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
