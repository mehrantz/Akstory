import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function HomeFinalCta() {
  return (
    <section className="create-section home-final-cta">
      <div className="create-copy">
        <span>همین حالا شروع کن</span>
        <h2>اولین عکستوری‌ات را بساز</h2>
        <p>از انتخاب موضوع تا پیش‌نمایش کتاب، مسیر ساخت کوتاه است. چاپ و ارسال در مرحله‌های بعد به مسیر وصل می‌شود.</p>
        <Link className="primary-button" href="/create" style={{ marginTop: 24, display: "inline-flex" }}>
          شروع ساخت عکستوری <ArrowLeft size={19} />
        </Link>
      </div>
    </section>
  );
}
