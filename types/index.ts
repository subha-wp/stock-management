export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface Business {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  bankName?: string;
  ifscCode?: string;
  accountNo?: string;
  upiId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  taxPercent: number;
  userId: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  additionalAddress?: string;
  date: Date;
  dueDate: Date;
  status: string;
  total: number;
  userId: string;
  businessId: string;
  business?: Business;
  items?: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  quantity: number;
  productId: string;
  product: Product;
  invoiceId: string;
}

export interface Estimate {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  additionalAddress?: string;
  date: Date;
  expiryDate: Date;
  status: string;
  total: number;
  userId: string;
  businessId: string;
  business?: Business;
  items?: EstimateItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EstimateItem {
  id: string;
  quantity: number;
  productId: string;
  product: Product;
  estimateId: string;
}
