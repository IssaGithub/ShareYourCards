import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";

const services = [
  {
    title: "Unfall-Schadengutachten",
    text: "Das wichtigste Gutachten nach einem Verkehrsunfall. Dokumentiert alle Schäden vollständig und rechtssicher als Grundlage für die Schadenregulierung.",
  },
  {
    title: "Wertgutachten",
    text: "Ermittelt den aktuellen Marktwert Ihres Fahrzeugs nach anerkannten Methoden mit vollständiger Fahrzeugprüfung vor Ort.",
  },
  {
    title: "Oldtimer-Wertgutachten",
    text: "Klassiker nach besonderen Kriterien: Originalität, Zustand, Seltenheit und Liebhaberwert – fachkundig und anerkannt.",
  },
  {
    title: "Zustandsberichte",
    text: "Objektive Dokumentation des technischen und optischen Zustands – häufig bei Leasingrückgaben oder Flottenwechseln.",
  },
  {
    title: "Beweissicherungsgutachten",
    text: "Dokumentiert den Fahrzeugzustand rechtssicher vor einem Verkauf, einer Übergabe oder bei drohenden Streitigkeiten.",
  },
  {
    title: "Schadengutachten",
    text: "Erfasst und bewertet Schäden unabhängig vom Unfall – bei Vandalismus, Park- oder Hagelschäden.",
  },
];

const values = ["Unabhängigkeit", "Präzision", "Verlässlichkeit", "Transparenz", "Engagement"];

const reviews = [
  {
    name: "Natalie H.",
    text: "Kurzfristig verfügbar, Schaden gründlich aufgenommen – wir mussten uns um nichts kümmern. Klare Weiterempfehlung.",
  },
  {
    name: "Hamza",
    text: "Freundlich, professionell und innerhalb von 24 Stunden erledigt. Alles verständlich erklärt – top Service.",
  },
  {
    name: "Viktoria K.",
    text: "Super schnell, professionell und freundlich. Hier fühlt man sich bei Profis gut aufgehoben.",
  },
];

const faqs = [
  {
    q: "Wann benötige ich ein Kfz-Gutachten?",
    a: "Ein Gutachten ist sinnvoll bei Unfällen, größeren Schäden oder zur Wertermittlung. Es dient als Grundlage für die Schadenregulierung mit der Versicherung.",
  },
  {
    q: "Wer bezahlt das Gutachten?",
    a: "Bei einem unverschuldeten Unfall übernimmt in der Regel die gegnerische Versicherung die Kosten des unabhängigen Gutachtens.",
  },
  {
    q: "Wie schnell erhalte ich einen Termin?",
    a: "Termine sind meist kurzfristig möglich. Nach der Besichtigung wird das Gutachten zeitnah erstellt.",
  },
  {
    q: "Muss ich den Gutachter der Versicherung akzeptieren?",
    a: "Nein. Als Geschädigter haben Sie das Recht, einen unabhängigen Gutachter Ihrer Wahl zu beauftragen.",
  },
  {
    q: "Kommen Sie auch zu mir vor Ort?",
    a: "Ja, wir begutachten Ihr Fahrzeug flexibel bei Ihnen zu Hause, am Arbeitsplatz oder in der Werkstatt.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center animate-kenburns"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=80')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "var(--hero-overlay)" }}
        />
        <div className="hero-grid absolute inset-0" />
        <div className="noise absolute inset-0" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-20 pt-28 md:justify-center md:pb-24">
          <p className="animate-fade-up font-display text-6xl font-extrabold leading-none tracking-tight text-fg sm:text-8xl md:text-9xl">
            AXION
          </p>
          <h1 className="animate-fade-up delay-1 mt-5 max-w-xl text-2xl font-medium leading-snug text-fg sm:text-3xl">
            Unabhängige Kfz-Gutachten vom Experten.
          </h1>
          <p className="animate-fade-up delay-2 mt-4 max-w-md text-base leading-relaxed text-fg-muted sm:text-lg">
            Professionelle Schadengutachten, Unfallgutachten und Fahrzeugbewertungen –
            transparent und unkompliziert mit der Versicherung.
          </p>
          <div className="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
            <Link href="/anfrage" className="btn-primary animate-pulse-glow">
              Jetzt Gutachten anfordern
            </Link>
            <Link href="/crm" className="btn-secondary">
              CRM öffnen
            </Link>
          </div>
        </div>
      </section>

      <section id="ueber-uns" className="border-t border-line bg-bg py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Über uns
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-4xl font-bold md:text-5xl">
            Erfahrung, die überzeugt.
          </h2>
          <p className="mt-5 max-w-2xl text-fg-muted leading-relaxed">
            Als unabhängiges Kfz-Sachverständigenbüro erstellen wir präzise und objektive
            Gutachten. Wir begleiten Sie persönlich, transparent und unkompliziert durch
            den gesamten Prozess – von der Anfrage bis zur Abwicklung mit der Versicherung.
          </p>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Zertifizierte Expertise",
                text: "Fundierte Ausbildung, langjährige Erfahrung und höchste Sorgfalt bei jedem Gutachten.",
              },
              {
                title: "Vor-Ort-Service",
                text: "Wir kommen zu Ihnen und begutachten Ihr Fahrzeug flexibel vor Ort.",
              },
              {
                title: "Persönliche Betreuung",
                text: "Ihr direkter Ansprechpartner – ohne Warteschleifen und ohne Umwege.",
              },
            ].map((item, i) => (
              <article
                key={item.title}
                className="animate-fade-up border-t border-line pt-6"
                style={{ animationDelay: `${0.08 * i}s` }}
              >
                <h3 className="font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="leistungen" className="relative overflow-hidden border-t border-line">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-elevated via-bg to-[#d9e3ec]" />
        <div className="relative mx-auto max-w-6xl px-5 py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Unsere Leistungen
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-4xl font-bold md:text-5xl">
            Professionelle Gutachten rund ums Fahrzeug.
          </h2>
          <p className="mt-4 max-w-xl text-fg-muted">
            Unabhängige Unfall- und Schadengutachten sowie Fahrzeugbewertungen – präzise,
            transparent und zuverlässig.
          </p>

          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <article
                key={service.title}
                className="animate-fade-up border-t border-line pt-6"
                style={{ animationDelay: `${0.08 * i}s` }}
              >
                <h3 className="font-display text-xl font-bold">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-bg py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Das zeichnet uns aus
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-4xl font-bold md:text-5xl">
            Im Schadensfall nur Ihre Interessen.
          </h2>
          <p className="mt-4 max-w-xl text-fg-muted">
            Objektiv, zertifiziert und mit klarer, transparenter Abwicklung.
          </p>

          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {[
              {
                title: "Auf eigene Faust",
                points: [
                  "Verzögerungen, viele Telefonate",
                  "Oft unvollständige Unterlagen",
                  "Risiko bei der Versicherungsauszahlung",
                  "Viel Eigenaufwand",
                ],
              },
              {
                title: "AXION",
                highlight: true,
                points: [
                  "Unabhängige Experten",
                  "Kostenfrei für Geschädigte*",
                  "Auszahlung durch Versicherung",
                  "0 % Aufwand – 100 % Unterstützung",
                ],
              },
              {
                title: "Versicherung",
                points: [
                  "Gutachter im Interesse der Versicherung",
                  "Steuerung zu eigenem Vorteil",
                  "Viel Papierkram, wenig Unterstützung",
                  "Langsame Bearbeitung",
                ],
              },
            ].map((col) => (
              <div
                key={col.title}
                className={`border p-6 ${
                  col.highlight
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-bg-elevated"
                }`}
              >
                <h3 className="font-display text-2xl font-bold">{col.title}</h3>
                <ul className="mt-5 space-y-3 text-sm text-fg-muted">
                  {col.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-accent">▸</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-fg-muted">
            * Bei unverschuldetem Unfall übernimmt in der Regel die gegnerische Versicherung.
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-bg-elevated py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Unsere Werte</h2>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {values.map((v, i) => (
              <span
                key={v}
                className="animate-fade-up font-display text-2xl font-bold text-steel sm:text-3xl"
                style={{ animationDelay: `${0.06 * i}s` }}
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-line">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/95 to-bg/70" />
        <div className="relative mx-auto max-w-6xl px-5 py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Bewertungen
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-4xl font-bold md:text-5xl">
            Das sagen unsere Kunden.
          </h2>
          <p className="mt-4 max-w-xl text-fg-muted">
            Fachliche Kompetenz, transparente Arbeitsweise und zuverlässige Betreuung –
            vom ersten Kontakt bis zur finalen Abwicklung.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {reviews.map((r, i) => (
              <blockquote
                key={r.name}
                className="animate-fade-up border-t border-line pt-6"
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <p className="text-sm leading-relaxed text-fg-muted">„{r.text}“</p>
                <footer className="mt-4 text-sm font-semibold">{r.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-line bg-bg py-24">
        <div className="mx-auto max-w-3xl px-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">FAQ</p>
          <h2 className="font-display mt-3 text-4xl font-bold md:text-5xl">
            Häufig gestellte Fragen
          </h2>
          <div className="mt-10">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-gradient-to-br from-[#dce5ee] via-bg to-bg-elevated py-24">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">
            Jetzt unabhängiges Kfz-Gutachten anfragen
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-fg-muted">
            Sichern Sie sich eine schnelle Begutachtung. Kontaktieren Sie uns und erhalten
            Sie kurzfristig einen Termin sowie eine klare Einschätzung.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/anfrage" className="btn-primary">
              Gutachten anfordern
            </Link>
            <a href="tel:+498976543210" className="btn-secondary">
              +49 89 765 432 10
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
