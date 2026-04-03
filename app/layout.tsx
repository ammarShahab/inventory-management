import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

import { ConvexClientProvider } from "@/components/web/ConvexClientProvider";
import { getToken } from "./lib/auth-server";
// import { TooltipProvider } from "@/components/ui/tooltip";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Inventory & Order Management",
  description: "Manage your inventory and orders efficiently",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-mono",
        jetbrainsMono.variable,
      )}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {/* <TooltipProvider> */}
        <ConvexClientProvider initialToken={token}>
          {children}
          <Toaster />
        </ConvexClientProvider>
        {/* </TooltipProvider> */}
      </body>
    </html>
  );
}
