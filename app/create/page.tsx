"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { bookProducts, storyTypes } from "@/data/catalog";
import { saveDraft } from "@/lib/draft";

export default function CreatePage() {
  const router = useRouter();
  const [storyTypeId, setStoryTypeId] = useState<string | null>(null);
  const [bookTypeId, setBookTypeId] = useState<"classic" | "premium" | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  function continueToUpload() {
    if (!storyTypeId || !bookTypeId) return;
    saveDraft({ storyTypeId, bookTypeId });
    router.push("/create/upload");
  }

  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <section className="page-shell">
        <div className="page-kicker">ساخت عکستوری</div>
        <h1>{step === 1 ? "موضوع داستانت چیست؟" : "نوع کتاب را انتخاب کن"}</h1>
        <p className="page-lead">
          {step === 1
            ? "یک شروع احساسی انتخاب کن؛ بعداً می‌توانی جزئیات را تغییر بدهی."
            : "کلاسیک برای روزمره‌ها، پریمیوم برای هدیه‌های خاص."}
        </p>

        <div className="wizard-progress">
          <i className="done" />
          <i className={step >= 2 ? "done" : ""} />
          <i />
        </div>

        {step === 1 && (
          <div className="category-grid create-story-grid">
            {storyTypes.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`category-card ${item.color} ${storyTypeId === item.id ? "selected" : ""}`}
                onClick={() => setStoryTypeId(item.id)}
              >
                <b>{item.icon}</b>
                <h3>{item.name}</h3>
                <p>{item.text}</p>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="product-pick-grid">
            {bookProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                className={`product-pick-card ${bookTypeId === product.id ? "selected" : ""}`}
                onClick={() => setBookTypeId(product.id)}
              >
                <span>{product.name}</span>
                <h3>{product.nameFa}</h3>
                <p>{product.tagline}</p>
                <strong>از {product.priceFrom} تومان</strong>
                <ul>
                  {product.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        )}

        <div className="wizard-actions">
          {step === 2 && (
            <button type="button" className="text-link" onClick={() => setStep(1)}>
              بازگشت
            </button>
          )}
          {step === 1 ? (
            <button type="button" className="primary-button" disabled={!storyTypeId} onClick={() => setStep(2)}>
              ادامه <ArrowLeft size={18} />
            </button>
          ) : (
            <button type="button" className="primary-button" disabled={!bookTypeId} onClick={continueToUpload}>
              ادامه به بارگذاری عکس <ArrowLeft size={18} />
            </button>
          )}
        </div>

        <p className="page-note">
          یا مستقیم برو به <Link href="/create/templates">انتخاب قالب</Link>
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
