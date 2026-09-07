"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBag, User, X } from "lucide-react";

const links = [
  { href: "/", label: "خانه" },
  { href: "/create/templates", label: "فروشگاه" },
  { href: "/about", label: "درباره" },
  { href: "/faq", label: "پرسش‌ها" },
];

export function AnnouncementBar() {
  return (
    <div className="announcement">
      <span>ارسال سریع در ایران</span>
      <i />
      <span>ضمانت ۳۰ روزه کیفیت</span>
      <i />
      <span>ساخت کتاب در حدود ۱۰ دقیقه</span>
    </div>
  );
}

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={overlay ? "site-header overlay" : "site-header"}>
      <Link className="brand" href="/" aria-label="عکستوری، صفحه اصلی">
        <strong>akstory</strong>
      </Link>
      <nav className={menuOpen ? "nav open" : "nav"}>
        {links.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link className="nav-mobile-only" href="/create" onClick={() => setMenuOpen(false)}>
          شروع طراحی
        </Link>
      </nav>
      <div className="header-utils">
        <Link href="/account" aria-label="حساب کاربری" className="icon-link account-link">
          <span>حساب</span>
          <User size={18} />
        </Link>
        <Link href="/orders" aria-label="سبد و سفارش‌ها" className="icon-link">
          <ShoppingBag size={20} />
        </Link>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="باز کردن منو">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-brand">
        <strong>akstory</strong>
        <span>AksTory، روایت تصویری خاطرات شماست.</span>
        <form className="footer-subscribe" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="footer-email">عضویت در خبرنامه</label>
          <div>
            <input id="footer-email" type="email" name="email" placeholder="ایمیل تو" autoComplete="email" />
            <button type="submit">عضویت</button>
          </div>
        </form>
      </div>
      <div>
        <b>مسیرها</b>
        <Link href="/">خانه</Link>
        <Link href="/about">درباره</Link>
        <Link href="/faq">پرسش‌ها</Link>
        <Link href="/create/templates">فروشگاه</Link>
      </div>
      <div>
        <b>کمک</b>
        <Link href="/orders">پیگیری سفارش</Link>
        <Link href="/how-it-works">نحوه ساخت</Link>
        <Link href="/products">کیفیت چاپ</Link>
        <Link href="/account">حساب کاربری</Link>
      </div>
      <div className="footer-cta">
        <b>عکستوری + تو</b>
        <p>ساختهٔ تو، دوست‌داشتهٔ ما.</p>
        <Link className="primary-button" href="/create">
          شروع طراحی
        </Link>
      </div>
      <small>© ۱۴۰۵ عکستوری — نسخه نمایشی محصول</small>
    </footer>
  );
}
