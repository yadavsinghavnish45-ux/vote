import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/adminGuard";
import { z } from "zod";

const partySchema = z.object({
  name: z.string().min(2, "Party name is required"),
  code: z.string().min(2, "Code is required").max(10),
  description: z.string().min(10, "Description should be informative"),
  logoUrl: z.string().url("Valid logo URL is required"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color code"),
  isActive: z.boolean().default(true),
});

export async function GET(): Promise<NextResponse> {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const parties = await prisma.party.findMany({
      include: {
        _count: {
          select: { votes: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ parties });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load parties" }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const body = await req.json();
    const result = partySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Invalid payload" }, { status: 400 });
    }

    const data = result.data;
    const existing = await prisma.party.findFirst({
      where: {
        OR: [{ name: data.name }, { code: data.code.toUpperCase() }],
      },
    });

    if (existing) {
      return NextResponse.json({ error: "A party with this name or code already exists" }, { status: 409 });
    }

    const party = await prisma.party.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
      },
    });

    // Audit log
    await prisma.adminAuditLog.create({
      data: {
        adminId: guard.session.userId,
        adminName: guard.session.user.name,
        action: "CREATE_PARTY",
        details: `Created new political party: ${party.name} (${party.code})`,
      },
    });

    return NextResponse.json({ success: true, party });
  } catch (err: any) {
    console.error("Create party error:", err);
    return NextResponse.json({ error: "Failed to create political party." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const body = await req.json();
    const { id, isActive, name, description, color, logoUrl } = body;
    if (!id) return NextResponse.json({ error: "Party ID required" }, { status: 400 });

    const updated = await prisma.party.update({
      where: { id },
      data: {
        ...(typeof isActive === "boolean" ? { isActive } : {}),
        ...(name ? { name } : {}),
        ...(description ? { description } : {}),
        ...(color ? { color } : {}),
        ...(logoUrl ? { logoUrl } : {}),
      },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: guard.session.userId,
        adminName: guard.session.user.name,
        action: "UPDATE_PARTY",
        details: `Updated party ${updated.name} (Active: ${updated.isActive})`,
      },
    });

    return NextResponse.json({ success: true, party: updated });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update party" }, { status: 500 });
  }
}
