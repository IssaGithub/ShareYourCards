"use client";

import { FormEvent, useMemo, useState } from "react";
import { EmptyState, Modal, PageHeader, statusClass } from "@/components/crm-ui";
import { useCrm } from "@/lib/crm-context";
import { formatDate, GUTACHTEN_TYPES, type LeadStatus } from "@/lib/types";

const statuses: LeadStatus[] = [
  "neu",
  "kontaktiert",
  "qualifiziert",
  "gewonnen",
  "verloren",
];

export default function AnfragenPage() {
  const { ready, data, addLead, updateLead, deleteLead, convertLead } = useCrm();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>("alle");

  const filtered = useMemo(() => {
    const list = [...data.leads];
    if (filter === "alle") return list;
    return list.filter((l) => l.status === filter);
  }, [data.leads, filter]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      gutachtenType: String(fd.get("gutachtenType") || ""),
      message: String(fd.get("message") || "").trim(),
      vehicleInfo: String(fd.get("vehicleInfo") || "").trim(),
      status: "neu" as LeadStatus,
    };
    if (!payload.name || !payload.email || !payload.phone || !payload.gutachtenType) return;
    addLead(payload);
    setOpen(false);
  }

  if (!ready) return <p className="text-fg-muted">Laden…</p>;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Anfragen"
        subtitle={`${data.leads.length} Leads aus Website & CRM`}
        action={
          <button type="button" className="btn-primary !py-2.5 text-sm" onClick={() => setOpen(true)}>
            + Anfrage
          </button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {["alle", ...statuses].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === s
                ? "bg-accent text-white"
                : "bg-bg-muted text-fg-muted hover:text-fg"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="Keine Anfragen vorhanden." />
      ) : (
        <div className="grid gap-3">
          {filtered.map((lead) => (
            <article key={lead.id} className="border border-line bg-bg-elevated p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold">{lead.name}</h3>
                  <p className="mt-1 text-sm text-fg-muted">
                    {lead.email} · {lead.phone}
                  </p>
                  <p className="mt-1 text-sm font-medium">{lead.gutachtenType}</p>
                  {lead.vehicleInfo && (
                    <p className="text-xs text-fg-muted">{lead.vehicleInfo}</p>
                  )}
                </div>
                <span className={`badge ${statusClass(lead.status)}`}>{lead.status}</span>
              </div>
              {lead.message && (
                <p className="mt-3 text-sm text-fg-muted">{lead.message}</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-fg-muted">
                <span>Eingang: {formatDate(lead.createdAt)}</span>
                {lead.convertedCustomerId && <span>Als Kunde übernommen</span>}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <select
                  className="input-field !w-auto !py-1.5 text-xs"
                  value={lead.status}
                  onChange={(e) =>
                    updateLead(lead.id, { status: e.target.value as LeadStatus })
                  }
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {!lead.convertedCustomerId && (
                  <button
                    type="button"
                    className="text-sm text-success hover:underline"
                    onClick={() => convertLead(lead.id)}
                  >
                    Als Kunde übernehmen
                  </button>
                )}
                <button
                  type="button"
                  className="text-sm text-danger hover:underline"
                  onClick={() => {
                    if (confirm("Anfrage löschen?")) deleteLead(lead.id);
                  }}
                >
                  Löschen
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={open} title="Neue Anfrage" onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="name" className="input-field" placeholder="Name *" required />
          <input name="email" type="email" className="input-field" placeholder="E-Mail *" required />
          <input name="phone" className="input-field" placeholder="Telefon *" required />
          <select name="gutachtenType" className="input-field" required defaultValue="">
            <option value="" disabled>
              Gutachtenart *
            </option>
            {GUTACHTEN_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input name="vehicleInfo" className="input-field" placeholder="Fahrzeuginfo" />
          <textarea
            name="message"
            className="input-field resize-y"
            rows={3}
            placeholder="Nachricht"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary !py-2" onClick={() => setOpen(false)}>
              Abbrechen
            </button>
            <button type="submit" className="btn-primary !py-2">
              Speichern
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
