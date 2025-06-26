import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/hooks/use-auth";

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const fontHeadline = Caveat({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-headline",
});

export const metadata: Metadata = {
  title: "EcoStep",
  description: "Understand and Reduce Your Environmental Impact.",
  manifest: "/manifest.json",
  icons: {
    apple: "https://placehold.co/180x180.png",
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f0e8' },
    { media: '(prefers-color-scheme: dark)', color: '#121829' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(fontBody.variable, fontHeadline.variable)}>
      <head />
      <body className={cn("font-body antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
