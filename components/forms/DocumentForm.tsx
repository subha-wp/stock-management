/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product, Invoice } from "@/types";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { toast } from "sonner";
import { ItemList } from "./ItemList";
import { BusinessSelect } from "./BusinessSelect";

interface DocumentFormProps {
  type: "invoice";
  initialData?: Invoice;
  onSubmit: (data: any) => Promise<void>;
}

export function DocumentForm({
  type,
  initialData,
  onSubmit,
}: DocumentFormProps) {
  const [clientName, setClientName] = useState(initialData?.clientName || "");
  const [clientEmail, setClientEmail] = useState(
    initialData?.clientEmail || ""
  );
  const [clientAddress, setClientAddress] = useState(
    initialData?.clientAddress || ""
  );
  const [additionalAddress, setAdditionalAddress] = useState(
    initialData?.additionalAddress || ""
  );
  const [date, setDate] = useState(
    initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    initialData
      ? new Date(type === "invoice" ? (initialData as Invoice).dueDate : "")
          .toISOString()
          .split("T")[0]
      : ""
  );
  const [businessId, setBusinessId] = useState(initialData?.businessId || "");
  const [items, setItems] = useState(
    initialData?.items?.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })) || [{ productId: "", quantity: 1 }]
  );
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
        setProducts(data.products); // Update this line to access the products array
      } catch (err) {
        setError("Failed to load products. Please try again.");
        toast.error("Failed to load products");
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
      await onSubmit({
        clientName,
        clientEmail,
        clientAddress,
        additionalAddress,
        date,
        [type === "invoice" ? "dueDate" : "expiryDate"]: endDate,
        items,
        businessId,
        status: initialData?.status || "PENDING",
      });

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} ${
          initialData ? "updated" : "created"
        } successfully`
      );
      router.push(`/dashboard/${type}s`);
    } catch (err) {
      toast.error(
        `Failed to ${
          initialData ? "update" : "create"
        } ${type}. Please try again.`
      );
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
      <h1 className="text-2xl font-bold my-4">
        {initialData ? "Edit" : "Create New"}{" "}
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </h1>
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
          <Label htmlFor="endDate">
            {type === "invoice" ? "Due Date" : "Expiry Date"}
          </Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
          {isLoading
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
            ? "Update"
            : "Create"}
        </Button>
      </form>
    </div>
  );
}
