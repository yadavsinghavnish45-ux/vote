import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const receipt = await prisma.demoBallotReceipt.findUnique({
      where: { userId: session.userId },
      select: {
        receiptNumber: true,
        votedAt: true,
      },
    });

    return NextResponse.json({
      hasVoted: Boolean(receipt),
      receipt: receipt || null,
      user: session.user,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
