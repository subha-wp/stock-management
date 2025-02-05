/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getEstimate } from "@/lib/services/api";
import { Estimate } from "@/types";
import { toast } from "sonner";
import { ArrowLeft, Download, PenIcon } from "lucide-react";
import Link from "next/link";
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button";
import { ItemTable } from "@/components/document/ItemTable";

export default function EstimateDetail() {
  const { id } = useParams();
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEstimate() {
      try {
        const data = await getEstimate(id as string);
        setEstimate(data);
      } catch (error) {
        toast.error("Failed to fetch estimate details");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchEstimate();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="flex justify-center items-center h-screen">
        Estimate not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20 pt-4">
      <Link
        href="/dashboard/estimates"
        className="flex items-center text-sm mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Estimates
      </Link>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Estimate #{estimate.number}</CardTitle>
          <div className="space-y-1">
            <CopyToClipboardButton
              text={`${window.location.origin}/view/estimates/${id}`}
            />
            <Link
              href={`${window.location.origin}/dashboard/estimates/${id}/edit`}
            >
              <Button variant="outline" size="sm" className="mt-1 pr-5">
                <PenIcon className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Business Details</h3>
              <p className="text-sm">{estimate.business.name}</p>
              <p className="text-sm">{estimate.business.address}</p>
              <p className="text-sm">{estimate.business.email}</p>
              <p className="text-sm">{estimate.business.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Client Details</h3>
              <p className="text-sm">Name: {estimate.clientName}</p>
              <p className="text-sm">Email: {estimate.clientEmail}</p>
              <p className="text-sm">
                Date:{" "}
                {new Date(estimate.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm">
                Expiry Date:{" "}
                {new Date(estimate.expiryDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm">Status: {estimate.status}</p>
            </div>
          </div>

          <ItemTable items={estimate.items} />

          {estimate.business.bankName && (
            <div>
              <h3 className="font-semibold mb-2">Payment Details</h3>
              <p className="text-sm">Bank Name: {estimate.business.bankName}</p>
              <p className="text-sm">
                Account No: {estimate.business.accountNo}
              </p>
              <p className="text-sm">IFSC Code: {estimate.business.ifscCode}</p>
              {estimate.business.upiId && (
                <p className="text-sm">UPI ID: {estimate.business.upiId}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
