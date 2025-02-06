/* eslint-disable @typescript-eslint/no-unused-vars */
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) {
      toast.error("Please select a business");
      return;
    }

    if (!client) {
      toast.error("Please select a client");
      return;
    }

    if (items.some((item) => !item.productId)) {
      toast.error("Please select products for all items");
      return;
    }

    setIsLoading(true);
    setError(null);
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
          items,
          businessId,
        }),
      });
      if (!response.ok) throw new Error("Failed to create invoice");
      toast.success("Invoice created successfully");
      router.push("/dashboard/invoices");
    } catch (err) {
      toast.error("Failed to create invoice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
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
