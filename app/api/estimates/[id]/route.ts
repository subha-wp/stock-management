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
    const estimate = await prisma.estimate.findUnique({
      where: { id: id },
      include: {
        items: { include: { product: true } },
        business: true,
      },
    });

    if (!estimate || estimate.userId !== user.id) {
      return NextResponse.json(
        { error: "Estimate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(estimate);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch estimate" },
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
      expiryDate,
      status,
      items,
      businessId,
    } = await request.json();

    const updatedEstimate = await prisma.estimate.update({
      where: { id: id, userId: user.id },
      data: {
        clientName,
        clientEmail,
        clientAddress: clientAddress || null,
        additionalAddress: additionalAddress || null,
        date: new Date(date),
        expiryDate: new Date(expiryDate),
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
    const total = updatedEstimate.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    const finalEstimate = await prisma.estimate.update({
      where: { id: updatedEstimate.id },
      data: { total },
      include: {
        items: { include: { product: true } },
        business: true,
      },
    });

    return NextResponse.json(finalEstimate);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update estimate" },
      { status: 500 }
    );
  }
}
