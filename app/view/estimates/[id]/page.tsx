/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EstimatePDF } from "@/components/estimate-pdf";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Estimate } from "@/types";
import { ItemTable } from "@/components/document/ItemTable";

export default function PublicEstimateView() {
  const { id } = useParams();
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEstimate() {
      try {
        const response = await fetch(`/api/public/estimates/${id}`);
        if (!response.ok) throw new Error("Failed to fetch estimate");
        const data = await response.json();
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
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Estimate #{estimate.number}</CardTitle>
          <PDFDownloadLink
            document={<EstimatePDF estimate={estimate} />}
            fileName={`estimate-${estimate.number}.pdf`}
          >
            {({ loading }) => (
              <Button size="sm" disabled={loading}>
                <Download className="w-4 h-4 mr-2" />
                {loading ? "Generating..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Business Details</h3>
              <p className="text-sm">{estimate.business?.name}</p>
              <p className="text-sm">{estimate.business?.address}</p>
              <p className="text-sm">{estimate.business?.email}</p>
              <p className="text-sm">{estimate.business?.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Client Details</h3>
              <p className="text-sm">Name: {estimate.clientName}</p>
              <p className="text-sm">Email: {estimate.clientEmail}</p>
              <p className="text-sm">Address: {estimate.clientAddress}</p>
              {estimate.clientAddress && (
                <p className="text-sm">
                  Additional Address: {estimate.additionalAddress}
                </p>
              )}
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

          {estimate.business?.bankName && (
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
