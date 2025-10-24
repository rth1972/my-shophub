import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QuickViewModalProvider } from "@/app/context/QuickViewModalContext";
import QuickViewModal from "@/components/Common/QuickViewModal";
import { AppProvider } from '@/app/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from "@/components/Common/ScrollToTop";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carol's Closet",
  description: "Pre-loved Treasures & Vintage Finds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <AppProvider>
               <Toaster position="top-right" />
              <Header />
              
       <QuickViewModalProvider>
        {children}
        <QuickViewModal />
        </QuickViewModalProvider>
        <Footer />
        </AppProvider>
        <ScrollToTop />
      </body>
    </html>
  );
}
