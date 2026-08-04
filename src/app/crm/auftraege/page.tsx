"use client";

import { FormEvent, useMemo, useState } from "react";
import { EmptyState, Modal, PageHeader, statusClass } from "@/components/crm-ui";
import { useCrm } from "@/lib/crm-context";
import { formatCurrency, formatDate, type WorkOrderStatus } from "@/lib/types";

const statuses: WorkOrderStatus[] = ["offen", "in-arbeit", "fertig", "storniert"];

export default function AuftraegePage() {
  const {
    ready,
    data,
    addWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    getCustomer,
    getVehicle,
  } = useCrm();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("alle");
  const [customerId, setCustomerId] = useState("");

  const filtered = useMemo(() => {
    const list = [...data.workOrders];
    if (filter === "alle") return list;
    return list.filter((w) => w.status === filter);
  }, [data.workOrders, filter]);

  const editing = editId ? data.workOrders.find((w) => w.id === editId) : null;
  const vehiclesForCustomer = data.vehicles.filter((v) => v.customerId === customerId);

  function openCreate() {
    setEditId(null);
    setCustomerId(data.customers[0]?.id ?? "");
    setOpen(true);
  }

  function openEdit(id: string) {
    const wo = data.workOrders.find((w) => w.id === id);
    setEditId(id);
    setCustomerId(wo?.customerId ?? "");
    setOpen(true);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const status = String(fd.get("status") || "offen") as WorkOrderStatus;
    const payload = {
      customerId: String(fd.get("customerId") || ""),
      vehicleId: String(fd.get("vehicleId") || ""),
      title: String(fd.get("title") || "").trim(),
      description: String(fd.get("description") || "").trim(),
      status,
      estimatedCost: Number(fd.get("estimatedCost") || 0),
      actualCost: Number(fd.get("actualCost") || 0),
      startedAt: String(fd.get("startedAt") || new Date().toISOString().slice(0, 10)),
      completedAt:
        status === "fertig"
          ? String(fd.get("completedAt") || new Date().toISOString().slice(0, 10))
          : null,
    };
    if (!payload.customerId || !payload.vehicleId || !payload.title) return;

    if (editId) updateWorkOrder(editId, payload);
    else addWorkOrder(payload);

    setOpen(false);
    setEditId(null);
  }

  if (!ready) return <p className="text-fg-muted">Laden…</p>;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Aufträge"
        subtitle={`${data.workOrders.length} Werkstattaufträge`}
        action={
          <button
            type="button"
            className="btn-primary !py-2.5 text-sm"
            onClick={openCreate}
            disabled={data.customers.length === 0 || data.vehicles.length === 0}
          >
            + Auftrag
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
        <EmptyState message="Keine Aufträge vorhanden." />
      ) : (
        <div className="grid gap-3">
          {filtered.map((wo) => {
            const customer = getCustomer(wo.customerId);
            const vehicle = getVehicle(wo.vehicleId);
            return (
              <article
                key={wo.id}
                className="border border-line bg-bg-elevated p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold">{wo.title}</h3>
                    <p className="mt-1 text-sm text-fg-muted">
                      {customer?.name} · {vehicle?.make} {vehicle?.model} ·{" "}
                      {vehicle?.plate}
                    </p>
                  </div>
                  <span className={`badge ${statusClass(wo.status)}`}>{wo.status}</span>
                </div>
                {wo.description && (
                  <p className="mt-3 text-sm text-fg-muted">{wo.description}</p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-fg-muted">
                  <span>Start: {formatDate(wo.startedAt)}</span>
                  {wo.completedAt && <span>Fertig: {formatDate(wo.completedAt)}</span>}
                  <span>Schätzung: {formatCurrency(wo.estimatedCost)}</span>
                  {wo.actualCost > 0 && (
                    <span>Ist: {formatCurrency(wo.actualCost)}</span>
                  )}
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    className="text-sm text-accent hover:underline"
                    onClick={() => openEdit(wo.id)}
                  >
                    Bearbeiten
                  </button>
                  {wo.status !== "fertig" && wo.status !== "storniert" && (
                    <button
                      type="button"
                      className="text-sm text-success hover:underline"
                      onClick={() =>
                        updateWorkOrder(wo.id, {
                          status: "fertig",
                          completedAt: new Date().toISOString().slice(0, 10),
                          actualCost: wo.actualCost || wo.estimatedCost,
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
                      if (confirm("Auftrag löschen?")) deleteWorkOrder(wo.id);
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
        title={editing ? "Auftrag bearbeiten" : "Neuer Auftrag"}
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
            placeholder="Beschreibung"
            defaultValue={editing?.description}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="estimatedCost"
              type="number"
              step="0.01"
              className="input-field"
              placeholder="Kostenschätzung €"
              defaultValue={editing?.estimatedCost ?? 0}
            />
            <input
              name="actualCost"
              type="number"
              step="0.01"
              className="input-field"
              placeholder="Ist-Kosten €"
              defaultValue={editing?.actualCost ?? 0}
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
              defaultValue={editing?.status ?? "offen"}
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
