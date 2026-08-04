"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { seedData, STORAGE_KEY } from "./seed";
import {
  uid,
  type Appointment,
  type CrmData,
  type Customer,
  type GutachtenCase,
  type Lead,
  type Vehicle,
} from "./types";

type CrmContextValue = {
  ready: boolean;
  data: CrmData;
  addCustomer: (input: Omit<Customer, "id" | "createdAt">) => Customer;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addVehicle: (input: Omit<Vehicle, "id">) => Vehicle;
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addAppointment: (input: Omit<Appointment, "id">) => Appointment;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  addCase: (input: Omit<GutachtenCase, "id">) => GutachtenCase;
  updateCase: (id: string, patch: Partial<GutachtenCase>) => void;
  deleteCase: (id: string) => void;
  addLead: (input: Omit<Lead, "id" | "createdAt" | "convertedCustomerId">) => Lead;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  convertLead: (id: string) => Customer | null;
  resetData: () => void;
  getCustomer: (id: string) => Customer | undefined;
  getVehicle: (id: string) => Vehicle | undefined;
};

const CrmContext = createContext<CrmContextValue | null>(null);

type Listener = () => void;

let memoryData: CrmData = seedData;
let hydrated = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

function readStorage(): CrmData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedData;
    const parsed = JSON.parse(raw) as Partial<CrmData>;
    return {
      customers: parsed.customers ?? seedData.customers,
      vehicles: parsed.vehicles ?? seedData.vehicles,
      appointments: parsed.appointments ?? seedData.appointments,
      cases: parsed.cases ?? seedData.cases,
      leads: parsed.leads ?? seedData.leads,
    };
  } catch {
    return seedData;
  }
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  memoryData = readStorage();
  hydrated = true;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): CrmData {
  ensureHydrated();
  return memoryData;
}

function getServerSnapshot(): CrmData {
  return seedData;
}

function setStore(updater: (prev: CrmData) => CrmData) {
  ensureHydrated();
  memoryData = updater(memoryData);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryData));
  } catch {
    /* ignore quota errors */
  }
  emit();
}

export function CrmProvider({ children }: { children: ReactNode }) {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = typeof window !== "undefined";

  const value = useMemo<CrmContextValue>(() => {
    return {
      ready,
      data,
      addCustomer: (input) => {
        const customer: Customer = {
          ...input,
          id: uid("cust"),
          createdAt: new Date().toISOString().slice(0, 10),
        };
        setStore((prev) => ({
          ...prev,
          customers: [customer, ...prev.customers],
        }));
        return customer;
      },
      updateCustomer: (id, patch) => {
        setStore((prev) => ({
          ...prev,
          customers: prev.customers.map((c) =>
            c.id === id ? { ...c, ...patch } : c
          ),
        }));
      },
      deleteCustomer: (id) => {
        setStore((prev) => ({
          ...prev,
          customers: prev.customers.filter((c) => c.id !== id),
          vehicles: prev.vehicles.filter((v) => v.customerId !== id),
          appointments: prev.appointments.filter((a) => a.customerId !== id),
          cases: prev.cases.filter((c) => c.customerId !== id),
        }));
      },
      addVehicle: (input) => {
        const vehicle: Vehicle = { ...input, id: uid("veh") };
        setStore((prev) => ({
          ...prev,
          vehicles: [vehicle, ...prev.vehicles],
        }));
        return vehicle;
      },
      updateVehicle: (id, patch) => {
        setStore((prev) => ({
          ...prev,
          vehicles: prev.vehicles.map((v) =>
            v.id === id ? { ...v, ...patch } : v
          ),
        }));
      },
      deleteVehicle: (id) => {
        setStore((prev) => ({
          ...prev,
          vehicles: prev.vehicles.filter((v) => v.id !== id),
          appointments: prev.appointments.filter((a) => a.vehicleId !== id),
          cases: prev.cases.filter((c) => c.vehicleId !== id),
        }));
      },
      addAppointment: (input) => {
        const appointment: Appointment = { ...input, id: uid("apt") };
        setStore((prev) => ({
          ...prev,
          appointments: [appointment, ...prev.appointments],
        }));
        return appointment;
      },
      updateAppointment: (id, patch) => {
        setStore((prev) => ({
          ...prev,
          appointments: prev.appointments.map((a) =>
            a.id === id ? { ...a, ...patch } : a
          ),
        }));
      },
      deleteAppointment: (id) => {
        setStore((prev) => ({
          ...prev,
          appointments: prev.appointments.filter((a) => a.id !== id),
        }));
      },
      addCase: (input) => {
        const gutachtenCase: GutachtenCase = { ...input, id: uid("case") };
        setStore((prev) => ({
          ...prev,
          cases: [gutachtenCase, ...prev.cases],
        }));
        return gutachtenCase;
      },
      updateCase: (id, patch) => {
        setStore((prev) => ({
          ...prev,
          cases: prev.cases.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }));
      },
      deleteCase: (id) => {
        setStore((prev) => ({
          ...prev,
          cases: prev.cases.filter((c) => c.id !== id),
        }));
      },
      addLead: (input) => {
        const lead: Lead = {
          ...input,
          id: uid("lead"),
          createdAt: new Date().toISOString().slice(0, 10),
          convertedCustomerId: null,
        };
        setStore((prev) => ({
          ...prev,
          leads: [lead, ...prev.leads],
        }));
        return lead;
      },
      updateLead: (id, patch) => {
        setStore((prev) => ({
          ...prev,
          leads: prev.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        }));
      },
      deleteLead: (id) => {
        setStore((prev) => ({
          ...prev,
          leads: prev.leads.filter((l) => l.id !== id),
        }));
      },
      convertLead: (id) => {
        ensureHydrated();
        const lead = memoryData.leads.find((l) => l.id === id);
        if (!lead || lead.convertedCustomerId) return null;
        const customer: Customer = {
          id: uid("cust"),
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          address: "",
          notes: `Aus Anfrage konvertiert · ${lead.gutachtenType}${
            lead.message ? ` · ${lead.message}` : ""
          }`,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        setStore((prev) => ({
          ...prev,
          customers: [customer, ...prev.customers],
          leads: prev.leads.map((l) =>
            l.id === id
              ? { ...l, status: "gewonnen", convertedCustomerId: customer.id }
              : l
          ),
        }));
        return customer;
      },
      resetData: () => {
        localStorage.removeItem(STORAGE_KEY);
        memoryData = seedData;
        emit();
      },
      getCustomer: (id) => data.customers.find((c) => c.id === id),
      getVehicle: (id) => data.vehicles.find((v) => v.id === id),
    };
  }, [data, ready]);

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm must be used within CrmProvider");
  return ctx;
}
