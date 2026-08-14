import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gyojeong.vercel.app"),
  title: {
    default: "교정 | GYOJEONG",
    template: "%s | 교정",
  },
  description: "인디팝/로파이 밴드 교정의 공식 웹사이트. 공연 일정, 음악, 갤러리.",
  keywords: "교정, GYOJEONG, 밴드, 인디팝, 로파이, 공연, 라이브",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "교정",
    title: "교정 | GYOJEONG",
    description: "인디팝/로파이 밴드 교정의 공식 웹사이트",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
