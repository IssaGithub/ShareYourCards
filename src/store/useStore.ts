import { create } from 'zustand';
import type { Product, Customer, Order, RepairOrder, Appointment } from '../types';
import { products as initialProducts, customers as initialCustomers, orders as initialOrders, repairOrders as initialRepairOrders, appointments as initialAppointments } from '../data/mockData';

interface StoreState {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  repairOrders: RepairOrder[];
  appointments: Appointment[];
  
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  
  addRepairOrder: (repairOrder: RepairOrder) => void;
  updateRepairOrderStatus: (id: string, status: RepairOrder['status']) => void;
  
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
}

export const useStore = create<StoreState>((set) => ({
  products: initialProducts,
  customers: initialCustomers,
  orders: initialOrders,
  repairOrders: initialRepairOrders,
  appointments: initialAppointments,
  
  addProduct: (product) => set((state) => ({ 
    products: [...state.products, product] 
  })),
  
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map((p) => p.id === id ? { ...p, ...updates } : p)
  })),
  
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id)
  })),
  
  addCustomer: (customer) => set((state) => ({
    customers: [...state.customers, customer]
  })),
  
  updateCustomer: (id, updates) => set((state) => ({
    customers: state.customers.map((c) => c.id === id ? { ...c, ...updates } : c)
  })),
  
  deleteCustomer: (id) => set((state) => ({
    customers: state.customers.filter((c) => c.id !== id)
  })),
  
  addOrder: (order) => set((state) => ({
    orders: [...state.orders, order]
  })),
  
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map((o) => o.id === id ? { ...o, status, updatedAt: new Date() } : o)
  })),
  
  addRepairOrder: (repairOrder) => set((state) => ({
    repairOrders: [...state.repairOrders, repairOrder]
  })),
  
  updateRepairOrderStatus: (id, status) => set((state) => ({
    repairOrders: state.repairOrders.map((r) => r.id === id ? { ...r, status } : r)
  })),
  
  addAppointment: (appointment) => set((state) => ({
    appointments: [...state.appointments, appointment]
  })),
  
  updateAppointmentStatus: (id, status) => set((state) => ({
    appointments: state.appointments.map((a) => a.id === id ? { ...a, status } : a)
  })),
}));
