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
  Receipt,
  PiggyBank,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Invoice, Product, Expense } from "@/types";
import Link from "next/link";
import { toast } from "sonner";

interface DashboardStats {
  totalSales: number;
  totalCredit: number;
  totalProducts: number;
  pendingInvoices: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  recentInvoices: Invoice[];
  recentExpenses: Expense[];
  lowStockProducts: Product[];
  salesTrend: number;
  creditTrend: number;
  expenseTrend: number;
  grossProfitTrend: number;
  netProfitTrend: number;
  profitMetrics: {
    totalCost: number;
    grossMarginPercent: number;
    netMarginPercent: number;
  };
}

export default function DashboardPage() {
  const [period, setPeriod] = useState("7days");
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalCredit: 0,
    totalProducts: 0,
    pendingInvoices: 0,
    totalExpenses: 0,
    grossProfit: 0,
    netProfit: 0,
    recentInvoices: [],
    recentExpenses: [],
    lowStockProducts: [],
    salesTrend: 0,
    creditTrend: 0,
    expenseTrend: 0,
    grossProfitTrend: 0,
    netProfitTrend: 0,
    profitMetrics: {
      totalCost: 0,
      grossMarginPercent: 0,
      netMarginPercent: 0,
    },
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
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
            <PiggyBank
              className={`h-4 w-4 ${
                stats.grossProfitTrend >= 0 ? "text-green-500" : "text-red-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.grossProfit.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.grossProfitTrend >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  stats.grossProfitTrend >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {Math.abs(stats.grossProfitTrend).toFixed(1)}%
              </span>
              <span className="ml-1">from last period</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Margin: {stats.profitMetrics.grossMarginPercent.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <Receipt
              className={`h-4 w-4 ${
                stats.expenseTrend <= 0 ? "text-green-500" : "text-red-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.totalExpenses.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.expenseTrend <= 0 ? (
                <ArrowDownRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowUpRight className="h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  stats.expenseTrend <= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {Math.abs(stats.expenseTrend).toFixed(1)}%
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Wallet
              className={`h-4 w-4 ${
                stats.netProfitTrend >= 0 ? "text-green-500" : "text-red-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                stats.netProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{Math.abs(stats.netProfit).toLocaleString()}
              <span className="text-sm ml-1">
                {stats.netProfit >= 0 ? "Profit" : "Loss"}
              </span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.netProfitTrend >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  stats.netProfitTrend >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {Math.abs(stats.netProfitTrend).toFixed(1)}%
              </span>
              <span className="ml-1">from last period</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Margin: {stats.profitMetrics.netMarginPercent.toFixed(1)}%
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
                {stats.recentInvoices.slice(0, 5).map((invoice) => (
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
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentExpenses.slice(0, 5).map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{expense.description || "-"}</TableCell>
                    <TableCell>₹{expense.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {stats.recentExpenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No recent expenses found
                    </TableCell>
                  </TableRow>
                )}
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
