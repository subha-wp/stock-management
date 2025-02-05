/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { getProduct, updateProduct, deleteProduct } from "@/lib/services/api";
import { toast } from "sonner";

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

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("piece");
  const [taxPercent, setTaxPercent] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProduct(id as string);
        setName(product.name);
        setDescription(product.description || "");
        setPrice(product.price.toString());
        setUnit(product.unit);
        setTaxPercent(product.taxPercent.toString());
      } catch (error) {
        toast.error("Failed to fetch product details");
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProduct(id as string, {
        name,
        description,
        price: parseFloat(price),
        unit,
        taxPercent: parseFloat(taxPercent),
      });
      toast.success("Product updated successfully");
      router.push("/dashboard/products");
    } catch (error) {
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(id as string);
      toast.success("Product deleted successfully");
      router.push("/dashboard/products");
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
      setIsDrawerOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      <h1 className="text-2xl font-bold my-4">Edit Product</h1>
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
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/dashboard/products")}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </form>
      <div className="mt-8">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button type="button" variant="destructive">
              Delete Product
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                Are you sure you want to delete this product?
              </DrawerTitle>
              <DrawerDescription>
                This action cannot be undone. This will permanently delete the
                product and remove its data from our servers.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                variant="destructive"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Product"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
