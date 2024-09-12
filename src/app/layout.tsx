import ReactQueryProvider from "@/components/provider/react-query-provider";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/provider/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Order food",
  description: "Taan FOOD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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
