/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { createEstimate } from "@/lib/services/estimate.service";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const estimates = await prisma.estimate.findMany({
      where: { userId: user.id },
      include: {
        items: { include: { product: true } },
        business: true,
      },
    });
    return NextResponse.json(estimates);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch estimates" },
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
    const { clientName, clientEmail, date, expiryDate, items, businessId } =
      await request.json();

    const estimate = await createEstimate({
      clientName,
      clientEmail,
      date,
      expiryDate,
      items,
      businessId,
      user,
    });

    return NextResponse.json(estimate);
  } catch (error) {
    console.error("Create estimate error:", error);
    return NextResponse.json(
      { error: "Failed to create estimate" },
      { status: 500 }
    );
  }
}
