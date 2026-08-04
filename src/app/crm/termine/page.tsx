"use client";

import { FormEvent, useMemo, useState } from "react";
import { EmptyState, Modal, PageHeader, statusClass } from "@/components/crm-ui";
import { useCrm } from "@/lib/crm-context";
import { formatDate, GUTACHTEN_TYPES, type AppointmentStatus } from "@/lib/types";

const statuses: AppointmentStatus[] = ["geplant", "bestätigt", "erledigt", "storniert"];

export default function TerminePage() {
  const {
    ready,
    data,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getCustomer,
    getVehicle,
  } = useCrm();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("alle");
  const [customerId, setCustomerId] = useState("");

  const filtered = useMemo(() => {
    const list = [...data.appointments].sort((a, b) =>
      `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)
    );
    if (filter === "alle") return list;
    return list.filter((a) => a.status === filter);
  }, [data.appointments, filter]);

  const editing = editId ? data.appointments.find((a) => a.id === editId) : null;
  const vehiclesForCustomer = data.vehicles.filter((v) => v.customerId === customerId);

  function openCreate() {
    setEditId(null);
    setCustomerId(data.customers[0]?.id ?? "");
    setOpen(true);
  }

  function openEdit(id: string) {
    const apt = data.appointments.find((a) => a.id === id);
    setEditId(id);
    setCustomerId(apt?.customerId ?? "");
    setOpen(true);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      customerId: String(fd.get("customerId") || ""),
      vehicleId: String(fd.get("vehicleId") || ""),
      date: String(fd.get("date") || ""),
      time: String(fd.get("time") || ""),
      service: String(fd.get("service") || ""),
      location: String(fd.get("location") || "").trim(),
      status: String(fd.get("status") || "geplant") as AppointmentStatus,
      notes: String(fd.get("notes") || "").trim(),
    };
    if (!payload.customerId || !payload.vehicleId || !payload.date || !payload.time) return;

    if (editId) updateAppointment(editId, payload);
    else addAppointment(payload);

    setOpen(false);
    setEditId(null);
  }

  if (!ready) return <p className="text-fg-muted">Laden…</p>;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Termine"
        subtitle={`${data.appointments.length} Besichtigungen`}
        action={
          <button
            type="button"
            className="btn-primary !py-2.5 text-sm"
            onClick={openCreate}
            disabled={data.customers.length === 0 || data.vehicles.length === 0}
          >
            + Termin
          </button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {["alle", ...statuses].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
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
        <EmptyState message="Keine Termine vorhanden." />
      ) : (
        <div className="space-y-2">
          {filtered.map((apt) => {
            const customer = getCustomer(apt.customerId);
            const vehicle = getVehicle(apt.vehicleId);
            return (
              <div
                key={apt.id}
                className="flex flex-col gap-3 border border-line bg-bg-elevated p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">
                    {formatDate(apt.date)} · {apt.time} — {apt.service}
                  </p>
                  <p className="text-sm text-fg-muted">
                    {customer?.name} · {vehicle?.make} {vehicle?.model} ({vehicle?.plate})
                  </p>
                  {apt.location && (
                    <p className="mt-1 text-xs text-fg-muted">{apt.location}</p>
                  )}
                  {apt.notes && (
                    <p className="mt-1 text-xs text-fg-muted">{apt.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${statusClass(apt.status)}`}>{apt.status}</span>
                  <button
                    type="button"
                    className="text-sm text-accent hover:underline"
                    onClick={() => openEdit(apt.id)}
                  >
                    Bearbeiten
                  </button>
                  <button
                    type="button"
                    className="text-sm text-danger hover:underline"
                    onClick={() => {
                      if (confirm("Termin löschen?")) deleteAppointment(apt.id);
                    }}
                  >
                    Löschen
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={open}
        title={editing ? "Termin bearbeiten" : "Neuer Termin"}
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
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="date"
              type="date"
              className="input-field"
              required
              defaultValue={editing?.date}
            />
            <input
              name="time"
              type="time"
              className="input-field"
              required
              defaultValue={editing?.time}
            />
          </div>
          <select
            name="service"
            className="input-field"
            required
            defaultValue={editing?.service ?? GUTACHTEN_TYPES[0]}
          >
            {GUTACHTEN_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            name="location"
            className="input-field"
            placeholder="Ort der Besichtigung"
            defaultValue={editing?.location}
          />
          <select
            name="status"
            className="input-field"
            defaultValue={editing?.status ?? "geplant"}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <textarea
            name="notes"
            className="input-field resize-y"
            rows={2}
            placeholder="Notizen"
            defaultValue={editing?.notes}
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
