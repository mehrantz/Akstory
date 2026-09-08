"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, Clock, Search, Star, Trees } from "lucide-react";
import { shopTemplates, type TemplateItem } from "@/data/catalog";
import { createProjectId, loadDraft, saveDraft } from "@/lib/draft";

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const BASE_PAGES = 24;
const PACKS = [
  { id: "single", label: "تک", books: 1 },
  { id: "duo", label: "دوتایی", books: 2 },
  { id: "trio", label: "سه‌تایی", books: 3 },
] as const;
const THICKNESS = [
  { pages: 50, spine: 10 },
  { pages: 100, spine: 18 },
  { pages: 150, spine: 26 },
  { pages: 200, spine: 36 },
] as const;
const ACCORDIONS = [
  {
    id: "how",
    title: "نحوه ساخت",
    body: "قالب را انتخاب کن، «شروع طراحی» را بزن و عکس‌هایت در ادیتور روی همان قالب باز می‌شوند. ساخت کتاب معمولاً حدود ۱۰ دقیقه طول می‌کشد؛ بعد پیش‌نمایش را می‌بینی و سفارش می‌دهی.",
  },
  {
    id: "specs",
    title: "مشخصات محصول",
    body: "جلد سخت، کاغذ ضخیم مات و چاپ رنگی. اندازه استاندارد رومیزی. از ۲۴ صفحه شروع می‌شود و صفحهٔ اضافه قابل خرید است. گوشه‌ها گرد و بسته‌بندی مناسب ارسال دارد.",
  },
  {
    id: "ship",
    title: "ارسال",
    body: "ارسال سریع در ایران. اگر امروز سفارش بدهی، تا ۲۴ شهریور به دستت می‌رسد. کتاب با محافظ جلد و گوشه بسته‌بندی می‌شود.",
  },
  {
    id: "guarantee",
    title: "ضمانت ۳۰ روزه رضایت",
    body: "اگر از کیفیت چاپ، رنگ یا جلد راضی نبودی، تا ۳۰ روز فرصت داری با ما مطرح کنی تا جایگزین یا اصلاح شود.",
  },
] as const;

function faToNum(value: string) {
  const digits = [...value]
    .map((char) => {
      const index = FA_DIGITS.indexOf(char);
      if (index >= 0) return String(index);
      return /[0-9]/.test(char) ? char : "";
    })
    .join("");
  return Number.parseInt(digits, 10) || 0;
}

function numToFa(value: number) {
  return Math.round(value).toLocaleString("fa-IR");
}

function MiniBooks({ count }: { count: number }) {
  return (
    <span className="pdp-mini-books" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <i key={index} />
      ))}
    </span>
  );
}

export function ProductConfigure({ template }: { template: TemplateItem }) {
  const router = useRouter();
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [packId, setPackId] = useState<(typeof PACKS)[number]["id"]>("single");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(template.id);
  const [thickOpen, setThickOpen] = useState(true);
  const [openAcc, setOpenAcc] = useState<string | null>(null);

  const selected = shopTemplates.find((item) => item.id === selectedId) ?? template;
  const scratch = selectedId === "scratch";
  const sale = faToNum(selected.price);
  const was = sale * 2;
  const perSale = Math.round(sale / BASE_PAGES / 1000) * 1000;
  const perWas = perSale * 2;
  const reviews = selected.reviews ?? template.reviews ?? 22;

  const gallery = useMemo(() => {
    const images = [template.image, ...shopTemplates.map((item) => item.image)].filter(Boolean) as string[];
    return [...new Set(images)].slice(0, 6);
  }, [template.image]);

  const visibleTemplates = useMemo(() => {
    const q = query.trim();
    return shopTemplates.filter((item) => {
      if (!q) return true;
      return `${item.title} ${item.subtitle} ${item.series ?? ""}`.includes(q);
    });
  }, [query]);

  function pickTemplate(id: string) {
    setSelectedId(id);
    if (id !== "scratch" && id !== template.id) {
      router.push(`/shop/${id}`);
    }
  }

  function startDesign() {
    const projectId = loadDraft().projectId ?? createProjectId();
    saveDraft({
      templateId: scratch ? null : selected.id,
      projectId,
    });
    router.push("/create/start");
  }

  const currentImage = gallery[galleryIndex] ?? selected.image;

  return (
    <div className="pdp-layout">
      <section className="pdp-gallery" aria-label="گالری کتاب">
        <div className="pdp-stage">
          <button
            type="button"
            className="pdp-arrow prev"
            aria-label="تصویر قبلی"
            onClick={() => setGalleryIndex((index) => (index - 1 + gallery.length) % gallery.length)}
          >
            <ChevronRight size={22} />
          </button>
          <div className={scratch ? "pdp-book blank" : "pdp-book"}>
            {!scratch && currentImage ? (
              <Image src={currentImage} alt={`نمای کتاب ${selected.title}`} fill sizes="(max-width: 900px) 100vw, 52vw" />
            ) : null}
          </div>
          <button
            type="button"
            className="pdp-arrow next"
            aria-label="تصویر بعدی"
            onClick={() => setGalleryIndex((index) => (index + 1) % gallery.length)}
          >
            <ChevronLeft size={22} />
          </button>
        </div>
        <div className="pdp-thumbs" role="tablist" aria-label="تصاویر محصول">
          {gallery.map((src, index) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={galleryIndex === index}
              className={galleryIndex === index ? "active" : ""}
              onClick={() => setGalleryIndex(index)}
            >
              <Image src={src} alt="" fill sizes="80px" />
            </button>
          ))}
        </div>
      </section>

      <section className="pdp-config">
        <h1>کتاب عکس شخصی</h1>
        <div className="pdp-rating" aria-label={`امتیاز ۵ از ۵ از ${reviews} نظر`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={14} fill="currentColor" />
          ))}
          <span>امتیاز ۵ از ۵ از {numToFa(reviews)} نظر</span>
        </div>

        <div className="pdp-price">
          <p>
            {numToFa(BASE_PAGES)} صفحه از <s>{numToFa(was)}</s> <strong>{numToFa(sale)}</strong> تومان
            <em>۵۰٪ تخفیف</em>
          </p>
          <small>
            سپس <s>{numToFa(perWas)}</s> <b>{numToFa(perSale)}</b> تومان برای هر صفحه
          </small>
        </div>

        <div className="pdp-sale">
          <div className="pdp-sale-label">
            <i />
            <span>فروش ویژه</span>
            <i />
          </div>
          <div className="pdp-packs" role="group" aria-label="انتخاب بسته">
            {PACKS.map((pack) => (
              <button
                key={pack.id}
                type="button"
                className={packId === pack.id ? "active" : ""}
                onClick={() => setPackId(pack.id)}
              >
                <MiniBooks count={pack.books} />
                <em>۵۰٪ تخفیف</em>
                <span>{pack.label}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="pdp-hint">قالب را انتخاب کن، «شروع طراحی» را بزن و همان قالب در ادیتور باز می‌شود.</p>

        <div className="pdp-templates">
          <label className="pdp-search">
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی قالب"
            />
          </label>
          <ul>
            <li>
              <button type="button" className={scratch ? "active" : ""} onClick={() => pickTemplate("scratch")}>
                <i className="pdp-tpl-icon blank" />
                <span>از صفر شروع کن</span>
              </button>
            </li>
            {visibleTemplates.map((item) => (
              <li key={item.id}>
                <button type="button" className={item.id === selectedId ? "active" : ""} onClick={() => pickTemplate(item.id)}>
                  <i className="pdp-tpl-icon" style={{ background: item.color }} />
                  <span>{item.title}</span>
                  {item.badge ? <em>{item.badge}</em> : null}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button className="pdp-cta" type="button" onClick={startDesign}>
          شروع طراحی
        </button>

        <div className="pdp-trust">
          <p>
            <Clock size={16} />
            اگر امروز سفارش بدهی، تا ۲۴ شهریور به دستت می‌رسد
          </p>
          <p>
            <Trees size={16} />
            به‌ازای هر ۵ کتاب، یک درخت کاشته می‌شود — تا امروز {numToFa(56736)} درخت
          </p>
        </div>

        <div className="pdp-thick">
          <button type="button" className={thickOpen ? "open" : ""} onClick={() => setThickOpen((open) => !open)}>
            <span>کتابت چقدر ضخیم می‌شود؟</span>
            <ChevronDown size={18} />
          </button>
          {thickOpen ? (
            <div className="pdp-thick-grid">
              {THICKNESS.map((item) => (
                <figure key={item.pages}>
                  <div className="pdp-thick-book" style={{ ["--spine" as string]: `${item.spine}px`, ["--cover" as string]: selected.color }}>
                    <b>{selected.title}</b>
                  </div>
                  <figcaption>{numToFa(item.pages)} صفحه</figcaption>
                </figure>
              ))}
            </div>
          ) : null}
        </div>

        <div className="pdp-acc">
          {ACCORDIONS.map((item) => (
            <article key={item.id} className={openAcc === item.id ? "open" : ""}>
              <button type="button" onClick={() => setOpenAcc(openAcc === item.id ? null : item.id)}>
                <span>{item.title}</span>
                <ChevronDown size={18} />
              </button>
              {openAcc === item.id ? <p>{item.body}</p> : null}
            </article>
          ))}
        </div>

        <Link className="pdp-back" href="/create/templates">
          بازگشت به فروشگاه
        </Link>
      </section>
    </div>
  );
}
