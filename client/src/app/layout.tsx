import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import Navbar from "@/components/custom-components/Navbar";
import ThemeContextProvider from "@/context/themecontext";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

// const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Spectrum Sense",
  description:
    "Made with ❤️ by Kartikeya Mishra, Rylan Lewis & Mustafa Motiwala",
  manifest: '/manifest.webmanifest'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeContextProvider>
            <Navbar />
            {children}
            <Toaster />
          </ThemeContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
