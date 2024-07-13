import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campus Grader",
  description: "Your review is one's future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta name="google-adsense-account" content="ca-pub-1517362125342301"></meta>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1517362125342301"crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        {children}
        </body>
        
    </html>
  );
}
