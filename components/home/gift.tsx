import Link from "next/link";

export function HomeGift() {
  return (
    <section className="gift-banner" id="gift">
      <span>کارت خاطره</span>
      <h2>هدیه بده؛ بدون قیمت داخل بسته</h2>
      <p>یک کتاب شخصی برای کسی که دوستش داری — مناسب سالگرد، سفر و تولد.</p>
      <Link className="hero-btn hero-btn-fill" href="/create">
        ساخت هدیه
      </Link>
    </section>
  );
}
