
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                }).catch(function(err) {
                  console.log('Service Worker unregistration failed: ', err);
                });
              }
            `,
          }}
        />
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
