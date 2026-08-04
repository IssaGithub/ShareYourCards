"use client";

import { FormEvent, useMemo, useState } from "react";
import { EmptyState, Modal, PageHeader, statusClass } from "@/components/crm-ui";
import { useCrm } from "@/lib/crm-context";
import {
  formatCurrency,
  formatDate,
  GUTACHTEN_TYPES,
  type CaseStatus,
} from "@/lib/types";

const statuses: CaseStatus[] = [
  "neu",
  "terminiert",
  "besichtigt",
  "in-arbeit",
  "fertig",
  "abgerechnet",
  "storniert",
];

export default function GutachtenPage() {
  const {
    ready,
    data,
    addCase,
    updateCase,
    deleteCase,
    getCustomer,
    getVehicle,
  } = useCrm();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("alle");
  const [customerId, setCustomerId] = useState("");

  const filtered = useMemo(() => {
    const list = [...data.cases];
    if (filter === "alle") return list;
    return list.filter((c) => c.status === filter);
  }, [data.cases, filter]);

  const editing = editId ? data.cases.find((c) => c.id === editId) : null;
  const vehiclesForCustomer = data.vehicles.filter((v) => v.customerId === customerId);

  function openCreate() {
    setEditId(null);
    setCustomerId(data.customers[0]?.id ?? "");
    setOpen(true);
  }

  function openEdit(id: string) {
    const c = data.cases.find((x) => x.id === id);
    setEditId(id);
    setCustomerId(c?.customerId ?? "");
    setOpen(true);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const status = String(fd.get("status") || "neu") as CaseStatus;
    const payload = {
      customerId: String(fd.get("customerId") || ""),
      vehicleId: String(fd.get("vehicleId") || ""),
      type: String(fd.get("type") || ""),
      title: String(fd.get("title") || "").trim(),
      description: String(fd.get("description") || "").trim(),
      status,
      insurance: String(fd.get("insurance") || "").trim(),
      claimNumber: String(fd.get("claimNumber") || "").trim(),
      estimatedFee: Number(fd.get("estimatedFee") || 0),
      actualFee: Number(fd.get("actualFee") || 0),
      startedAt: String(fd.get("startedAt") || new Date().toISOString().slice(0, 10)),
      completedAt:
        status === "fertig" || status === "abgerechnet"
          ? String(fd.get("completedAt") || new Date().toISOString().slice(0, 10))
          : null,
    };
    if (!payload.customerId || !payload.vehicleId || !payload.title || !payload.type) return;

    if (editId) updateCase(editId, payload);
    else addCase(payload);

    setOpen(false);
    setEditId(null);
  }

  if (!ready) return <p className="text-fg-muted">Laden…</p>;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gutachten"
        subtitle={`${data.cases.length} Fälle`}
        action={
          <button
            type="button"
            className="btn-primary !py-2.5 text-sm"
            onClick={openCreate}
            disabled={data.customers.length === 0 || data.vehicles.length === 0}
          >
            + Gutachten
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
        <EmptyState message="Keine Gutachten vorhanden." />
      ) : (
        <div className="grid gap-3">
          {filtered.map((c) => {
            const customer = getCustomer(c.customerId);
            const vehicle = getVehicle(c.vehicleId);
            return (
              <article key={c.id} className="border border-line bg-bg-elevated p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold">{c.title}</h3>
                    <p className="mt-1 text-sm text-fg-muted">
                      {customer?.name} · {vehicle?.make} {vehicle?.model} ·{" "}
                      {vehicle?.plate}
                    </p>
                    <p className="mt-1 text-xs font-medium text-steel">{c.type}</p>
                  </div>
                  <span className={`badge ${statusClass(c.status)}`}>{c.status}</span>
                </div>
                {c.description && (
                  <p className="mt-3 text-sm text-fg-muted">{c.description}</p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-fg-muted">
                  <span>Start: {formatDate(c.startedAt)}</span>
                  {c.completedAt && <span>Fertig: {formatDate(c.completedAt)}</span>}
                  {c.insurance && <span>Versicherung: {c.insurance}</span>}
                  {c.claimNumber && <span>Schaden-Nr.: {c.claimNumber}</span>}
                  <span>Honorar: {formatCurrency(c.estimatedFee)}</span>
                  {c.actualFee > 0 && (
                    <span>Ist: {formatCurrency(c.actualFee)}</span>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="text-sm text-accent hover:underline"
                    onClick={() => openEdit(c.id)}
                  >
                    Bearbeiten
                  </button>
                  {c.status !== "fertig" &&
                    c.status !== "abgerechnet" &&
                    c.status !== "storniert" && (
                      <button
                        type="button"
                        className="text-sm text-success hover:underline"
                        onClick={() =>
                          updateCase(c.id, {
                            status: "fertig",
                            completedAt: new Date().toISOString().slice(0, 10),
                            actualFee: c.actualFee || c.estimatedFee,
                          })
                        }
                      >
                        Als fertig markieren
                      </button>
                    )}
                  <button
                    type="button"
                    className="text-sm text-danger hover:underline"
                    onClick={() => {
                      if (confirm("Gutachten löschen?")) deleteCase(c.id);
                    }}
                  >
                    Löschen
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        open={open}
        title={editing ? "Gutachten bearbeiten" : "Neues Gutachten"}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <select
            name="customerId"
            className="input-field"
            required
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="" disabled>
              Kunde *
            </option>
            {data.customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            name="vehicleId"
            className="input-field"
            required
            defaultValue={editing?.vehicleId ?? vehiclesForCustomer[0]?.id ?? ""}
            key={customerId + (editing?.id ?? "new")}
          >
            <option value="" disabled>
              Fahrzeug *
            </option>
            {vehiclesForCustomer.map((v) => (
              <option key={v.id} value={v.id}>
                {v.make} {v.model} · {v.plate}
              </option>
            ))}
          </select>
          <select
            name="type"
            className="input-field"
            required
            defaultValue={editing?.type ?? GUTACHTEN_TYPES[0]}
          >
            {GUTACHTEN_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            name="title"
            className="input-field"
            placeholder="Titel *"
            required
            defaultValue={editing?.title}
          />
          <textarea
            name="description"
            className="input-field resize-y"
            rows={3}
            placeholder="Beschreibung / Schaden"
            defaultValue={editing?.description}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="insurance"
              className="input-field"
              placeholder="Versicherung"
              defaultValue={editing?.insurance}
            />
            <input
              name="claimNumber"
              className="input-field"
              placeholder="Schadennummer"
              defaultValue={editing?.claimNumber}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="estimatedFee"
              type="number"
              step="0.01"
              className="input-field"
              placeholder="Honorar Schätzung €"
              defaultValue={editing?.estimatedFee ?? 0}
            />
            <input
              name="actualFee"
              type="number"
              step="0.01"
              className="input-field"
              placeholder="Honorar Ist €"
              defaultValue={editing?.actualFee ?? 0}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="startedAt"
              type="date"
              className="input-field"
              defaultValue={editing?.startedAt ?? new Date().toISOString().slice(0, 10)}
            />
            <select
              name="status"
              className="input-field"
              defaultValue={editing?.status ?? "neu"}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <input
            name="completedAt"
            type="date"
            className="input-field"
            defaultValue={editing?.completedAt ?? ""}
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
