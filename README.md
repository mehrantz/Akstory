# عکستوری | AksTory

وب‌سایت فارسی و راست‌چین برای ساخت و چاپ کتاب عکس شخصی.

## ساختار پروژه

```text
app/                 مسیرها و صفحات (فرانت، الزام vinext)
frontend/            کامپوننت‌ها، منطق کلاینت و داده
  components/
  data/
  lib/
backend/             سرور، دیتابیس و worker
  worker/
  db/
  drizzle/
public/              تصاویر، فونت و استیکر
```

## اجرا

```bash
npm install
npm run dev
```

معمولاً روی `http://localhost:5173` باز می‌شود.

## اسکریپت‌ها

- `npm run dev` — سرور توسعه
- `npm run build` — بیلد نهایی
- `npm run start` — اجرای بیلد
- `npm run lint` — بررسی کد
