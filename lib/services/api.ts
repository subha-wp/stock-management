import { Business, Estimate, Invoice, Product } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Business Services
export async function getBusinesses(): Promise<Business[]> {
  const response = await fetch(`${BASE_URL}/api/business`);
  if (!response.ok) throw new Error("Failed to fetch businesses");
  return response.json();
}

export async function getBusiness(id: string): Promise<Business> {
  const response = await fetch(`${BASE_URL}/api/business/${id}`);
  if (!response.ok) throw new Error("Failed to fetch business");
  return response.json();
}

export async function createBusiness(
  data: Omit<Business, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<Business> {
  const response = await fetch(`${BASE_URL}/api/business`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create business");
  return response.json();
}

export async function updateBusiness(
  id: string,
  data: Partial<Business>
): Promise<Business> {
  const response = await fetch(`${BASE_URL}/api/business/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update business");
  return response.json();
}

// Product Services
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/api/products`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`${BASE_URL}/api/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
}

export async function createProduct(
  data: Omit<Product, "id" | "userId">
): Promise<Product> {
  const response = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create product");
  return response.json();
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<Product> {
  const response = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update product");
  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete product");
}

// Invoice Services
export async function getInvoices(): Promise<Invoice[]> {
  const response = await fetch(`${BASE_URL}/api/invoices`);
  if (!response.ok) throw new Error("Failed to fetch invoices");
  return response.json();
}

export async function getInvoice(id: string): Promise<Invoice> {
  const response = await fetch(`${BASE_URL}/api/invoices/${id}`);
  if (!response.ok) throw new Error("Failed to fetch invoice");
  return response.json();
}

export async function createInvoice(
  data: Omit<Invoice, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<Invoice> {
  const response = await fetch(`${BASE_URL}/api/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create invoice");
  return response.json();
}

export async function updateInvoice(
  id: string,
  data: Partial<Invoice>
): Promise<Invoice> {
  const response = await fetch(`${BASE_URL}/api/invoices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update invoice");
  return response.json();
}

// Estimate Services
export async function getEstimates(): Promise<Estimate[]> {
  const response = await fetch(`${BASE_URL}/api/estimates`);
  if (!response.ok) throw new Error("Failed to fetch estimates");
  return response.json();
}

export async function getEstimate(id: string): Promise<Estimate> {
  const response = await fetch(`${BASE_URL}/api/estimates/${id}`);
  if (!response.ok) throw new Error("Failed to fetch estimate");
  return response.json();
}

export async function createEstimate(
  data: Omit<Estimate, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<Estimate> {
  const response = await fetch(`${BASE_URL}/api/estimates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create estimate");
  return response.json();
}

export async function updateEstimate(
  id: string,
  data: Partial<Estimate>
): Promise<Estimate> {
  const response = await fetch(`${BASE_URL}/api/estimates/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update estimate");
  return response.json();
}
