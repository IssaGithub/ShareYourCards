"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/crm")) return null;

  return (
    <footer className="border-t border-line bg-bg-elevated">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold">MOTORHALLE</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-fg-muted">
            Meisterwerkstatt für Diagnose, Wartung und Reparatur – präzise Arbeit
            mit modernem CRM für Ihren Service.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-fg-muted">
            Kontakt
          </p>
          <ul className="space-y-2 text-sm text-fg">
            <li>Industriestraße 24</li>
            <li>80339 München</li>
            <li>
              <a href="tel:+498912345678" className="hover:text-accent">
                +49 89 123 456 78
              </a>
            </li>
            <li>
              <a href="mailto:service@motorhalle.de" className="hover:text-accent">
                service@motorhalle.de
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-fg-muted">
            Öffnungszeiten
          </p>
          <ul className="space-y-2 text-sm text-fg">
            <li className="flex justify-between gap-4">
              <span>Mo – Fr</span>
              <span className="text-fg-muted">07:30 – 18:00</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Samstag</span>
              <span className="text-fg-muted">08:00 – 13:00</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Sonntag</span>
              <span className="text-fg-muted">geschlossen</span>
            </li>
          </ul>
          <Link href="/crm" className="mt-6 inline-block text-sm text-accent hover:underline">
            Zum Werkstatt-CRM →
          </Link>
        </div>
      </div>
      <div className="border-t border-line px-5 py-4 text-center text-xs text-fg-muted">
        © {new Date().getFullYear()} MOTORHALLE Autotechnik · Alle Rechte vorbehalten
      </div>
    </footer>
  );
}
