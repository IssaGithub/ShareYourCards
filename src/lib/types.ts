export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
};

export type Vehicle = {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  vin: string;
  mileage: number;
};

export type AppointmentStatus = "geplant" | "bestätigt" | "erledigt" | "storniert";

export type Appointment = {
  id: string;
  customerId: string;
  vehicleId: string;
  date: string;
  time: string;
  service: string;
  location: string;
  status: AppointmentStatus;
  notes: string;
};

export type CaseStatus =
  | "neu"
  | "terminiert"
  | "besichtigt"
  | "in-arbeit"
  | "fertig"
  | "abgerechnet"
  | "storniert";

export type GutachtenCase = {
  id: string;
  customerId: string;
  vehicleId: string;
  type: string;
  title: string;
  description: string;
  status: CaseStatus;
  insurance: string;
  claimNumber: string;
  estimatedFee: number;
  actualFee: number;
  startedAt: string;
  completedAt: string | null;
};

export type LeadStatus = "neu" | "kontaktiert" | "qualifiziert" | "gewonnen" | "verloren";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  gutachtenType: string;
  message: string;
  vehicleInfo: string;
  status: LeadStatus;
  createdAt: string;
  convertedCustomerId: string | null;
};

export type CrmData = {
  customers: Customer[];
  vehicles: Vehicle[];
  appointments: Appointment[];
  cases: GutachtenCase[];
  leads: Lead[];
};

export const GUTACHTEN_TYPES = [
  "Unfall-Schadengutachten",
  "Wertgutachten",
  "Oldtimer-Wertgutachten",
  "Zustandsbericht",
  "Beweissicherungsgutachten",
  "Schadengutachten",
] as const;

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}
