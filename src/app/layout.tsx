import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const bookSans = Noto_Sans_KR({
  variable: "--font-book-sans",
  subsets: ["latin", "korean"],
  weight: ["400", "500", "600", "700"],
});

const bookSerif = Noto_Serif_KR({
  variable: "--font-book-serif",
  subsets: ["latin", "korean"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bookvoyage",
  description: "책 리뷰와 추천을 공유하는 커뮤니티.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${bookSans.variable} ${bookSerif.variable} antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
