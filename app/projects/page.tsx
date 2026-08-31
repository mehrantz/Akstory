import Link from "next/link";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/layout/site-chrome";

const demo = [
  { id: "prj_demo_1", title: "سفر یزد", status: "در حال ویرایش" },
  { id: "prj_demo_2", title: "داستان ما", status: "آماده سفارش" },
];

export default function ProjectsPage() {
  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <section className="page-shell">
        <div className="page-kicker">پروژه‌ها</div>
        <h1>پروژه‌های عکستوری تو</h1>
        <p className="page-lead">لیست نمایشی برای مسیر محصول؛ اتصال به دیتابیس بعداً می‌آید.</p>
        <div className="simple-list">
          {demo.map((item) => (
            <article key={item.id}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.status}</p>
              </div>
              <Link href={`/editor/${item.id}`}>ادامه ویرایش</Link>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
