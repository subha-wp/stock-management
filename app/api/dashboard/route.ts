import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { subDays, startOfDay, endOfDay } from "date-fns";

export async function GET(request: Request) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "today";

    // Calculate date range based on period
    let startDate = new Date();
    let endDate = new Date();

    switch (period) {
      case "today":
        startDate = startOfDay(new Date());
        endDate = endOfDay(new Date());
        break;
      case "7days":
        startDate = startOfDay(subDays(new Date(), 7));
        endDate = endOfDay(new Date());
        break;
      case "30days":
        startDate = startOfDay(subDays(new Date(), 30));
        endDate = endOfDay(new Date());
        break;
      case "all":
        startDate = new Date(0); // Beginning of time
        endDate = new Date();
        break;
    }

    // Get invoices for the period
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        client: true,
        payments: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // Get low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: {
        userId: user.id,
        stock: {
          lte: prisma.product.fields.minStock,
        },
      },
    });

    // Calculate previous period for trend comparison
    const periodDays = period === "7days" ? 7 : period === "30days" ? 30 : 1;
    const previousStartDate = startOfDay(subDays(startDate, periodDays));
    const previousEndDate = endOfDay(subDays(endDate, periodDays));

    // Get previous period data for comparison
    const previousPeriodInvoices = await prisma.invoice.findMany({
      where: {
        userId: user.id,
        date: {
          gte: previousStartDate,
          lte: previousEndDate,
        },
      },
      include: {
        payments: true,
      },
    });

    // Calculate totals
    const totalSales = invoices.reduce(
      (sum, invoice) => sum + invoice.total,
      0
    );
    const previousTotalSales = previousPeriodInvoices.reduce(
      (sum, invoice) => sum + invoice.total,
      0
    );

    const totalCredit = invoices.reduce(
      (sum, invoice) => sum + (invoice.total - invoice.amountPaid),
      0
    );
    const previousTotalCredit = previousPeriodInvoices.reduce(
      (sum, invoice) => sum + (invoice.total - invoice.amountPaid),
      0
    );

    // Calculate trends
    const salesTrend =
      previousTotalSales === 0
        ? 100
        : ((totalSales - previousTotalSales) / previousTotalSales) * 100;

    const creditTrend =
      previousTotalCredit === 0
        ? 100
        : ((totalCredit - previousTotalCredit) / previousTotalCredit) * 100;

    return NextResponse.json({
      totalSales,
      totalCredit,
      totalProducts: lowStockProducts.length,
      pendingInvoices: invoices.filter(
        (invoice) =>
          invoice.status === "PENDING" || invoice.status === "OVERDUE"
      ).length,
      recentInvoices: invoices,
      lowStockProducts,
      salesTrend,
      creditTrend,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
