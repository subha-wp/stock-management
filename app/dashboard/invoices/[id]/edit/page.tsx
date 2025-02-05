/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DocumentForm } from "@/components/forms/DocumentForm";
import { Invoice } from "@/types";
import { getInvoice, updateInvoice } from "@/lib/services/api";
import { toast } from "sonner";

export default function EditInvoicePage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const data = await getInvoice(id as string);
        setInvoice(data);
      } catch (error) {
        toast.error("Failed to fetch invoice");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  const handleSubmit = async (data: any) => {
    await updateInvoice(id as string, data);
  };

  return (
    <DocumentForm
      type="invoice"
      initialData={invoice}
      onSubmit={handleSubmit}
    />
  );
}
