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
  stock: number;
  minStock: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockLog {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  type: string;
  note?: string;
  userId: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoice: Invoice;
  amount: number;
  method: string;
  reference?: string;
  note?: string;
  userId: string;
  date: Date;
  createdAt: Date;
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
  amountPaid: number;
  balance: number;
  userId: string;
  businessId: string;
  business?: Business;
  items?: InvoiceItem[];
  payments?: Payment[];
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
