import Link from "next/link";

export function HomeFaqPreview() {
  return (
    <section className="help-band" id="help">
      <span>پرسش‌های پرتکرار</span>
      <h2>سوالی داری؟ پاسخ اینجاست</h2>
      <p>از ساخت کتاب تا ویرایش صفحات و زمان چاپ؛ جواب‌ها را اینجا بخوان.</p>
      <Link className="primary-button" href="/faq">
        مشاهده پرسش‌ها
      </Link>
    </section>
  );
}
