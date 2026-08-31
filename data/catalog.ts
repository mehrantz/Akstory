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

export const howSteps = [
  { n: "۰۱", title: "انتخاب عکس‌ها", text: "عکس‌های گوشی‌ات را انتخاب و مرتب کن." },
  { n: "۰۲", title: "ساخت داستان تصویری", text: "قالب و چیدمان را بساز و متن اضافه کن." },
  { n: "۰۳", title: "دریافت کتاب", text: "پیش‌نمایش را ببین، سفارش بده و کتاب را تحویل بگیر." },
];

export const benefits = [
  { title: "طراحی آسان", text: "بدون دانش طراحی، در چند دقیقه پیش‌نمایش کتابت را ببین." },
  { title: "کیفیت چاپ حرفه‌ای", text: "کنترل کیفیت عکس و چاپ دقیق قبل از ارسال." },
  { title: "خاطرات ماندگار", text: "عکس‌ها از گالری گوشی به کتابی برای ورق زدن تبدیل می‌شوند." },
];

export const faqs: [string, string][] = [
  ["ساخت کتاب چقدر زمان می‌برد؟", "با قالب‌های آماده می‌توانی نسخه‌ی اولیه کتاب را در کمتر از ۱۰ دقیقه بسازی و بعد جزئیاتش را ویرایش کنی."],
  ["اگر کیفیت عکسی کم باشد چه می‌شود؟", "پیش از سفارش، عکس‌های کم‌کیفیت علامت‌گذاری می‌شوند تا بتوانی آن‌ها را جایگزین کنی."],
  ["آیا قبل از چاپ، همه صفحات را می‌بینم؟", "بله؛ پیش‌نمایش جلد و تمام صفحات قبل از ثبت سفارش در دسترس خواهد بود."],
  ["عکس‌های من امن می‌مانند؟", "در نسخه نهایی، تصاویر به‌صورت خصوصی نگهداری می‌شوند و فقط برای ساخت و چاپ سفارش قابل استفاده‌اند."],
];
