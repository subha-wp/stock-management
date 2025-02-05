/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

export async function POST(request: Request) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { invoiceId, amount, method, reference, note } = await request.json();

    // Get current invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Calculate new payment totals
    const newAmountPaid = invoice.amountPaid + amount;
    const newBalance = invoice.total - newAmountPaid;

    // Determine new status
    let newStatus = invoice.status;
    if (newBalance <= 0) {
      newStatus = "PAID";
    } else if (newAmountPaid > 0) {
      newStatus = "PARTIALLY_PAID";
    }

    // Create payment and update invoice in a transaction
    const result = await prisma.$transaction([
      prisma.payment.create({
        data: {
          invoiceId,
          amount,
          method,
          reference,
          note,
          userId: user.id,
        },
      }),
      prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          amountPaid: newAmountPaid,
          balance: newBalance,
          status: newStatus,
        },
      }),
    ]);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get("invoiceId");

    const payments = await prisma.payment.findMany({
      where: {
        userId: user.id,
        ...(invoiceId && { invoiceId }),
      },
      include: {
        invoice: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
