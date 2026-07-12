import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import { ToastProvider } from "@/components/Toast";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Detective Academy | Gemini 3",
  description: "An AI-powered immersive detective investigation simulator.",
  applicationName: "Detective Academy",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Detective Academy",
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#1c140d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <ToastProvider>
          <GameProvider>
            <div className="appShell">
              {children}
              <Footer />
            </div>
          </GameProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
