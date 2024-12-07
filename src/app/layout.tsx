import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import Script from "next/script";
 
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { JotaiProvider } from "@/components/jotai-provider";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ThemeProvider } from "@/contexts/theme-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'Explorez nos formations ',
  description: 'Découvrez notre catalogue complet de formations et commencez votre parcours d\'apprentissage dès aujourd\'hui.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <head>
          <Script src="https://cdn.fedapay.com/checkout.js?v=1.1.2" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        >
          <ThemeProvider>
            <ConvexClientProvider>
              <JotaiProvider>
              <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
              <Toaster />
              <Modals />
              <QueryProvider>
                <NuqsAdapter>{children}</NuqsAdapter>
              </QueryProvider>
              </JotaiProvider>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
