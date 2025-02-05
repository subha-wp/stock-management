"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProducts } from "@/lib/hooks/useProducts";

export default function ProductsPage() {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading products...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20">
      <h1 className="text-2xl font-bold my-4">Products</h1>
      <Button asChild className="mb-4">
        <Link href="/dashboard/products/create">Add New Product</Link>
      </Button>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>₹{product.price.toFixed(2)}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>
                  <Button asChild size="sm">
                    <Link href={`/dashboard/products/${product.id}`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
