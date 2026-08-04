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
          <p className="font-display text-2xl font-extrabold">AXION</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-fg-muted">
            Unabhängiges Kfz-Sachverständigenbüro für Schadengutachten,
            Wertgutachten und Beweissicherung – mit integriertem CRM.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-fg-muted">
            Kontakt
          </p>
          <ul className="space-y-2 text-sm text-fg">
            <li>Sachverständigenweg 9</li>
            <li>80339 München</li>
            <li>
              <a href="tel:+498976543210" className="hover:text-accent">
                +49 89 765 432 10
              </a>
            </li>
            <li>
              <a href="mailto:kontakt@axion-gutachten.de" className="hover:text-accent">
                kontakt@axion-gutachten.de
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-fg-muted">
            Erreichbarkeit
          </p>
          <ul className="space-y-2 text-sm text-fg">
            <li className="flex justify-between gap-4">
              <span>Mo – Fr</span>
              <span className="text-fg-muted">08:00 – 18:00</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Samstag</span>
              <span className="text-fg-muted">nach Vereinbarung</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Vor-Ort-Service</span>
              <span className="text-fg-muted">bundesweit / Region</span>
            </li>
          </ul>
          <Link href="/crm" className="mt-6 inline-block text-sm text-accent hover:underline">
            Zum Gutachten-CRM →
          </Link>
        </div>
      </div>
      <div className="border-t border-line px-5 py-4 text-center text-xs text-fg-muted">
        © {new Date().getFullYear()} AXION Gutachten · Unabhängiges Sachverständigenbüro
      </div>
    </footer>
  );
}
