"use client";

import { FormEvent, useMemo, useState } from "react";
import { EmptyState, Modal, PageHeader } from "@/components/crm-ui";
import { useCrm } from "@/lib/crm-context";
import { formatDate } from "@/lib/types";

export default function KundenPage() {
  const { ready, data, addCustomer, updateCustomer, deleteCustomer } = useCrm();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return data.customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [data.customers, query]);

  const editing = editId ? data.customers.find((c) => c.id === editId) : null;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      address: String(fd.get("address") || "").trim(),
      notes: String(fd.get("notes") || "").trim(),
    };
    if (!payload.name || !payload.email || !payload.phone) return;

    if (editId) updateCustomer(editId, payload);
    else addCustomer(payload);

    setOpen(false);
    setEditId(null);
  }

  if (!ready) return <p className="text-fg-muted">Laden…</p>;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Kunden"
        subtitle={`${data.customers.length} Einträge`}
        action={
          <button
            type="button"
            className="btn-primary !py-2.5 text-sm"
            onClick={() => {
              setEditId(null);
              setOpen(true);
            }}
          >
            + Kunde
          </button>
        }
      />

      <input
        className="input-field mb-6 max-w-md"
        placeholder="Suchen nach Name, E-Mail, Telefon…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filtered.length === 0 ? (
        <EmptyState message="Keine Kunden gefunden." />
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-bg-muted text-xs uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Kontakt</th>
                <th className="px-4 py-3 font-medium">Fahrzeuge</th>
                <th className="px-4 py-3 font-medium">Gutachten</th>
                <th className="px-4 py-3 font-medium">Seit</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const vehicles = data.vehicles.filter((v) => v.customerId === c.id).length;
                const cases = data.cases.filter((x) => x.customerId === c.id).length;
                return (
                  <tr key={c.id} className="border-t border-line hover:bg-bg-elevated/60">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-fg-muted">
                      <div>{c.email}</div>
                      <div>{c.phone}</div>
                    </td>
                    <td className="px-4 py-3">{vehicles}</td>
                    <td className="px-4 py-3">{cases}</td>
                    <td className="px-4 py-3 text-fg-muted">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        className="text-accent hover:underline mr-3"
                        onClick={() => {
                          setEditId(c.id);
                          setOpen(true);
                        }}
                      >
                        Bearbeiten
                      </button>
                      <button
                        type="button"
                        className="text-danger hover:underline"
                        onClick={() => {
                          if (confirm(`Kunde „${c.name}“ wirklich löschen?`)) {
                            deleteCustomer(c.id);
                          }
                        }}
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={open}
        title={editing ? "Kunde bearbeiten" : "Neuer Kunde"}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            name="name"
            className="input-field"
            placeholder="Name *"
            required
            defaultValue={editing?.name}
          />
          <input
            name="email"
            type="email"
            className="input-field"
            placeholder="E-Mail *"
            required
            defaultValue={editing?.email}
          />
          <input
            name="phone"
            className="input-field"
            placeholder="Telefon *"
            required
            defaultValue={editing?.phone}
          />
          <input
            name="address"
            className="input-field"
            placeholder="Adresse"
            defaultValue={editing?.address}
          />
          <textarea
            name="notes"
            className="input-field resize-y"
            rows={3}
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
