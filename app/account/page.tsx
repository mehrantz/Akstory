import Link from "next/link";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/layout/site-chrome";

export default function AccountPage() {
  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <section className="page-shell">
        <div className="page-kicker">حساب کاربری</div>
        <h1>حساب عکستوری تو</h1>
        <p className="page-lead">نسخه نمایشی — ورود واقعی در فاز بعدی اضافه می‌شود.</p>
        <div className="account-links">
          <Link href="/projects">پروژه‌های من</Link>
          <Link href="/orders">سفارش‌ها</Link>
          <Link href="/create">شروع پروژه جدید</Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
