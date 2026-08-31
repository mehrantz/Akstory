"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";

const links = [
  { href: "/create/templates", label: "قالب‌ها" },
  { href: "/how-it-works", label: "چطور کار می‌کند؟" },
  { href: "/products", label: "محصولات" },
  { href: "/faq", label: "پرسش‌ها" },
];

export function AnnouncementBar() {
  return (
    <div className="announcement">
      <span>ارسال به سراسر ایران</span>
      <i />
      <span>تضمین کیفیت چاپ</span>
      <i />
      <span>پیش‌نمایش قبل از سفارش</span>
    </div>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="عکستوری، صفحه اصلی">
        <strong>AksTory</strong>
        <span>عکستوری</span>
      </Link>
      <nav className={menuOpen ? "nav open" : "nav"}>
        {links.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="header-cta" href="/create">
        شروع طراحی <ArrowLeft size={17} />
      </Link>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="باز کردن منو">
        {menuOpen ? <X /> : <Menu />}
      </button>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-brand">
        <strong>AksTory</strong>
        <span>عکستوری؛ جایی برای ورق زدن خاطره‌ها.</span>
      </div>
      <div>
        <b>دسترسی سریع</b>
        <Link href="/create/templates">قالب‌ها</Link>
        <Link href="/how-it-works">نحوه ساخت</Link>
        <Link href="/faq">پرسش‌ها</Link>
      </div>
      <div>
        <b>اعتماد و پشتیبانی</b>
        <Link href="/products">کیفیت چاپ</Link>
        <Link href="/inspiration">الهام</Link>
        <Link href="/account">حساب کاربری</Link>
      </div>
      <div className="footer-cta">
        <b>داستانت آماده‌ی ساخته شدنه</b>
        <Link className="primary-button" href="/create" style={{ display: "inline-flex", width: "fit-content" }}>
          ساخت عکستوری من <ArrowLeft />
        </Link>
      </div>
      <small>© ۱۴۰۵ عکستوری — نسخه نمایشی محصول</small>
    </footer>
  );
}
