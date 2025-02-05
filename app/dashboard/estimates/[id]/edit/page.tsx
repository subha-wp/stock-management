/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DocumentForm } from "@/components/forms/DocumentForm";
import { Estimate } from "@/types";
import { getEstimate, updateEstimate } from "@/lib/services/api";
import { toast } from "sonner";

export default function EditEstimatePage() {
  const { id } = useParams();
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEstimate() {
      try {
        const data = await getEstimate(id as string);
        setEstimate(data);
      } catch (error) {
        toast.error("Failed to fetch estimate");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchEstimate();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!estimate) {
    return <div>Estimate not found</div>;
  }

  const handleSubmit = async (data: any) => {
    await updateEstimate(id as string, data);
  };

  return (
    <DocumentForm
      type="estimate"
      initialData={estimate}
      onSubmit={handleSubmit}
    />
  );
}
