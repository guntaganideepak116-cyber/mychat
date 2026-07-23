import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter, Chakra_Petch, JetBrains_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/QueryProvider';
import { InstallBanner } from '@/components/InstallBanner';
import { clerkAppearance } from '@/lib/clerk';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--next-font-inter',
  display: 'swap',
});

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--next-font-chakra-petch',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--next-font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MyChat — Personal AI Assistant',
  description:
    'MyChat is your personal AI assistant. Ask anything, get streamed, intelligent answers.',
  authors: [{ name: 'MyChat' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MyChat',
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: 'MyChat — Personal AI Assistant',
    description: 'Your personal AI assistant. One AI. Every answer.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport = {
  themeColor: '#2E6FF6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const content = (
    <QueryProvider>
      <InstallBanner />
      {children}
      <Toaster />
    </QueryProvider>
  );

  return (
    <html
      lang="en"
      className={`${inter.variable} ${chakraPetch.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MyChat" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body>
        {clerkKey ? (
          <ClerkProvider publishableKey={clerkKey} appearance={clerkAppearance}>
            {content}
          </ClerkProvider>
        ) : (
          content
        )}
      </body>
    </html>
  );
}
