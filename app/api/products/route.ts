/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      where: { userId: user.id },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
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
    const {
      name,
      description,
      price,
      unit,
      taxPercent,
      stock,
      minStock,
      images,
    } = await request.json();
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        unit,
        taxPercent,
        stock: parseInt(stock) || 0,
        minStock: parseInt(minStock) || 0,
        images: images || [],
        userId: user.id,
      },
    });

    // Create initial stock log if stock is greater than 0
    if (parseInt(stock) > 0) {
      await prisma.stockLog.create({
        data: {
          productId: product.id,
          quantity: parseInt(stock),
          type: "INITIAL",
          note: "Initial stock entry",
          userId: user.id,
        },
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
