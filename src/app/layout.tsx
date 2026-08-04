import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CrmProvider } from "@/lib/crm-context";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "MOTORHALLE · Meisterwerkstatt & CRM",
    template: "%s · MOTORHALLE",
  },
  description:
    "Autowerkstatt MOTORHALLE – Wartung, Diagnose und Reparatur mit integriertem Werkstatt-CRM für Kunden, Fahrzeuge, Termine und Aufträge.",
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
