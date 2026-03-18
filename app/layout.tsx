import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import UnifiedNavbar from "@/components/UnifiedNavbar/UnifiedNavbar";
import { ThemeProvider } from "@/components/ThemeToggle/theme-provider";
import Loading from "@/components/LoadingPage";
import HydrationReady from "@/components/HydrationReady";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Growth Equity",
  description: "Institutional-Grade Finance Infrastructure for VC-Backed Software Companies",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClerkProvider dynamic>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <HydrationReady>
               
                <Suspense fallback={<Loading />}>
                  {children}
                </Suspense>
              </HydrationReady>
            </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}