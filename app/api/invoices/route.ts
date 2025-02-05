/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { createInvoice } from "@/lib/services/invoice.service";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const invoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      include: {
        items: { include: { product: true } },
        business: true,
      },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { clientName, clientEmail, date, dueDate, items, businessId } =
      await request.json();

    const invoice = await createInvoice({
      clientName,
      clientEmail,
      date,
      dueDate,
      items,
      businessId,
      user,
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Create invoice error:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
