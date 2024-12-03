import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
 
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
  title: "Formation - Your Learning Platform for the Future",
  description: "Formation is your learning platform for the future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        >
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
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
