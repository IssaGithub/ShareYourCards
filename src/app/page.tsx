import Link from "next/link";

const services = [
  {
    title: "Inspektion & Wartung",
    text: "Herstellerkonforme Serviceintervalle, Öl, Filter und Sicherheitstechnik.",
  },
  {
    title: "Diagnose & Elektronik",
    text: "Modernste OBD-Systeme für Fehlercodes, Sensorik und Steuergeräte.",
  },
  {
    title: "Bremsen & Fahrwerk",
    text: "Beläge, Scheiben, Stoßdämpfer – präzise Arbeit für sicheres Fahren.",
  },
  {
    title: "Reifen & Räder",
    text: "Wechsel, Einlagerung, Auswuchten und Reifendruck-Systeme.",
  },
  {
    title: "Klimaservice",
    text: "Dichtheitsprüfung, Kältemittel und Desinfektion für klare Sicht.",
  },
  {
    title: "Unfall & Karosserie",
    text: "Instandsetzung nach Schaden, Lackierung und Originalteile.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(105deg, rgba(12,14,17,0.92) 0%, rgba(12,14,17,0.72) 45%, rgba(12,14,17,0.35) 100%), url('https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="hero-grid absolute inset-0" />
        <div className="noise absolute inset-0 opacity-40" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-20 pt-28 md:justify-center md:pb-24">
          <p className="animate-fade-up font-display text-5xl font-extrabold leading-none tracking-tight text-fg sm:text-7xl md:text-8xl lg:text-9xl">
            MOTORHALLE
          </p>
          <h1 className="animate-fade-up delay-1 mt-6 max-w-xl text-2xl font-medium leading-snug text-fg sm:text-3xl">
            Meisterhafte Autotechnik mit integriertem Werkstatt-CRM.
          </h1>
          <p className="animate-fade-up delay-2 mt-4 max-w-md text-base leading-relaxed text-fg-muted sm:text-lg">
            Von der Online-Terminbuchung bis zum Auftrag – alles an einem Ort für
            Ihre Werkstatt und Ihre Kunden.
          </p>
          <div className="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
            <Link href="/termin" className="btn-primary animate-pulse-glow">
              Termin online buchen
            </Link>
            <Link href="/crm" className="btn-secondary">
              CRM öffnen
            </Link>
          </div>
        </div>
      </section>

      <section id="leistungen" className="border-t border-line bg-bg py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Leistungen
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-4xl font-bold md:text-5xl">
            Alles, was Ihr Fahrzeug braucht.
          </h2>
          <p className="mt-4 max-w-xl text-fg-muted">
            Ein Team, eine Halle, klare Abläufe – von der Diagnose bis zur
            Abholung.
          </p>

          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <article
                key={service.title}
                className="animate-fade-up border-t border-line pt-6"
                style={{ animationDelay: `${0.08 * i}s` }}
              >
                <h3 className="font-display text-xl font-bold">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  {service.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ueber-uns" className="relative overflow-hidden border-t border-line">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-elevated via-bg to-[#1a1510]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Über uns
            </p>
            <h2 className="font-display mt-3 text-4xl font-bold md:text-5xl">
              Werkstatt mit System.
            </h2>
            <p className="mt-5 text-fg-muted leading-relaxed">
              MOTORHALLE verbindet klassische Meisterqualität mit digitaler
              Organisation. Unser CRM hält Kunden, Fahrzeuge, Termine und
              Aufträge zusammen – damit Sie immer den Überblick behalten und
              Ihre Kunden transparent informiert sind.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-fg">
              <li className="flex gap-3">
                <span className="text-accent">▸</span>
                Zertifizierte Meister und Markenkenntnis
              </li>
              <li className="flex gap-3">
                <span className="text-accent">▸</span>
                Digitale Auftragsverfolgung in Echtzeit
              </li>
              <li className="flex gap-3">
                <span className="text-accent">▸</span>
                Online-Terminbuchung direkt ins CRM
              </li>
            </ul>
          </div>
          <div
            className="min-h-[320px] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1619642751038-966338990f48?auto=format&fit=crop&w=1200&q=80')",
            }}
            role="img"
            aria-label="Mechaniker bei der Arbeit in der Werkstatt"
          />
        </div>
      </section>

      <section className="border-t border-line bg-bg-elevated py-24">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">
            Bereit für den nächsten Service?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-fg-muted">
            Buchen Sie Ihren Termin online – er erscheint sofort im
            Werkstatt-CRM.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/termin" className="btn-primary">
              Termin anfragen
            </Link>
            <a href="tel:+498912345678" className="btn-secondary">
              Anrufen
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
