"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/#leistungen", label: "Leistungen" },
  { href: "/#ueber-uns", label: "Über uns" },
  { href: "/termin", label: "Termin" },
  { href: "/crm", label: "CRM" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isCrm = pathname.startsWith("/crm");

  if (isCrm) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-fg">
          MOTORHALLE
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-fg-muted transition hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/termin" className="btn-primary !py-2.5 !px-4 text-sm">
            Termin buchen
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden text-fg"
          aria-label="Menü"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg-elevated px-5 py-4 md:hidden animate-fade-in">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-fg-muted"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/termin"
              className="btn-primary mt-2 text-center text-sm"
              onClick={() => setOpen(false)}
            >
              Termin buchen
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
