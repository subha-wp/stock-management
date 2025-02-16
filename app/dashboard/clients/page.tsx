"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClients } from "@/lib/hooks/useClients";
import { Search, FileText, ChevronLeft, ChevronRight } from "lucide-react";

export default function ClientsPage() {
  const { clients, loading, pagination, search, setSearch, page, setPage } =
    useClients();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button asChild>
          <Link href="/dashboard/clients/create">Add New Customers</Link>
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Total Dues</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.email || "-"}</TableCell>
                <TableCell>{client.address || "-"}</TableCell>
                <TableCell>₹{client.totalCredit.toFixed(2)}</TableCell>
                <TableCell>
                  <Button asChild size="sm">
                    <Link href={`/dashboard/clients/${client.id}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.pages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
