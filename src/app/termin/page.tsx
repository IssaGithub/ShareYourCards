"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useCrm } from "@/lib/crm-context";
import { SERVICES } from "@/lib/types";

export default function TerminPage() {
  const { addCustomer, addVehicle, addAppointment, data } = useCrm();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);

    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const make = String(fd.get("make") || "").trim();
    const model = String(fd.get("model") || "").trim();
    const plate = String(fd.get("plate") || "").trim();
    const year = Number(fd.get("year") || new Date().getFullYear());
    const date = String(fd.get("date") || "");
    const time = String(fd.get("time") || "");
    const service = String(fd.get("service") || "");
    const notes = String(fd.get("notes") || "").trim();

    if (!name || !email || !phone || !make || !model || !plate || !date || !time || !service) {
      setError("Bitte füllen Sie alle Pflichtfelder aus.");
      return;
    }

    const existingCustomer = data.customers.find(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    );
    const customer =
      existingCustomer ??
      addCustomer({
        name,
        email,
        phone,
        address: "",
        notes: "Über Online-Termin angelegt",
      });

    const plateKey = plate.replace(/\s/g, "").toLowerCase();
    const existingVehicle = data.vehicles.find(
      (v) =>
        v.customerId === customer.id &&
        v.plate.replace(/\s/g, "").toLowerCase() === plateKey
    );
    const vehicle =
      existingVehicle ??
      addVehicle({
        customerId: customer.id,
        make,
        model,
        year,
        plate,
        vin: "",
        mileage: 0,
      });

    addAppointment({
      customerId: customer.id,
      vehicleId: vehicle.id,
      date,
      time,
      service,
      status: "geplant",
      notes,
    });

    setDone(true);
    e.currentTarget.reset();
  }

  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Online-Termin
        </p>
        <h1 className="font-display mt-3 text-4xl font-bold md:text-5xl">
          Termin buchen
        </h1>
        <p className="mt-4 text-fg-muted">
          Ihre Anfrage landet direkt im MOTORHALLE-CRM – wir melden uns zur
          Bestätigung.
        </p>

        {done ? (
          <div className="mt-10 animate-fade-up border border-success/40 bg-success/10 p-8">
            <h2 className="font-display text-2xl font-bold text-success">
              Anfrage gesendet
            </h2>
            <p className="mt-3 text-fg-muted">
              Vielen Dank! Ihr Termin wurde im Werkstatt-CRM erfasst und erscheint
              unter Termine.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setDone(false)}
              >
                Weiteren Termin buchen
              </button>
              <Link href="/crm/termine" className="btn-secondary">
                Im CRM ansehen
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-8 animate-fade-up">
            <fieldset className="space-y-4">
              <legend className="font-display text-lg font-bold">Ihre Daten</legend>
              <input name="name" className="input-field" placeholder="Name *" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="email"
                  type="email"
                  className="input-field"
                  placeholder="E-Mail *"
                  required
                />
                <input
                  name="phone"
                  type="tel"
                  className="input-field"
                  placeholder="Telefon *"
                  required
                />
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="font-display text-lg font-bold">Fahrzeug</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="make" className="input-field" placeholder="Marke *" required />
                <input name="model" className="input-field" placeholder="Modell *" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="plate"
                  className="input-field"
                  placeholder="Kennzeichen *"
                  required
                />
                <input
                  name="year"
                  type="number"
                  min={1980}
                  max={2030}
                  className="input-field"
                  placeholder="Baujahr"
                  defaultValue={2020}
                />
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="font-display text-lg font-bold">Terminwunsch</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="date" type="date" className="input-field" required />
                <select name="time" className="input-field" required defaultValue="">
                  <option value="" disabled>
                    Uhrzeit *
                  </option>
                  {[
                    "07:30",
                    "08:00",
                    "08:30",
                    "09:00",
                    "09:30",
                    "10:00",
                    "10:30",
                    "11:00",
                    "11:30",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t} Uhr
                    </option>
                  ))}
                </select>
              </div>
              <select name="service" className="input-field" required defaultValue="">
                <option value="" disabled>
                  Leistung wählen *
                </option>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <textarea
                name="notes"
                rows={3}
                className="input-field resize-y"
                placeholder="Anliegen / Hinweise"
              />
            </fieldset>

            {error && <p className="text-sm text-danger">{error}</p>}

            <button type="submit" className="btn-primary w-full sm:w-auto">
              Termin anfragen
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
