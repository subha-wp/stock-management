/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: id },
      include: {
        items: { include: { product: true } },
        business: true,
      },
    });

    if (!invoice || invoice.userId !== user.id) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      clientName,
      clientEmail,
      clientAddress,
      additionalAddress,
      date,
      dueDate,
      status,
      items,
      businessId,
    } = await request.json();

    const updatedInvoice = await prisma.invoice.update({
      where: { id: id, userId: user.id },
      data: {
        clientName,
        clientEmail,
        clientAddress: clientAddress || null,
        additionalAddress: additionalAddress || null,
        date: new Date(date),
        dueDate: new Date(dueDate),
        status,
        businessId,
        items: {
          deleteMany: {},
          create: items.map((item: any) => ({
            quantity: item.quantity,
            product: { connect: { id: item.productId } },
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        business: true,
      },
    });

    // Recalculate total
    const total = updatedInvoice.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    const finalInvoice = await prisma.invoice.update({
      where: { id: updatedInvoice.id },
      data: { total },
      include: {
        items: { include: { product: true } },
        business: true,
      },
    });

    return NextResponse.json(finalInvoice);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}
