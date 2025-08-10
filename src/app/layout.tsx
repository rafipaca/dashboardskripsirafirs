import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navigation from "@/components/layout/Navigation";

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
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <Navigation />
            <div className="relative flex min-h-screen">
              {/* Main Content Area */}
              <main className="flex-1">
                <div className="min-h-screen">
                  {children}
                </div>
              </main>
            </div>
            
            {/* Footer */}
            <footer className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-center text-sm text-muted-foreground">
                    <p className="font-medium">Dashboard GWNBR Pneumonia</p>
                    <p className="text-xs mt-1">Visualisasi Model Geographically Weighted Negative Binomial Regression</p>
                  </div>
                  <div className="text-xs text-muted-foreground/70">
                    © 2025 • Created for Skripsi • Pulau Jawa, Indonesia
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
