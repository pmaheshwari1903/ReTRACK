import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif, Public_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";

const publicSansHeading = Public_Sans({ subsets: ['latin'], variable: '--font-heading' });

const notoSerif = Noto_Serif({ subsets: ['latin'], variable: '--font-serif' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ReTrack · AI Code Reviewer",
    template: "%s · ReTrack",
  },
  description: "AI-powered code review and codebase indexing for GitHub repositories.",
  icons: {
    icon: [
      { url: "/retrack-logo.png", type: "image/png" },
    ],
    shortcut: "/retrack-logo.png",
    apple: "/retrack-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-serif", notoSerif.variable, publicSansHeading.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
