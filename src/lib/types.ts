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
  status: AppointmentStatus;
  notes: string;
};

export type WorkOrderStatus = "offen" | "in-arbeit" | "fertig" | "storniert";

export type WorkOrder = {
  id: string;
  customerId: string;
  vehicleId: string;
  title: string;
  description: string;
  status: WorkOrderStatus;
  estimatedCost: number;
  actualCost: number;
  startedAt: string;
  completedAt: string | null;
};

export type CrmData = {
  customers: Customer[];
  vehicles: Vehicle[];
  appointments: Appointment[];
  workOrders: WorkOrder[];
};

export const SERVICES = [
  "Inspektion & Wartung",
  "Ölwechsel",
  "Bremsen",
  "Reifenwechsel",
  "Klimaservice",
  "Elektronik-Diagnose",
  "Unfallreparatur",
  "TÜV / AU",
  "Sonstiges",
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
