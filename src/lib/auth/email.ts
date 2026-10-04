import { prisma } from "../prisma";
import { generateOtp } from "./password";
import crypto from "crypto";

export async function createEmailVerificationToken(userId: string) {
  // Invalidate any prior active token
  await prisma.emailVerificationToken.deleteMany({ where: { userId } });

  const code = generateOtp();
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 mins expiry

  const verification = await prisma.emailVerificationToken.create({
    data: {
      userId,
      code,
      token,
      expiresAt,
    },
  });

  // Mock / Console Fallback notification
  console.log(`\n==============================================`);
  console.log(`[BIOVOTE EMAIL VERIFICATION DISPATCH]`);
  console.log(`User ID: ${userId}`);
  console.log(`Verification Code (OTP): ${code}`);
  console.log(`Valid for 15 minutes.`);
  console.log(`==============================================\n`);

  return verification;
}
