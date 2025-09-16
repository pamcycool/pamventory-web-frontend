import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

// Configure Product Sans font with all variants
const productSans = localFont({
  src: [
    {
      path: "../../fonts/Product Sans Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/Product Sans Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../fonts/Product Sans Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../fonts/Product Sans Bold Italic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-product-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pamventory",
  description: "An AI powered Inventory Management for Nigerian SMEs Retailers",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {

  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Load messages for the current locale
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`${productSans.variable} ${productSans.className} antialiased`}
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
          </NextIntlClientProvider>
        </GoogleOAuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
