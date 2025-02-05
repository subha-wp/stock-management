/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Download } from "lucide-react";
import { toast } from "sonner";
import { Invoice } from "@/types";
import { InvoiceWeb } from "@/components/invoice-web";
import { InvoicePDF } from "@/components/invoice-pdf";
import { ItemTable } from "@/components/document/ItemTable";

export default function PublicInvoiceView() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const response = await fetch(`/api/public/invoices/${id}`);
        if (!response.ok) throw new Error("Failed to fetch invoice");
        const data = await response.json();
        setInvoice(data);
      } catch (error) {
        toast.error("Failed to fetch invoice details");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex justify-center items-center h-screen">
        Invoice not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Invoice #{invoice.number}</CardTitle>
          <PDFDownloadLink
            document={<InvoicePDF invoice={invoice} />}
            fileName={`invoice-${invoice.number}.pdf`}
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
              <p className="text-sm">{invoice.business?.name}</p>
              <p className="text-sm">{invoice.business?.address}</p>
              <p className="text-sm">{invoice.business?.email}</p>
              <p className="text-sm">{invoice.business?.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Client Details</h3>
              <p className="text-sm">Name: {invoice.clientName}</p>
              <p className="text-sm">Email: {invoice.clientEmail}</p>
              <p className="text-sm">Address: {invoice.clientAddress}</p>
              {invoice.clientAddress && (
                <p className="text-sm">
                  Additional Address: {invoice.additionalAddress}
                </p>
              )}
              <p className="text-sm">
                Date:{" "}
                {new Date(invoice.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm">
                Due Date:{" "}
                {new Date(invoice.dueDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm">Status: {invoice.status}</p>
            </div>
          </div>

          <ItemTable items={invoice.items} />

          {invoice.business?.bankName && (
            <div>
              <h3 className="font-semibold mb-2">Payment Details</h3>
              <p className="text-sm">Bank Name: {invoice.business.bankName}</p>
              <p className="text-sm">
                Account No: {invoice.business.accountNo}
              </p>
              <p className="text-sm">IFSC Code: {invoice.business.ifscCode}</p>
              {invoice.business.upiId && (
                <p className="text-sm">UPI ID: {invoice.business.upiId}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
