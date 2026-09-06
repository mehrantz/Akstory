"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductConfigure } from "@/components/shop/product-configure";
import { SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { getTemplateById } from "@/data/catalog";

export default function ShopProductPage() {
  const params = useParams<{ id: string }>();
  const template = getTemplateById(params.id);

  if (!template) {
    return (
      <main className="pdp-page">
        <div className="pdp-announce">
          <span>ارسال سریع</span>
          <i />
          <span>تا ۶۰٪ تخفیف — به‌زودی تمام می‌شود!</span>
        </div>
        <SiteHeader />
        <section className="page-shell">
          <h1>این سری پیدا نشد</h1>
          <p className="page-lead">شاید لینک عوض شده باشد. از فروشگاه یک قالب دیگر انتخاب کن.</p>
          <Link className="primary-button" href="/create/templates">
            بازگشت به فروشگاه
          </Link>
        </section>
        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="pdp-page">
      <div className="pdp-announce">
        <span>ارسال سریع</span>
        <i />
        <span>تا ۶۰٪ تخفیف — به‌زودی تمام می‌شود!</span>
      </div>
      <SiteHeader />
      <ProductConfigure key={template.id} template={template} />
      <SiteFooter />
    </main>
  );
}
