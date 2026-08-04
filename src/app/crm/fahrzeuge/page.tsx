"use client";

import { FormEvent, useMemo, useState } from "react";
import { EmptyState, Modal, PageHeader } from "@/components/crm-ui";
import { useCrm } from "@/lib/crm-context";

export default function FahrzeugePage() {
  const { ready, data, addVehicle, updateVehicle, deleteVehicle, getCustomer } = useCrm();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return data.vehicles.filter((v) => {
      const customer = getCustomer(v.customerId);
      return (
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.plate.toLowerCase().includes(q) ||
        (customer?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [data.vehicles, query, getCustomer]);

  const editing = editId ? data.vehicles.find((v) => v.id === editId) : null;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      customerId: String(fd.get("customerId") || ""),
      make: String(fd.get("make") || "").trim(),
      model: String(fd.get("model") || "").trim(),
      year: Number(fd.get("year") || 0),
      plate: String(fd.get("plate") || "").trim(),
      vin: String(fd.get("vin") || "").trim(),
      mileage: Number(fd.get("mileage") || 0),
    };
    if (!payload.customerId || !payload.make || !payload.model || !payload.plate) return;

    if (editId) updateVehicle(editId, payload);
    else addVehicle(payload);

    setOpen(false);
    setEditId(null);
  }

  if (!ready) return <p className="text-fg-muted">Laden…</p>;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Fahrzeuge"
        subtitle={`${data.vehicles.length} Einträge`}
        action={
          <button
            type="button"
            className="btn-primary !py-2.5 text-sm"
            onClick={() => {
              setEditId(null);
              setOpen(true);
            }}
            disabled={data.customers.length === 0}
          >
            + Fahrzeug
          </button>
        }
      />

      <input
        className="input-field mb-6 max-w-md"
        placeholder="Suchen nach Marke, Kennzeichen, Kunde…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filtered.length === 0 ? (
        <EmptyState message="Keine Fahrzeuge gefunden." />
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-bg-muted text-xs uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Fahrzeug</th>
                <th className="px-4 py-3 font-medium">Kennzeichen</th>
                <th className="px-4 py-3 font-medium">Kunde</th>
                <th className="px-4 py-3 font-medium">km</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-t border-line hover:bg-bg-elevated/60">
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {v.make} {v.model}
                    </div>
                    <div className="text-xs text-fg-muted">{v.year}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{v.plate}</td>
                  <td className="px-4 py-3 text-fg-muted">
                    {getCustomer(v.customerId)?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {v.mileage.toLocaleString("de-DE")}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      className="mr-3 text-accent hover:underline"
                      onClick={() => {
                        setEditId(v.id);
                        setOpen(true);
                      }}
                    >
                      Bearbeiten
                    </button>
                    <button
                      type="button"
                      className="text-danger hover:underline"
                      onClick={() => {
                        if (confirm(`Fahrzeug ${v.plate} löschen?`)) deleteVehicle(v.id);
                      }}
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={open}
        title={editing ? "Fahrzeug bearbeiten" : "Neues Fahrzeug"}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <select
            name="customerId"
            className="input-field"
            required
            defaultValue={editing?.customerId ?? ""}
          >
            <option value="" disabled>
              Kunde wählen *
            </option>
            {data.customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="make"
              className="input-field"
              placeholder="Marke *"
              required
              defaultValue={editing?.make}
            />
            <input
              name="model"
              className="input-field"
              placeholder="Modell *"
              required
              defaultValue={editing?.model}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="year"
              type="number"
              className="input-field"
              placeholder="Baujahr"
              defaultValue={editing?.year ?? 2020}
            />
            <input
              name="plate"
              className="input-field"
              placeholder="Kennzeichen *"
              required
              defaultValue={editing?.plate}
            />
          </div>
          <input
            name="vin"
            className="input-field"
            placeholder="FIN / VIN"
            defaultValue={editing?.vin}
          />
          <input
            name="mileage"
            type="number"
            className="input-field"
            placeholder="Kilometerstand"
            defaultValue={editing?.mileage ?? 0}
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
