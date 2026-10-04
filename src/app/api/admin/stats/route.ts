import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/adminGuard";

export async function GET(): Promise<NextResponse> {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const [
      totalUsers,
      verifiedUsers,
      totalParties,
      activeParties,
      totalBallots,
      recentLogs,
      partyBreakdown,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.user.count({ where: { role: "USER", emailVerified: true } }),
      prisma.party.count(),
      prisma.party.count({ where: { isActive: true } }),
      prisma.demoBallot.count(),
      prisma.adminAuditLog.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
      prisma.party.findMany({
        select: {
          id: true,
          name: true,
          code: true,
          color: true,
          isActive: true,
          _count: {
            select: { votes: true },
          },
        },
      }),
    ]);

    const results = partyBreakdown.map((p) => {
      const voteCount = p._count.votes;
      const percentage = totalBallots > 0 ? ((voteCount / totalBallots) * 100).toFixed(1) : "0.0";
      return {
        id: p.id,
        name: p.name,
        code: p.code,
        color: p.color,
        isActive: p.isActive,
        votes: voteCount,
        percentage: Number(percentage),
      };
    });

    return NextResponse.json({
      metrics: {
        totalUsers,
        verifiedUsers,
        totalParties,
        activeParties,
        totalBallots,
        turnoutPercentage:
          verifiedUsers > 0 ? ((totalBallots / verifiedUsers) * 100).toFixed(1) : "0.0",
      },
      results,
      recentLogs,
    });
  } catch (err: any) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: "Failed to generate administrative analytics." }, { status: 500 });
  }
}
