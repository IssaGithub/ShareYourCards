"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

const nav = [
  { href: "/crm", label: "Übersicht", exact: true },
  { href: "/crm/anfragen", label: "Anfragen" },
  { href: "/crm/kunden", label: "Kunden" },
  { href: "/crm/fahrzeuge", label: "Fahrzeuge" },
  { href: "/crm/termine", label: "Termine" },
  { href: "/crm/gutachten", label: "Gutachten" },
];

export default function CrmLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href || pathname === href + "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <div className="min-h-screen bg-bg pt-0">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-line bg-bg-elevated transition-transform lg:static lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-5">
            <Link href="/crm" className="font-display text-lg font-extrabold">
              AXION · CRM
            </Link>
            <button
              type="button"
              className="lg:hidden text-fg-muted"
              onClick={() => setOpen(false)}
              aria-label="Menü schließen"
            >
              ✕
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive(item.href, item.exact)
                    ? "bg-accent-soft text-accent"
                    : "text-fg-muted hover:bg-bg-muted hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 inset-x-0 border-t border-line p-4">
            <Link href="/" className="text-sm text-fg-muted hover:text-accent">
              ← Zur Website
            </Link>
          </div>
        </aside>

        {open && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            aria-label="Overlay schließen"
            onClick={() => setOpen(false)}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-line bg-bg/90 px-5 backdrop-blur">
            <button
              type="button"
              className="lg:hidden text-fg"
              onClick={() => setOpen(true)}
              aria-label="Menü öffnen"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h16M3 11h16M3 16h16" />
              </svg>
            </button>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-fg-muted">
                Gutachten-CRM
              </p>
              <p className="font-display text-sm font-bold">AXION</p>
            </div>
            <Link href="/anfrage" className="btn-secondary !py-2 !px-3 text-xs">
              + Online-Anfrage
            </Link>
          </header>
          <div className="flex-1 p-5 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
