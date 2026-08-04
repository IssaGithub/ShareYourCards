"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useCrm } from "@/lib/crm-context";
import { GUTACHTEN_TYPES } from "@/lib/types";

export default function AnfragePage() {
  const { addLead, addCustomer, addVehicle, addAppointment, addCase, data } = useCrm();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [withTermin, setWithTermin] = useState(true);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);

    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const gutachtenType = String(fd.get("gutachtenType") || "");
    const message = String(fd.get("message") || "").trim();
    const make = String(fd.get("make") || "").trim();
    const model = String(fd.get("model") || "").trim();
    const plate = String(fd.get("plate") || "").trim();
    const year = Number(fd.get("year") || new Date().getFullYear());
    const date = String(fd.get("date") || "");
    const time = String(fd.get("time") || "");
    const location = String(fd.get("location") || "").trim();
    const vehicleInfo = [make, model, plate].filter(Boolean).join(" · ");

    if (!name || !email || !phone || !gutachtenType) {
      setError("Bitte füllen Sie alle Pflichtfelder aus.");
      return;
    }

    addLead({
      name,
      email,
      phone,
      gutachtenType,
      message,
      vehicleInfo,
      status: "neu",
    });

    if (withTermin && make && model && plate && date && time) {
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
          notes: `Über Online-Anfrage · ${gutachtenType}`,
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
        service: gutachtenType,
        location: location || "Vor Ort",
        status: "geplant",
        notes: message,
      });

      addCase({
        customerId: customer.id,
        vehicleId: vehicle.id,
        type: gutachtenType,
        title: `${gutachtenType} · ${make} ${model}`,
        description: message,
        status: "terminiert",
        insurance: "",
        claimNumber: "",
        estimatedFee: 0,
        actualFee: 0,
        startedAt: date,
        completedAt: null,
      });
    }

    setDone(true);
    e.currentTarget.reset();
  }

  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Schnell & einfach
        </p>
        <h1 className="font-display mt-3 text-4xl font-bold md:text-5xl">
          Jetzt Gutachten anfordern
        </h1>
        <p className="mt-4 text-fg-muted">
          Ihre Anfrage landet direkt im AXION-CRM. Wir melden uns kurzfristig zur
          Terminbestätigung.
        </p>

        {done ? (
          <div className="mt-10 animate-fade-up border border-success/40 bg-success/10 p-8">
            <h2 className="font-display text-2xl font-bold text-success">
              Anfrage gesendet
            </h2>
            <p className="mt-3 text-fg-muted">
              Vielen Dank! Ihre Anfrage wurde im Gutachten-CRM erfasst und erscheint unter
              Anfragen{withTermin ? ", Termine und Gutachten" : ""}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setDone(false)}
              >
                Weitere Anfrage
              </button>
              <Link href="/crm/anfragen" className="btn-secondary">
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
              <select name="gutachtenType" className="input-field" required defaultValue="">
                <option value="" disabled>
                  Gutachtenart wählen *
                </option>
                {GUTACHTEN_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <textarea
                name="message"
                rows={3}
                className="input-field resize-y"
                placeholder="Schadenshergang / Anliegen"
              />
            </fieldset>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={withTermin}
                onChange={(e) => setWithTermin(e.target.checked)}
                className="size-4 accent-[var(--accent)]"
              />
              Zusätzlich Vor-Ort-Termin und Fall im CRM anlegen
            </label>

            {withTermin && (
              <>
                <fieldset className="space-y-4">
                  <legend className="font-display text-lg font-bold">Fahrzeug</legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input name="make" className="input-field" placeholder="Marke *" required={withTermin} />
                    <input name="model" className="input-field" placeholder="Modell *" required={withTermin} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      name="plate"
                      className="input-field"
                      placeholder="Kennzeichen *"
                      required={withTermin}
                    />
                    <input
                      name="year"
                      type="number"
                      min={1950}
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
                    <input name="date" type="date" className="input-field" required={withTermin} />
                    <select name="time" className="input-field" required={withTermin} defaultValue="">
                      <option value="" disabled>
                        Uhrzeit *
                      </option>
                      {[
                        "08:00",
                        "09:00",
                        "10:00",
                        "11:00",
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
                  <input
                    name="location"
                    className="input-field"
                    placeholder="Besichtigungsort (Adresse / Werkstatt)"
                  />
                </fieldset>
              </>
            )}

            {error && <p className="text-sm text-danger">{error}</p>}

            <button type="submit" className="btn-primary w-full sm:w-auto">
              Anfrage absenden
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
