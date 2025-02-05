/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Product } from "@/types";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { toast } from "sonner";
import { ItemList } from "@/components/forms/ItemList";
import { BusinessSelect } from "@/components/forms/BusinessSelect";

export default function CreateInvoice() {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [additionalAddress, setAdditionalAddress] = useState("");
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
        setProducts(data);
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
          clientName,
          clientEmail,
          clientAddress,
          additionalAddress,
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
        <div>
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="clientEmail">Client Email</Label>
          <Input
            id="clientEmail"
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="clientAddress">Client Address</Label>
          <Textarea
            id="clientAddress"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            placeholder="Enter client's primary address"
          />
        </div>
        <div>
          <Label htmlFor="additionalAddress">Additional Address</Label>
          <Textarea
            id="additionalAddress"
            value={additionalAddress}
            onChange={(e) => setAdditionalAddress(e.target.value)}
            placeholder="Enter additional address details (optional)"
          />
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
