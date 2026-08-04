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
  type Vehicle,
  type WorkOrder,
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
  addWorkOrder: (input: Omit<WorkOrder, "id">) => WorkOrder;
  updateWorkOrder: (id: string, patch: Partial<WorkOrder>) => void;
  deleteWorkOrder: (id: string) => void;
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
    return JSON.parse(raw) as CrmData;
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
          workOrders: prev.workOrders.filter((w) => w.customerId !== id),
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
          workOrders: prev.workOrders.filter((w) => w.vehicleId !== id),
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
      addWorkOrder: (input) => {
        const workOrder: WorkOrder = { ...input, id: uid("wo") };
        setStore((prev) => ({
          ...prev,
          workOrders: [workOrder, ...prev.workOrders],
        }));
        return workOrder;
      },
      updateWorkOrder: (id, patch) => {
        setStore((prev) => ({
          ...prev,
          workOrders: prev.workOrders.map((w) =>
            w.id === id ? { ...w, ...patch } : w
          ),
        }));
      },
      deleteWorkOrder: (id) => {
        setStore((prev) => ({
          ...prev,
          workOrders: prev.workOrders.filter((w) => w.id !== id),
        }));
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
