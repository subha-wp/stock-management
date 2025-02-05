/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Invoice } from "@/types";
import { getInvoices } from "../services/api";
import { toast } from "sonner";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const data = await getInvoices();
        setInvoices(data);
      } catch (error) {
        toast.error("Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  return { invoices, loading };
}
