import Link from "next/link";

export function HomeFaqPreview() {
  return (
    <section className="help-band" id="help">
      <div className="glass-help">
        <span>کمک لازم داری؟</span>
        <h2>جواب پرسش‌های پرتکرار همین‌جاست</h2>
        <p>از زمان ساخت تا کیفیت چاپ و ارسال. اگر پیدا نکردی، از حساب کاربری پیگیری کن.</p>
        <Link className="primary-button" href="/faq">
          مشاهده پرسش‌ها
        </Link>
      </div>
    </section>
  );
}
