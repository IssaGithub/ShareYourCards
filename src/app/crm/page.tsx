"use client";

import Link from "next/link";
import { useCrm } from "@/lib/crm-context";
import { formatCurrency, formatDate } from "@/lib/types";
import { statusClass } from "@/components/crm-ui";

export default function CrmDashboard() {
  const { ready, data, resetData, getCustomer, getVehicle } = useCrm();

  if (!ready) {
    return <p className="text-fg-muted">CRM wird geladen…</p>;
  }

  const openOrders = data.workOrders.filter((w) => w.status !== "fertig" && w.status !== "storniert");
  const upcoming = [...data.appointments]
    .filter((a) => a.status === "geplant" || a.status === "bestätigt")
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, 5);

  const revenue = data.workOrders
    .filter((w) => w.status === "fertig")
    .reduce((sum, w) => sum + (w.actualCost || w.estimatedCost), 0);

  const stats = [
    { label: "Kunden", value: data.customers.length, href: "/crm/kunden" },
    { label: "Fahrzeuge", value: data.vehicles.length, href: "/crm/fahrzeuge" },
    { label: "Offene Aufträge", value: openOrders.length, href: "/crm/auftraege" },
    { label: "Umsatz (fertig)", value: formatCurrency(revenue), href: "/crm/auftraege" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Übersicht</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Willkommen im MOTORHALLE Werkstatt-CRM
          </p>
        </div>
        <button type="button" className="btn-secondary !py-2 text-xs" onClick={resetData}>
          Demo-Daten zurücksetzen
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="animate-fade-up border border-line bg-bg-elevated p-5 transition hover:border-accent/50"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <p className="text-xs uppercase tracking-wider text-fg-muted">{stat.label}</p>
            <p className="font-display mt-2 text-3xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Nächste Termine</h2>
            <Link href="/crm/termine" className="text-sm text-accent hover:underline">
              Alle →
            </Link>
          </div>
          <div className="space-y-2">
            {upcoming.length === 0 && (
              <p className="text-sm text-fg-muted">Keine anstehenden Termine.</p>
            )}
            {upcoming.map((apt) => {
              const customer = getCustomer(apt.customerId);
              const vehicle = getVehicle(apt.vehicleId);
              return (
                <div
                  key={apt.id}
                  className="flex flex-wrap items-center justify-between gap-3 border border-line bg-bg-elevated px-4 py-3"
                >
                  <div>
                    <p className="font-medium">
                      {formatDate(apt.date)} · {apt.time}
                    </p>
                    <p className="text-sm text-fg-muted">
                      {customer?.name} · {vehicle?.make} {vehicle?.model}
                    </p>
                    <p className="text-xs text-fg-muted">{apt.service}</p>
                  </div>
                  <span className={`badge ${statusClass(apt.status)}`}>{apt.status}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Aktive Aufträge</h2>
            <Link href="/crm/auftraege" className="text-sm text-accent hover:underline">
              Alle →
            </Link>
          </div>
          <div className="space-y-2">
            {openOrders.slice(0, 5).map((wo) => {
              const customer = getCustomer(wo.customerId);
              const vehicle = getVehicle(wo.vehicleId);
              return (
                <div
                  key={wo.id}
                  className="flex flex-wrap items-center justify-between gap-3 border border-line bg-bg-elevated px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{wo.title}</p>
                    <p className="text-sm text-fg-muted">
                      {customer?.name} · {vehicle?.plate}
                    </p>
                    <p className="text-xs text-fg-muted">
                      ca. {formatCurrency(wo.estimatedCost)}
                    </p>
                  </div>
                  <span className={`badge ${statusClass(wo.status)}`}>{wo.status}</span>
                </div>
              );
            })}
            {openOrders.length === 0 && (
              <p className="text-sm text-fg-muted">Keine offenen Aufträge.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
