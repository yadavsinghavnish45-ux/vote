import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "../prisma";

export const SESSION_COOKIE_NAME = "biovote_session";
const SESSION_EXPIRY_DAYS = 7;

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function getCurrentSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            role: true,
            avatarUrl: true,
            emailVerified: true,
            isSuspended: true,
            createdAt: true,
          },
        },
      },
    });

    if (!session) return null;
    if (new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { token } }).catch(() => {});
      return null;
    }
    if (session.user.isSuspended) {
      return null;
    }

    return session;
  } catch (err) {
    console.error("Error retrieving session:", err);
    return null;
  }
}

export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      await prisma.session.deleteMany({ where: { token } });
      cookieStore.delete(SESSION_COOKIE_NAME);
    }
  } catch (err) {
    console.error("Error destroying session:", err);
  }
}
