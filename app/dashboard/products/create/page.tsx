/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProduct } from "@/lib/services/api";
import { toast } from "sonner";
import { ImageList } from "@/components/products/ImageList";

const units = [
  "piece",
  "kg",
  "g",
  "mg",
  "l",
  "ml",
  "m",
  "cm",
  "mm",
  "Nos",
  "Ft",
];

export default function CreateProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("piece");
  const [taxPercent, setTaxPercent] = useState("0");
  const [stock, setStock] = useState("0");
  const [minStock, setMinStock] = useState("0");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createProduct({
        name,
        description,
        price: parseFloat(price),
        unit,
        taxPercent: parseFloat(taxPercent),
        stock: parseInt(stock),
        minStock: parseInt(minStock),
        images: images.filter(Boolean), // Remove empty strings
      });
      toast.success("Product created successfully");
      router.push("/dashboard/products");
    } catch (error) {
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addImage = () => {
    setImages([...images, ""]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      <h1 className="text-2xl font-bold my-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="unit">Unit</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="stock">Initial Stock</Label>
          <Input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="minStock">Minimum Stock Level</Label>
          <Input
            id="minStock"
            type="number"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="taxPercent">Tax Percentage (GST)</Label>
          <Input
            id="taxPercent"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={taxPercent}
            onChange={(e) => setTaxPercent(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Product Images (Optional)</Label>
          <ImageList
            images={images}
            onAdd={addImage}
            onRemove={removeImage}
            onUpdate={updateImage}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
