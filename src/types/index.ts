export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'watches';
  material: string;
  stock: number;
  image: string;
  featured: boolean;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: Date;
  totalPurchases: number;
  loyaltyPoints: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  notes: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  customization?: string;
}

export interface RepairOrder {
  id: string;
  customerId: string;
  itemDescription: string;
  issue: string;
  status: 'received' | 'diagnosing' | 'repairing' | 'completed' | 'delivered';
  estimatedCost: number;
  finalCost?: number;
  receivedAt: Date;
  estimatedCompletion: Date;
  completedAt?: Date;
  notes: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  type: 'consultation' | 'pickup' | 'repair_dropoff' | 'custom_design';
  date: Date;
  time: string;
  duration: number;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}
