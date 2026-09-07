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
  image?: string;
  series?: string;
  reviews?: number;
  badge?: string;
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
    image: "/images/shop/travel-series.png",
    series: "سری سفر",
    reviews: 32,
    badge: "محبوب",
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
    image: "/images/shop/romance-series.png",
    series: "سری عاشقانه",
    reviews: 24,
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
    image: "/images/shop/baby-series.png",
    series: "سری کودک",
    reviews: 42,
    badge: "پرفروش",
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
    image: "/images/shop/family-series.png",
    series: "سری خانواده",
    reviews: 28,
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
    image: "/images/shop/travel-series.png",
    series: "سری سفر پریمیوم",
    reviews: 18,
  },
  {
    id: "celebration",
    title: "جشنِ به‌یادماندنی",
    subtitle: "تولدها و شب‌هایی که تکرار نمی‌شوند",
    category: "جشن",
    style: "Celebration",
    usage: "تولد و دورهمی",
    color: "#174b87",
    accent: "#eb8f91",
    price: "۱٬۶۴۰٬۰۰۰",
    image: "/images/shop/celebration-series.png",
    series: "سری جشن",
    reviews: 16,
    badge: "جدید",
  },
  {
    id: "everyday-journal",
    title: "روزهای معمولی",
    subtitle: "خاطره‌های کوچک از جریان زندگی",
    category: "روزمره",
    style: "Everyday Journal",
    usage: "لحظه‌های روزمره",
    color: "#e9dfd1",
    accent: "#3f3a35",
    price: "۱٬۴۹۰٬۰۰۰",
    image: "/images/shop/everyday-series.png",
    series: "سری روزمره",
    reviews: 12,
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
  visual: "closed" | "open" | "mockup";
  cover: string;
  accent: string;
  coverTitle: string;
  coverMeta: string;
  image?: string;
};

export const sliderProducts: SliderProduct[] = [
  {
    id: "shiraz",
    templateId: "travel-minimal",
    series: "کتاب آماده",
    title: "کتاب شیراز",
    tagline: "زیبایی شعر، باغ و تاریخ شیراز در قالب یک کتاب عکس ماندگار.",
    price: "۱٬۴۹۰٬۰۰۰",
    reviews: 32,
    visual: "mockup",
    cover: "#b8ddd9",
    accent: "#3d7a8c",
    coverTitle: "شیراز",
    coverMeta: "کتاب عکس",
    image: "/images/templates/shiraz-preview.png",
  },
  {
    id: "yazd",
    templateId: "travel-premium",
    series: "کتاب آماده",
    title: "کتاب یزد",
    tagline: "روایت تصویری شهر بادگیرها؛ ترکیبی از هنر، معماری و خاطرات ایرانی.",
    price: "۱٬۴۹۰٬۰۰۰",
    reviews: 24,
    visual: "mockup",
    cover: "#f4efe8",
    accent: "#c45c48",
    coverTitle: "یزد",
    coverMeta: "کتاب عکس",
    image: "/images/templates/yazd-preview.png",
  },
  {
    id: "kish",
    templateId: "travel-minimal",
    series: "کتاب آماده",
    title: "کتاب کیش",
    tagline: "جزیره آفتاب",
    price: "۱٬۴۹۰٬۰۰۰",
    reviews: 18,
    visual: "mockup",
    cover: "#b8ddd9",
    accent: "#3d7a8c",
    coverTitle: "کیش",
    coverMeta: "جزیره آفتاب",
    image: "/images/templates/kish-preview.jpg",
  },
  {
    id: "kashan",
    templateId: "travel-minimal",
    series: "کتاب آماده",
    title: "کتاب کاشان",
    tagline: "شهر گل و گلاب",
    price: "۱٬۴۹۰٬۰۰۰",
    reviews: 21,
    visual: "mockup",
    cover: "#efdcd6",
    accent: "#c45c48",
    coverTitle: "کاشان",
    coverMeta: "شهر گل و گلاب",
    image: "/images/templates/kashan-preview.jpg",
  },
  {
    id: "tehran",
    templateId: "travel-minimal",
    series: "کتاب آماده",
    title: "کتاب تهران",
    tagline: "پایتخت همیشه بیدار",
    price: "۱٬۴۹۰٬۰۰۰",
    reviews: 27,
    visual: "mockup",
    cover: "#c5d4e2",
    accent: "#3d5a7a",
    coverTitle: "تهران",
    coverMeta: "پایتخت همیشه بیدار",
    image: "/images/templates/tehran-preview.jpg",
  },
  {
    id: "mazandaran",
    templateId: "travel-minimal",
    series: "کتاب آماده",
    title: "کتاب مازندران",
    tagline: "جنگل و دریا",
    price: "۱٬۴۹۰٬۰۰۰",
    reviews: 19,
    visual: "mockup",
    cover: "#d7e6e2",
    accent: "#5a7a72",
    coverTitle: "مازندران",
    coverMeta: "جنگل و دریا",
    image: "/images/templates/mazandaran-preview.jpg",
  },
  {
    id: "rasht",
    templateId: "travel-minimal",
    series: "کتاب آماده",
    title: "کتاب رشت",
    tagline: "شهر باران",
    price: "۱٬۴۹۰٬۰۰۰",
    reviews: 16,
    visual: "mockup",
    cover: "#c5d4c8",
    accent: "#4a6a5a",
    coverTitle: "رشت",
    coverMeta: "شهر باران",
    image: "/images/templates/rasht-preview.jpg",
  },
  {
    id: "mashhad",
    templateId: "travel-minimal",
    series: "کتاب آماده",
    title: "کتاب مشهد",
    tagline: "پایتخت معنوی",
    price: "۱٬۴۹۰٬۰۰۰",
    reviews: 22,
    visual: "mockup",
    cover: "#f3ead4",
    accent: "#c4a35a",
    coverTitle: "مشهد",
    coverMeta: "پایتخت معنوی",
    image: "/images/templates/mashhad-preview.jpg",
  },
];

export const shopTemplates: TemplateItem[] = sliderProducts.map((item) => ({
  id: item.id,
  title: item.title,
  subtitle: item.tagline,
  category: "سفر",
  style: "Travel Series",
  usage: "سفر و شهرهای ایران",
  color: item.cover,
  accent: item.accent,
  price: item.price,
  image: item.image,
  series: item.series,
  reviews: item.reviews,
  badge: item.badge,
}));

export function getTemplateById(id: string) {
  return shopTemplates.find((template) => template.id === id) ?? templates.find((template) => template.id === id);
}

export const shopCollections = [
  { href: "/create", label: "سری سفر" },
  { href: "/create", label: "سری عاشقانه" },
  { href: "/create", label: "سری کودک" },
  { href: "/create", label: "سری خانواده" },
  { href: "/create/templates", label: "همه قالب‌ها" },
];

export const howSteps = [
  { n: "۰۱", title: "انتخاب یک قالب زیبا", text: "از میان طراحی‌های آماده، سبک مورد علاقه‌ات را انتخاب کن." },
  { n: "۰۲", title: "عکس‌هایت را اضافه کن", text: "عکس‌ها را آپلود کن و با ابزار هوشمند یا دستی کتابت را بساز." },
  { n: "۰۳", title: "کتابت آماده چاپ می‌شود", text: "پس از تایید نهایی، کتاب خاطراتت با کیفیت بالا آماده می‌شود." },
];

export const brandValues = [
  { title: "طراحی کاملاً شخصی", text: "عکس‌ها، ترتیب صفحات و جزئیات کتاب مطابق سلیقه تو ساخته می‌شود." },
  { title: "ساخت آسان با کمک هوشمند", text: "با چند کلیک عکس‌هایت را تبدیل به یک کتاب اولیه کن." },
  { title: "کیفیتی برای نگهداری خاطرات", text: "چاپ حرفه‌ای برای اینکه خاطراتت سال‌ها باقی بمانند." },
  { title: "هر عکس یک داستان دارد", text: "کمک می‌کنیم این داستان‌ها در قالب یک کتاب زیبا برای همیشه بمانند." },
];

export const benefits = [
  { title: "هدیه‌ای که فراموش نمی‌شود", text: "یک خاطره شخصی بساز؛ هدیه‌ای متفاوت برای عزیزانی که دوستشان دارید." },
  { title: "کیفیتی برای سال‌ها", text: "چاپ حرفه‌ای، جلد مقاوم و طراحی شده برای نگهداری خاطرات ارزشمند." },
  { title: "چاپ با کیفیت استودیویی", text: "رنگ‌ها، جزئیات و تصاویر شما با دقت بالا چاپ می‌شوند." },
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
  ["چگونه کتابم را بسازم؟", "عکس‌هایت را انتخاب کن، قالب موردنظر را انتخاب کن و کتابت را شخصی‌سازی کن."],
  ["چند عکس می‌توانم اضافه کنم؟", "بسته به نوع کتاب، می‌توانی تعداد زیادی عکس اضافه کنی و بهترین تصاویر را انتخاب کنی."],
  ["آیا امکان ویرایش صفحات وجود دارد؟", "بله، قبل از سفارش می‌توانی تمام صفحات، تصاویر و متن‌ها را تغییر دهی."],
  ["زمان آماده شدن کتاب چقدر است؟", "پس از تایید نهایی، کتاب برای چاپ آماده و ارسال می‌شود."],
];
