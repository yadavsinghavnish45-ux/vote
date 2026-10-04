import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth/session";

const verifySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  code: z.string().length(6, "Verification code must be 6 digits"),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const result = verifySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { userId, code } = result.data;

    const tokenRecord = await prisma.emailVerificationToken.findFirst({
      where: {
        userId,
        code,
      },
    });

    if (!tokenRecord) {
      return NextResponse.json(
        { error: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    if (new Date() > tokenRecord.expiresAt) {
      await prisma.emailVerificationToken.delete({ where: { id: tokenRecord.id } });
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new code." },
        { status: 410 }
      );
    }

    // Mark user as verified
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    // Delete used token
    await prisma.emailVerificationToken.deleteMany({ where: { userId } });

    // Establish authenticated session immediately
    await createSession(userId);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (err: any) {
    console.error("Verify Email Error:", err);
    return NextResponse.json(
      { error: "Verification failed due to a server error." },
      { status: 500 }
    );
  }
}
