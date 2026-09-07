import Link from "next/link";

export function HomeGift() {
  return (
    <section className="gift-banner" id="gift">
      <img className="gift-banner-bg" src="/images/gift-bg.jpg" alt="" aria-hidden="true" />
      <span>یک هدیه خاص</span>
      <h2>یک خاطره ماندگار هدیه بده</h2>
      <p>بعضی هدیه‌ها فقط برای یک روز نیستند؛ سال‌ها کنار آدم می‌مانند.</p>
      <Link className="hero-btn hero-btn-fill" href="/create">
        ساخت هدیه
      </Link>
    </section>
  );
}
