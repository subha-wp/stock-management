"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useClients } from "@/lib/hooks/useClients";
import { format } from "date-fns";

export default function ClientReportsPage() {
  const { clients, loading, search, setSearch } = useClients();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Sort clients by total credit in descending order
  const sortedClients = [...clients].sort(
    (a, b) => b.totalCredit - a.totalCredit
  );

  const totalCredit = clients.reduce(
    (sum, client) => sum + client.totalCredit,
    0
  );
  const averageCredit = totalCredit / clients.length || 0;
  const highRiskClients = clients.filter(
    (client) => client.totalCredit > 10000
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalCredit.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Average Credit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{averageCredit.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              High Risk Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highRiskClients}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Credit Report</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Outstanding Amount</TableHead>
                <TableHead>Last Invoice Date</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedClients.map((client) => {
                let riskLevel = "Low";
                let riskColor = "text-green-600";

                if (client.totalCredit > 10000) {
                  riskLevel = "High";
                  riskColor = "text-red-600";
                } else if (client.totalCredit > 5000) {
                  riskLevel = "Medium";
                  riskColor = "text-yellow-600";
                }

                return (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{client.phone}</p>
                        <p className="text-muted-foreground">{client.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>₹{client.totalCredit.toFixed(2)}</TableCell>
                    <TableCell>
                      {format(new Date(client.updatedAt), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className={riskColor}>{riskLevel}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
