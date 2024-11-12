import { AuthProvider } from '@/components/provider/auth-provider';
import ReactQueryProvider from '@/components/provider/react-query-provider';
import { ThemeProvider } from '@/components/provider/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { baseOpenGraph } from '@/shareMetadata';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export function generateMetadata(): Metadata {
  return {
    title: { template: `%s | Tannrest`, default: 'Tannrest' },
    description: 'Phục vụ đồ ăn và thức uống',
    authors: [{ name: 'TanLe', url: 'https://lenhattan.vn' }],
    creator: 'TanLe',
    publisher: 'TanLe',
    openGraph: { ...baseOpenGraph },
  };
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={'vi'} suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader
          showSpinner={false}
          color="hsl(var(--muted-foreground))"
        />
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ReactQueryProvider>
              {children}
              <Toaster />
            </ReactQueryProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
