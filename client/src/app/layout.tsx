import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import Navbar from "@/components/custom-components/Navbar";
import ThemeContextProvider from "@/context/themecontext";
import { Toaster } from "@/components/ui/sonner"

// const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Spectrum Sense",
  description:
    "Made with ❤️ by Rylan Lewis, Mustafa Motiwala & Kartikeya Mishra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("dark", poppins.className)}>
        <ThemeContextProvider>
          <Navbar />
          {children}
          <Toaster />
        </ThemeContextProvider>
      </body>
    </html>
  );
}
