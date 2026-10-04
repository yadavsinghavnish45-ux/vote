import { NextResponse } from "next/server";
import { getCurrentSession, destroySession } from "@/lib/auth/session";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: session.user,
  });
}

export async function POST() {
  await destroySession();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
