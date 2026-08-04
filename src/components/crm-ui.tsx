"use client";

import type { ReactNode } from "react";

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 animate-fade-in"
        aria-label="Schließen"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg animate-fade-up border border-line bg-bg-elevated p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-fg-muted hover:text-fg"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-line px-6 py-12 text-center text-fg-muted">
      {message}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function statusClass(status: string): string {
  const map: Record<string, string> = {
    offen: "status-offen",
    "in-arbeit": "status-in-arbeit",
    fertig: "status-fertig",
    storniert: "status-storniert",
    geplant: "status-geplant",
    bestätigt: "status-geplant",
    erledigt: "status-fertig",
  };
  return map[status] || "status-offen";
}
