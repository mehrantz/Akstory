"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { faqs } from "@/data/catalog";

export default function FaqPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <section className="page-shell faq-page">
        <div className="page-kicker">پرسش‌ها</div>
        <h1>قبل از شروع، هر چیزی که باید بدانی</h1>
        <p className="page-lead">
          اگر پاسخت اینجا نیست، از <Link href="/account">حساب کاربری</Link> پشتیبانی را دنبال کن.
        </p>
        <div className="faq-list">
          {faqs.map((item, index) => (
            <article className={openFaq === index ? "open" : ""} key={item[0]}>
              <button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                <b>{item[0]}</b>
                <ChevronDown />
              </button>
              <p>{item[1]}</p>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
