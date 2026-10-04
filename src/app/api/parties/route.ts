import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const parties = await prisma.party.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        logoUrl: true,
        color: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ parties });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load parties" }, { status: 500 });
  }
}
