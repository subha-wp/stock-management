import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city")?.toLowerCase();
    const days = parseInt(searchParams.get("days") || "7");

    if (!city) {
      return NextResponse.json(
        { error: "City parameter is required" },
        { status: 400 }
      );
    }

    // Get trending searches for the specified city and time period
    const trending = await prisma.searchQuery.findMany({
      where: {
        city: city,
        lastSearchedAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: [{ count: "desc" }, { lastSearchedAt: "desc" }],
      take: 50,
    });

    return NextResponse.json(trending);
  } catch (error) {
    console.error("Trending search error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending searches" },
      { status: 500 }
    );
  }
}
