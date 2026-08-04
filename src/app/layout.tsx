import type { Metadata } from "next";
import { Barlow_Condensed, Figtree } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CrmProvider } from "@/lib/crm-context";
import "./globals.css";

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "AXION Gutachten · Unabhängiges Kfz-Sachverständigenbüro",
    template: "%s · AXION",
  },
  description:
    "Unabhängige Kfz-Gutachten: Unfallgutachten, Wertgutachten, Oldtimer und Beweissicherung – transparent, vor Ort und mit integriertem CRM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <CrmProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CrmProvider>
      </body>
    </html>
  );
}
