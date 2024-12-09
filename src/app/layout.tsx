import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { SpeedInsights } from '@vercel/speed-insights/next';

import Script from "next/script";
import { Analytics } from "@vercel/analytics/react"
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
import { LoadingProvider } from "@/providers/loading-provider";
import { InitialLoader } from "@/components/initial-loader";

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
  title: 'Invest Mastery Mind | Bienvenue',
  description: 'Bienvenue sur la plateforme d\'apprentissage d\'Invest Mastery Mind. Notre objectif est de vous donner les outils nécessaires pour devenir un investisseur maîtrisé.',
  metadataBase: new URL('https://investmasterymind.pro'),
  generator: 'Invest Mastery Mind',
  applicationName: 'Invest Mastery Mind',
  referrer: 'origin-when-cross-origin',
  keywords: [ 'signale', 'Trading', 'Investissement', 'Bourse', 'Finance', 'Analyse technique', 'Analyse fondamentale', 'Marchés financiers', 'Trading en ligne', 'Formation trading'],
  authors: [{ name: 'Invest Mastery Mind' }, { name: 'Invest Mastery Mind', url: 'https://investmasterymind.pro' }],
  creator: 'Invest Mastery Mind',
  publisher: 'Invest Mastery Mind',
  robots: 'index, follow',
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/fr-FR',
      'en-US': '/en-US',
    },
  },
  openGraph: {
    images: '/logo.svg',
  },
  
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
    other: {
      rel: 'apple-touch-icon',
      url: '/logo.svg',
    },
  },
  manifest: '/manifest.json',
  twitter: {
    card: 'summary',
    title: 'Plateforme d\'apprentissage | Invest Mastery Mind',
    description: 'Bienvenue sur la plateforme d\'apprentissage d\'Invest Mastery Mind. Notre objectif est de vous donner les outils nécessaires pour devenir un investisseur maîtrisé.',
    creator: '@investmasterymind',
    creatorId: 'investmasterymind',
    images: ['/logo.svg'],
  },
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
          <Script id="register-sw" strategy="afterInteractive">
            {`
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker enregistré avec succès:', registration.scope);
                    },
                    function(err) {
                      console.log('Échec de l\'enregistrement du Service Worker:', err);
                    }
                  );
                });
              }
            `}
          </Script>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider>
            <ConvexClientProvider>
              <JotaiProvider>
                <LoadingProvider>
                  <InitialLoader />
                  <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
                  <Toaster />
                  <Modals />
                  <QueryProvider>
                    <NuqsAdapter>
                      {children}
                      <Analytics />
                      <SpeedInsights />
                    </NuqsAdapter>
                  </QueryProvider>
                </LoadingProvider>
              </JotaiProvider>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
