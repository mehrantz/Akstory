import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "عکستوری | ساخت و چاپ آنلاین کتاب عکس شخصی",
  description: "عکس‌های سفر، خانواده و لحظه‌های خاص خود را به یک کتاب داستانی شخصی و ماندگار تبدیل کنید.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}
