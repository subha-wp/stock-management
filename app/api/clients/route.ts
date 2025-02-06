import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

export async function POST(request: Request) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, phone, address } = await request.json();

    // Check if client already exists
    let client = await prisma.client.findFirst({
      where: {
        phone,
        userId: user.id,
      },
    });

    if (client) {
      // Update existing client
      client = await prisma.client.update({
        where: { id: client.id },
        data: {
          name,
          email,
          address,
        },
      });
    } else {
      // Create new client
      client = await prisma.client.create({
        data: {
          name,
          email,
          phone,
          address,
          userId: user.id,
        },
      });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error creating/updating client:", error);
    return NextResponse.json(
      { error: "Failed to create/update client" },
      { status: 500 }
    );
  }
}
