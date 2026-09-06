import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "عکستوری | ساخت و چاپ آنلاین کتاب عکس شخصی",
  description: "عکس‌های سفر، خانواده و لحظه‌های خاص خود را به یک کتاب داستانی شخصی و ماندگار تبدیل کنید.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
