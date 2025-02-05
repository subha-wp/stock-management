"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInvoices } from "@/lib/hooks/useInvoices";

export default function InvoicesPage() {
  const { invoices, loading } = useInvoices();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading invoices...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20">
      <h1 className="text-2xl font-bold my-4">Invoices</h1>
      <Button asChild className="w-full mb-4">
        <Link href="/dashboard/invoices/create">Create New Invoice</Link>
      </Button>
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Invoice #{invoice.number}</span>
                <Badge>{invoice.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{invoice.clientName}</p>
              <p className="text-sm text-gray-600">
                Date:{" "}
                {new Date(invoice.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600">
                Due:{" "}
                {new Date(invoice.dueDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="font-bold mt-2">₹{invoice.total.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/dashboard/invoices/${invoice.id}`}>View</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
