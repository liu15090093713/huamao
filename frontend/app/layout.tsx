import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "今晚花毛｜现煮花生毛豆",
  description: "当天挑、当天洗、当天煮，把一盆热气送到附近人的夜晚。",
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
