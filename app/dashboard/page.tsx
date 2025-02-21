"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Package2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Invoice, Product } from "@/types";
import Link from "next/link";
import { toast } from "sonner";

interface DashboardStats {
  totalSales: number;
  totalCredit: number;
  totalProducts: number;
  pendingInvoices: number;
  recentInvoices: Invoice[];
  lowStockProducts: Product[];
  salesTrend: number;
  creditTrend: number;
}

export default function DashboardPage() {
  const [period, setPeriod] = useState("7days");
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalCredit: 0,
    totalProducts: 0,
    pendingInvoices: 0,
    recentInvoices: [],
    lowStockProducts: [],
    salesTrend: 0,
    creditTrend: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch(`/api/dashboard?period=${period}`);
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp
              className={`h-4 w-4 ${
                stats.salesTrend >= 0 ? "text-green-500" : "text-red-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.totalSales.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.salesTrend >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  stats.salesTrend >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {Math.abs(stats.salesTrend).toFixed(1)}%
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Credit</CardTitle>
            <CreditCard
              className={`h-4 w-4 ${
                stats.creditTrend >= 0 ? "text-green-500" : "text-red-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.totalCredit.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.creditTrend >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  stats.creditTrend >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {Math.abs(stats.creditTrend).toFixed(1)}%
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Products
            </CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Products below minimum stock level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Invoices
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment or overdue
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentInvoices.slice(0, 10).map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="hover:underline"
                      >
                        #{invoice.number}
                      </Link>
                    </TableCell>
                    <TableCell>{invoice.client.name}</TableCell>
                    <TableCell>₹{invoice.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "PAID"
                            ? "default"
                            : invoice.status === "PENDING"
                            ? "secondary"
                            : invoice.status === "OVERDUE"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.lowStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="hover:underline"
                      >
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.minStock}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <AlertTriangle
                          className={`h-4 w-4 mr-1 ${
                            product.stock === 0
                              ? "text-destructive"
                              : "text-yellow-500"
                          }`}
                        />
                        <span
                          className={
                            product.stock === 0
                              ? "text-destructive"
                              : "text-yellow-500"
                          }
                        >
                          {product.stock === 0 ? "Out of Stock" : "Low Stock"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
