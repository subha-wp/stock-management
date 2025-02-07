// app/dashboard/invoices/create/page.tsx
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product, Client } from "@/types";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { toast } from "sonner";
import { ItemList } from "@/components/forms/ItemList";
import { BusinessSelect } from "@/components/forms/BusinessSelect";
import { ClientSearch } from "@/components/forms/ClientSearch";

export default function CreateInvoice() {
  const [client, setClient] = useState<Client | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { businesses, loading: loadingBusinesses } = useBusiness();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products || []); // Ensure we always set an array
      } catch (err) {
        setError("Failed to load products. Please try again.");
      }
    }
    fetchProducts();
  }, []);

  const validateForm = () => {
    if (!businessId) {
      toast.error("Please select a business");
      return false;
    }

    if (!client) {
      toast.error("Please select a client");
      return false;
    }

    if (!dueDate) {
      toast.error("Please select a due date");
      return false;
    }

    if (items.length === 0) {
      toast.error("Please add at least one item");
      return false;
    }

    if (items.some((item) => !item.productId || item.quantity < 1)) {
      toast.error("Please fill in all item details correctly");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log("clientId", client?.id);

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: client.id,
          date,
          dueDate,
          items: items.filter((item) => item.productId && item.quantity > 0),
          businessId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create invoice");
      }

      toast.success("Invoice created successfully");
      router.push("/dashboard/invoices");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create invoice. Please try again.";
      toast.error(message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    } else {
      toast.error("You must have at least one item");
    }
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  if (loadingBusinesses) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 pb-20">
      <h1 className="text-2xl font-bold my-4">Create New Invoice</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="business">Select Business</Label>
          <BusinessSelect
            businesses={businesses}
            value={businessId}
            onChange={setBusinessId}
          />
        </div>

        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Client Information</h2>
          {client ? (
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {client.name}
              </p>
              <p>
                <strong>Phone:</strong> {client.phone}
              </p>
              {client.email && (
                <p>
                  <strong>Email:</strong> {client.email}
                </p>
              )}
              {client.address && (
                <p>
                  <strong>Address:</strong> {client.address}
                </p>
              )}
              <p>
                <strong>Total Credit:</strong> ₹{client.totalCredit.toFixed(2)}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setClient(null)}
              >
                Change Client
              </Button>
            </div>
          ) : (
            <ClientSearch onClientSelect={setClient} />
          )}
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={date}
            required
          />
        </div>
        <div>
          <Label>Items</Label>
          <ItemList
            items={items}
            products={products}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onUpdateItem={updateItem}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Invoice"}
        </Button>
      </form>
    </div>
  );
}
