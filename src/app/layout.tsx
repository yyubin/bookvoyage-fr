import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import { AuthProvider } from "./components/AuthProvider";
import { getServerUser } from "./services/authServer";

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
  icons: {
    icon: [
      { url: "/bookvoyage_orange_v1.svg", type: "image/svg+xml" },
      { url: "/logo_v1.png", type: "image/png" },
    ],
    shortcut: "/logo_v1.png",
    apple: "/logo_v1.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialUser = await getServerUser();

  return (
    <html lang="ko">
      <body className={`${bookSans.variable} ${bookSerif.variable} antialiased`}>
        <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
