import { getCurrentSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export type AdminGuardResult =
  | { authorized: false; response: NextResponse; session: null }
  | { authorized: true; response: null; session: NonNullable<Awaited<ReturnType<typeof getCurrentSession>>> };

export async function requireAdmin(): Promise<AdminGuardResult> {
  const session = await getCurrentSession();
  if (!session || session.user.role !== "ADMIN") {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Access denied. Administrative privileges required." }, { status: 403 }),
      session: null,
    };
  }
  return { authorized: true, response: null, session };
}
