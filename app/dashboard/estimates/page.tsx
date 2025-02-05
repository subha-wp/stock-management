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
import { useEstimates } from "@/lib/hooks/useEstimates";

export default function EstimatesPage() {
  const { estimates, loading } = useEstimates();

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        aria-live="polite"
      >
        Loading estimates...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20">
      <h1 className="text-2xl font-bold my-4">Estimates</h1>
      <Button asChild className="w-full mb-4">
        <Link href="/dashboard/estimates/create">Create New Estimate</Link>
      </Button>
      <div className="space-y-4">
        {estimates.map((estimate) => (
          <Card key={estimate.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Estimate #{estimate.number}</span>
                <Badge>{estimate.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Client: {estimate.clientName}
              </p>
              <p className="text-sm text-gray-600">
                Date:{" "}
                {new Date(estimate.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600">
                Expiry:{" "}
                {new Date(estimate.expiryDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="font-bold mt-2">
                Total: ₹{estimate.total.toFixed(2)}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/dashboard/estimates/${estimate.id}`}>
                  View Estimate
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
