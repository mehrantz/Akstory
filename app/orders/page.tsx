import Link from "next/link";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/layout/site-chrome";

export default function OrdersPage() {
  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <section className="page-shell">
        <div className="page-kicker">سفارش‌ها</div>
        <h1>سفارش‌های تو</h1>
        <p className="page-lead">هنوز سفارش واقعی ثبت نشده. از پیش‌نمایش کتاب می‌توانی مسیر سفارش را شروع کنی.</p>
        <div className="empty-panel">
          <p>سفارشی برای نمایش نیست.</p>
          <Link className="primary-button" href="/create">
            ساخت عکستوری جدید
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
