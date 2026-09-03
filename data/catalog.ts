export type StoryCategory = {
  id: string;
  name: string;
  icon: string;
  text: string;
  color: "clay" | "rose" | "butter" | "sage" | "teal" | "ink";
};

export type TemplateItem = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  style: string;
  usage: string;
  color: string;
  accent: string;
  price: string;
  featured?: boolean;
};

export type BookProduct = {
  id: "classic" | "premium";
  name: string;
  nameFa: string;
  tagline: string;
  priceFrom: string;
  highlights: string[];
};

export const storyTypes: StoryCategory[] = [
  { id: "travel", name: "سفر", icon: "✈", text: "از یزد تا شمال؛ سفرهایت را ورق بزن", color: "clay" },
  { id: "couple", name: "داستان ما", icon: "♡", text: "داستان دونفره‌ای که فقط مال شماست", color: "rose" },
  { id: "baby", name: "کودک", icon: "☀", text: "اولین لبخندها، قدم‌ها و تولدها", color: "butter" },
  { id: "family", name: "خانواده", icon: "⌂", text: "خاطره‌های ساده‌ای که باارزش‌اند", color: "sage" },
  { id: "gift", name: "هدیه", icon: "✦", text: "یک کتاب شخصی برای کسی که دوستش داری", color: "teal" },
  { id: "free", name: "آزاد", icon: "◎", text: "بدون محدودیت موضوع، کاملاً به سبک خودت", color: "ink" },
];

export const templates: TemplateItem[] = [
  {
    id: "travel-minimal",
    title: "کوچه‌های یزد",
    subtitle: "سفرنامه‌ی مینیمال شهرهای ایران",
    category: "سفر",
    style: "Travel Minimal",
    usage: "سفر و معماری",
    color: "#c86c55",
    accent: "#f0c86e",
    price: "۱٬۴۹۰٬۰۰۰",
    featured: true,
  },
  {
    id: "our-story",
    title: "داستانِ ما",
    subtitle: "برای لحظه‌های دونفره",
    category: "داستان ما",
    style: "Our Story",
    usage: "عاشقانه و سالگرد",
    color: "#d9a7a1",
    accent: "#7f9b8f",
    price: "۱٬۶۹۰٬۰۰۰",
    featured: true,
  },
  {
    id: "first-year",
    title: "اولین سال تو",
    subtitle: "کتاب رشد و خاطرات کودک",
    category: "کودک",
    style: "Family Memories",
    usage: "نوزاد و کودک",
    color: "#e8c978",
    accent: "#8ca7a2",
    price: "۱٬۵۹۰٬۰۰۰",
    featured: true,
  },
  {
    id: "family-table",
    title: "میز خانواده",
    subtitle: "دورهمی‌ها و روزهای ساده",
    category: "خانواده",
    style: "Family Soft",
    usage: "خانواده و مناسبت‌ها",
    color: "#a9b39a",
    accent: "#c96752",
    price: "۱٬۵۴۰٬۰۰۰",
    featured: true,
  },
  {
    id: "travel-premium",
    title: "سفر پریمیوم",
    subtitle: "جلد خاص برای سفرهای بلند",
    category: "سفر",
    style: "Travel Premium",
    usage: "سفر لوکس و هدیه",
    color: "#7fa7a3",
    accent: "#e8c978",
    price: "۲٬۱۹۰٬۰۰۰",
  },
];

export const bookProducts: BookProduct[] = [
  {
    id: "classic",
    name: "Classic Book",
    nameFa: "کتاب کلاسیک",
    tagline: "مناسب خاطره‌های روزمره؛ اقتصادی و تمیز",
    priceFrom: "۱٬۴۹۰٬۰۰۰",
    highlights: ["کاغذ مات باکیفیت", "جلد نرم مقاوم", "۲۰ تا ۶۰ صفحه"],
  },
  {
    id: "premium",
    name: "Premium Book",
    nameFa: "کتاب پریمیوم",
    tagline: "برای هدیه و لحظه‌های خاص؛ لوکس و ماندگار",
    priceFrom: "۲٬۱۹۰٬۰۰۰",
    highlights: ["چاپ حرفه‌ای", "جلد سخت", "بسته‌بندی هدیه"],
  },
];

export type SliderProduct = {
  id: string;
  templateId: string;
  series: string;
  badge?: string;
  title: string;
  tagline: string;
  price: string;
  reviews: number;
  visual: "closed" | "open";
  cover: string;
  accent: string;
  coverTitle: string;
  coverMeta: string;
};

export const sliderProducts: SliderProduct[] = [
  {
    id: "summer-north",
    templateId: "travel-minimal",
    series: "سری تابستان",
    badge: "جدید",
    title: "کتاب عکس شخصی",
    tagline: "لحظه‌های آفتابی‌ات، ذخیره و ماندگار",
    price: "۱٬۴۹۰٬۰۰۰",
    reviews: 17,
    visual: "closed",
    cover: "#f3b7c4",
    accent: "#fff6f3",
    coverTitle: "تابستان ۱۴۰۵",
    coverMeta: "شمال",
  },
  {
    id: "yazd-trip",
    templateId: "travel-premium",
    series: "سری سفر",
    title: "کتاب عکس شخصی",
    tagline: "کوچه‌های خشت و آفتاب، یک‌جا جمع",
    price: "۱٬۶۹۰٬۰۰۰",
    reviews: 24,
    visual: "closed",
    cover: "#f4efe8",
    accent: "#c45c48",
    coverTitle: "یزد ۱۴۰۴",
    coverMeta: "سفر",
  },
  {
    id: "open-spread",
    templateId: "family-table",
    series: "سری خانواده",
    title: "کتاب عکس شخصی",
    tagline: "صفحه‌ها را ورق بزن؛ خاطره زنده می‌شود",
    price: "۱٬۵۴۰٬۰۰۰",
    reviews: 31,
    visual: "open",
    cover: "#efe7dc",
    accent: "#c45c48",
    coverTitle: "خانواده",
    coverMeta: "باز",
  },
  {
    id: "our-story-slide",
    templateId: "our-story",
    series: "سری عاشقانه",
    title: "کتاب عکس شخصی",
    tagline: "داستان دونفره، جلد سخت و ماندگار",
    price: "۱٬۶۹۰٬۰۰۰",
    reviews: 19,
    visual: "closed",
    cover: "#e7c1bb",
    accent: "#7f9b8f",
    coverTitle: "داستان ما",
    coverMeta: "سالگرد",
  },
  {
    id: "first-year-slide",
    templateId: "first-year",
    series: "سری کودک",
    badge: "پرفروش",
    title: "کتاب عکس شخصی",
    tagline: "اولین لبخندها، از گوشی به کاغذ",
    price: "۱٬۵۹۰٬۰۰۰",
    reviews: 42,
    visual: "closed",
    cover: "#f0d48a",
    accent: "#8ca7a2",
    coverTitle: "سال اول",
    coverMeta: "کودک",
  },
  {
    id: "family-table-slide",
    templateId: "family-table",
    series: "سری خانواده",
    title: "کتاب عکس شخصی",
    tagline: "دورهمی‌های ساده، شایسته‌ی یک کتاب",
    price: "۱٬۵۴۰٬۰۰۰",
    reviews: 12,
    visual: "open",
    cover: "#d5ddc8",
    accent: "#c96752",
    coverTitle: "میز خانواده",
    coverMeta: "خانه",
  },
  {
    id: "travel-premium-slide",
    templateId: "travel-premium",
    series: "سری سفر",
    title: "کتاب عکس شخصی",
    tagline: "سفرهای بلند، جلد خاص و کاغذ ضخیم",
    price: "۲٬۱۹۰٬۰۰۰",
    reviews: 8,
    visual: "closed",
    cover: "#8fb3af",
    accent: "#f3e6c8",
    coverTitle: "جاده",
    coverMeta: "پریمیوم",
  },
];

export const shopCollections = [
  { href: "/create", label: "سری سفر" },
  { href: "/create", label: "سری عاشقانه" },
  { href: "/create", label: "سری کودک" },
  { href: "/create", label: "سری خانواده" },
  { href: "/create/templates", label: "همه قالب‌ها" },
];

export const howSteps = [
  { n: "۰۱", title: "قالب را انتخاب کن", text: "یک جلد آماده بردار یا از صفر شروع کن. اپ لازم نیست." },
  { n: "۰۲", title: "عکس‌هایت را بگذار", text: "از گوشی یا لپ‌تاپ آپلود کن؛ چیدمان اولیه سریع ساخته می‌شود." },
  { n: "۰۳", title: "کتاب را مال خودت کن", text: "فونت، رنگ، صفحه و متن را عوض کن؛ بعد پیش‌نمایش را ببین و سفارش بده." },
];

export const brandValues = [
  { title: "لحظه‌هایی که می‌مانند", text: "عکس‌های گوشی به کتابی تبدیل می‌شوند که می‌شود ورق زد و نگه داشت." },
  { title: "برای دوست‌داشته شدن", text: "روی میز می‌ماند، نه در گالری. طراحی‌شده برای دیده شدن و ورق خوردن." },
  { title: "داستان تو، به سبک تو", text: "قالب آماده هست؛ ولی هر صفحه، رنگ و متن قابل تغییر است." },
  { title: "از آدم‌ها و جاها", text: "سفر، خانواده، عشق و کودک؛ عکستوری برای پیوند آدم‌ها با خاطره‌هاست." },
];

export const benefits = [
  { title: "چاپ دقیق و واقعی", text: "همان چیزی که روی صفحه می‌بینی چاپ می‌شود؛ رنگ‌ها و جزئیات عکس روی کاغذ ضخیم." },
  { title: "جلد سخت ماندگار", text: "کتابی برای ورق زدن هر روز، نه بایگانی در گوشی. صحافی محکم و کاغذ باکیفیت." },
  { title: "مناسب هدیه", text: "بسته‌بندی تمیز، بدون فاکتور داخل بسته؛ آمادهٔ دادن به کسی که دوستش داری." },
];

export const qualityHighlights = [
  "چاپ حرفه‌ای روی کاغذ ضخیم",
  "جلد سخت و صحافی مقاوم",
  "پیش‌نمایش کامل قبل از سفارش",
  "ارسال به سراسر ایران",
];

export const testimonials = [
  {
    quote: "عکس‌های سفر شمال را از گوشی درآوردیم و در کمتر از یک ربع کتاب شد. کیفیت چاپ از چیزی که انتظار داشتم بهتر بود.",
    name: "نگار ر.",
    city: "تهران",
  },
  {
    quote: "برای سالگرد یک کتاب دونفره ساختم. قالب آماده بود، فقط عکس‌ها را چیدم. هدیه‌ای شد که واقعاً ورق می‌زنیم.",
    name: "امیرحسین ک.",
    city: "اصفهان",
  },
  {
    quote: "اولین سال دخترمان را به کتاب تبدیل کردیم. مسیر ساخت ساده بود و قبل از چاپ همه صفحات را دیدم.",
    name: "مریم ش.",
    city: "شیراز",
  },
];

export const faqs: [string, string][] = [
  ["ساخت کتاب چقدر زمان می‌برد؟", "با قالب‌های آماده می‌توانی نسخه‌ی اولیه کتاب را در کمتر از ۱۰ دقیقه بسازی و بعد جزئیاتش را ویرایش کنی."],
  ["اگر کیفیت عکسی کم باشد چه می‌شود؟", "پیش از سفارش، عکس‌های کم‌کیفیت علامت‌گذاری می‌شوند تا بتوانی آن‌ها را جایگزین کنی."],
  ["آیا قبل از چاپ، همه صفحات را می‌بینم؟", "بله؛ پیش‌نمایش جلد و تمام صفحات قبل از ثبت سفارش در دسترس خواهد بود."],
  ["عکس‌های من امن می‌مانند؟", "در نسخه نهایی، تصاویر به‌صورت خصوصی نگهداری می‌شوند و فقط برای ساخت و چاپ سفارش قابل استفاده‌اند."],
];
