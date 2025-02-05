/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const estimate = await prisma.estimate.findUnique({
      where: { id: id },
      include: {
        items: { include: { product: true } },
        business: true,
      },
    });

    if (!estimate) {
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
