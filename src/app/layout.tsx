import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";

// Initialize the Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Dashboard GWNBR Pneumonia",
  description: "Visualisasi Model GWNBR untuk Kasus Pneumonia Balita di Pulau Jawa",
  keywords: "GWNBR, Pneumonia, Geographically Weighted Negative Binomial Regression, Spatial Statistics, Indonesia, Pulau Jawa",
  authors: [{ name: "Rafirs" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <footer className="bg-card py-6 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center text-muted-foreground text-sm">
                © 2023 Dashboard GWNBR Pneumonia | Created for Skripsi
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
