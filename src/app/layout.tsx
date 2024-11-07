import Footer from '@/components/_client/Footer';
import { AuthProvider } from '@/components/provider/auth-provider';
import ReactQueryProvider from '@/components/provider/react-query-provider';
import { ThemeProvider } from '@/components/provider/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { baseOpenGraph } from '@/shareMetadata';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('home');
  return {
    title: { template: `%s | ${t('title')}`, default: t('title') },
    description: t('description'),
    authors: [{ name: 'TanLe', url: 'https://lenhattan.vn' }],
    creator: 'TanLe',
    publisher: 'TanLe',
    openGraph: { ...baseOpenGraph },
  };
}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader
          showSpinner={false}
          color="hsl(var(--muted-foreground))"
        />

        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ReactQueryProvider>
                {children}
                <Footer />

                <Toaster />
              </ReactQueryProvider>
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
