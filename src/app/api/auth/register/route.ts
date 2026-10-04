import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createEmailVerificationToken } from "@/lib/auth/email";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and dashes"),
  email: z.string().email("Please provide a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[0-9]/, "Password must include at least one number"),
  avatarUrl: z.string().optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { name, username, email, password, avatarUrl } = result.data;

    // Check if username or email already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existing) {
      if (existing.email.toLowerCase() === email.toLowerCase()) {
        return NextResponse.json(
          { error: "An account with this email address already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "This username is already taken" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        passwordHash,
        avatarUrl,
        emailVerified: false,
        role: "USER",
      },
    });

    // Generate Verification OTP
    const verification = await createEmailVerificationToken(user.id);

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please verify your email.",
      userId: user.id,
      devOtpCode: process.env.EMAIL_PROVIDER === "mock" ? verification.code : undefined,
    });
  } catch (err: any) {
    console.error("Register Error:", err);
    return NextResponse.json(
      { error: "An unexpected server error occurred during registration" },
      { status: 500 }
    );
  }
}
