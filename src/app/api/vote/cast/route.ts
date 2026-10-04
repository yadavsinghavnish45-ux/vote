import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { generateReceiptNumber } from "@/lib/auth/password";

const castVoteSchema = z.object({
  partyId: z.string().min(1, "Party selection is required"),
  verificationMethod: z.enum(["camera_simulated", "alternative_passphrase"]),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required to cast a vote." }, { status: 401 });
    }

    if (!session.user.emailVerified) {
      return NextResponse.json({ error: "Email must be verified before participating." }, { status: 403 });
    }

    if (session.user.isSuspended) {
      return NextResponse.json({ error: "Your account is currently suspended." }, { status: 403 });
    }

    const body = await req.json();
    const result = castVoteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Invalid vote request" }, { status: 400 });
    }

    const { partyId } = result.data;

    // Check party existence and active status
    const party = await prisma.party.findUnique({
      where: { id: partyId },
    });

    if (!party || !party.isActive) {
      return NextResponse.json({ error: "Selected political party is invalid or inactive." }, { status: 400 });
    }

    // Atomic transaction enforces one demo ballot per account. Separate records
    // reduce direct identity-to-party linkage but do not certify ballot secrecy.
    const receiptNumber = generateReceiptNumber(session.userId);

    const voteSubmission = await prisma.$transaction(async (tx) => {
      // 1. Verify user hasn't already submitted a ballot
      const existingReceipt = await tx.demoBallotReceipt.findUnique({
        where: { userId: session.userId },
      });

      if (existingReceipt) {
        throw new Error("ALREADY_VOTED");
      }

      // 2. Record demo ballot receipt (linked to user, but contains NO partyId)
      const receipt = await tx.demoBallotReceipt.create({
        data: {
          userId: session.userId,
          receiptNumber,
        },
      });

      // 3. Record aggregate party selection separately (no userId foreign key).
      await tx.demoBallot.create({
        data: {
          partyId: party.id,
        },
      });

      return receipt;
    });

    return NextResponse.json({
      success: true,
      message: "Your demonstration vote has been submitted successfully.",
      receiptNumber: voteSubmission.receiptNumber,
      votedAt: voteSubmission.votedAt,
      partyName: party.name,
    });
  } catch (err: any) {
    if (err.message === "ALREADY_VOTED" || err.code === "P2002") {
      return NextResponse.json(
        { error: "You have already cast your demonstration vote. Each user is strictly limited to one ballot." },
        { status: 409 }
      );
    }
    console.error("Cast vote error:", err);
    return NextResponse.json(
      { error: "Failed to submit ballot due to server transaction conflict. Please retry." },
      { status: 500 }
    );
  }
}
