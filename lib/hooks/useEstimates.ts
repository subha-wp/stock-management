/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Estimate } from "@/types";
import { getEstimates } from "../services/api";
import { toast } from "sonner";

export function useEstimates() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEstimates() {
      try {
        const data = await getEstimates();
        setEstimates(data);
      } catch (error) {
        toast.error("Failed to fetch estimates");
      } finally {
        setLoading(false);
      }
    }

    fetchEstimates();
  }, []);

  return { estimates, loading };
}
