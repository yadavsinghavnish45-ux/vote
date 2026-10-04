import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/adminGuard";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { username: { contains: search } },
                { email: { contains: search } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        emailVerified: true,
        isSuspended: true,
        createdAt: true,
        ballotReceipt: {
          select: {
            receiptNumber: true,
            votedAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const body = await req.json();
    const { userId, isSuspended } = body;

    if (!userId || typeof isSuspended !== "boolean") {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isSuspended },
      select: { id: true, username: true, isSuspended: true },
    });

    // Invalidate sessions if user suspended
    if (isSuspended) {
      await prisma.session.deleteMany({ where: { userId } });
    }

    await prisma.adminAuditLog.create({
      data: {
        adminId: guard.session.userId,
        adminName: guard.session.user.name,
        action: isSuspended ? "SUSPEND_USER" : "REACTIVATE_USER",
        details: `${isSuspended ? "Suspended" : "Reactivated"} user: ${updated.username}`,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 });
  }
}
