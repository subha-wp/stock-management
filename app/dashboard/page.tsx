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
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarIcon,
  TrendingUp,
  DollarSign,
  CreditCard,
  Package2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Invoice, Product } from "@/types";
import Link from "next/link";

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [period, setPeriod] = useState("today");
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
        // Fetch invoices
        const invoicesResponse = await fetch("/api/invoices?limit=5");
        const invoicesData = await invoicesResponse.json();

        // Fetch low stock alerts
        const stockResponse = await fetch("/api/stock/alerts");
        const lowStockProducts = await stockResponse.json();

        // Calculate total sales and credit
        const totalSales = invoicesData.invoices.reduce(
          (sum: number, invoice: Invoice) => sum + invoice.total,
          0
        );
        const totalCredit = invoicesData.invoices.reduce(
          (sum: number, invoice: Invoice) =>
            sum + (invoice.total - invoice.amountPaid),
          0
        );

        setStats({
          totalSales,
          totalCredit,
          totalProducts: lowStockProducts.length,
          pendingInvoices: invoicesData.invoices.filter(
            (invoice: Invoice) =>
              invoice.status === "PENDING" || invoice.status === "OVERDUE"
          ).length,
          recentInvoices: invoicesData.invoices,
          lowStockProducts,
          salesTrend: 12.5, // Example trend percentage
          creditTrend: -5.2, // Example trend percentage
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [period, dateRange]);

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
        <div className="flex gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Date Range"
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Select Date Range</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
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
                {Math.abs(stats.salesTrend)}%
              </span>
              <span className="ml-1">from last month</span>
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
                {Math.abs(stats.creditTrend)}%
              </span>
              <span className="ml-1">from last month</span>
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
                {stats.recentInvoices.map((invoice) => (
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
