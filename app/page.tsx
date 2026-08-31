import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { benefits, howSteps, templates } from "@/data/catalog";

const featured = templates.filter((t) => t.featured).slice(0, 4);

export default function Home() {
  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} /> قصه‌ی عکس‌هایت را بساز
          </div>
          <h1>
            خاطراتت فقط توی<br />گوشی <em>نمانند</em>
          </h1>
          <p>عکس‌هایت را به یک کتاب خاطره زیبا و شخصی تبدیل کن.</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/create">
              شروع ساخت عکستوری <ArrowLeft size={19} />
            </Link>
            <Link className="text-link" href="/inspiration">
              دیدن نمونه‌ها
            </Link>
          </div>
          <div className="hero-trust">
            <span>
              <Check /> طراحی آسان و آنلاین
            </span>
            <span>
              <Check /> بدون نیاز به دانش طراحی
            </span>
          </div>
        </div>
        <div className="hero-visual" aria-label="نمونه یک کتاب عکس شخصی">
          <Image
            src="/images/akstory-photobook-hero.png"
            width={1586}
            height={992}
            priority
            alt="کتاب عکس شخصی عکستوری روی میز در کنار عکس‌های چاپی"
          />
        </div>
      </section>

      <section className="how-section home-how" id="how">
        <div className="how-intro">
          <span>ساده‌تر از چیزی که فکر می‌کنی</span>
          <h2>
            سه قدم تا یک<br />خاطره‌ی ماندگار
          </h2>
          <p>عکس انتخاب کن، داستان بساز، کتابت را بگیر.</p>
          <Link className="text-link home-inline-link" href="/how-it-works">
            مشاهده مراحل کامل
          </Link>
        </div>
        <div className="steps">
          {howSteps.map((step) => (
            <article key={step.n}>
              <b>{step.n}</b>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section home-templates" id="stories">
        <div className="section-head">
          <div>
            <span>قالب‌های منتخب</span>
            <h2>
              برای هر خاطره،<br />یک شروع زیبا
            </h2>
          </div>
          <p>چند نمونه از قالب‌های سفر، عشق، خانواده و کودک.</p>
        </div>
        <div className="template-grid">
          {featured.map((item) => (
            <article className="template-card" key={item.id}>
              <div className="template-preview" style={{ background: item.color }}>
                <div className="cover" style={{ background: item.accent }}>
                  <span>{item.title}</span>
                  <small>AKSTORY</small>
                </div>
                <div className="cover-shadow" />
              </div>
              <div className="template-info">
                <span>{item.category}</span>
                <h4>{item.title}</h4>
                <p>{item.subtitle}</p>
                <div>
                  <strong>از {item.price} تومان</strong>
                  <Link href={`/create?template=${item.id}`}>
                    انتخاب قالب <ArrowLeft size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="home-section-cta">
          <Link className="primary-button" href="/create/templates">
            مشاهده همه قالب‌ها <ArrowLeft size={18} />
          </Link>
        </div>
      </section>

      <section className="benefits-section">
        <div className="section-head">
          <div>
            <span>چرا عکستوری؟</span>
            <h2>ساده، حرفه‌ای، ماندگار</h2>
          </div>
        </div>
        <div className="benefits-grid">
          {benefits.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="create-section home-final-cta">
        <div className="create-copy">
          <span>همین حالا شروع کن</span>
          <h2>اولین عکستوری‌ات را بساز</h2>
          <p>از انتخاب موضوع تا پیش‌نمایش کتاب، مسیر ساخت کوتاه و واضح است.</p>
          <Link className="primary-button" href="/create" style={{ marginTop: 24, display: "inline-flex" }}>
            شروع ساخت عکستوری <ArrowLeft size={19} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
