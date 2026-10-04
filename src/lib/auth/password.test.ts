import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, generateOtp, generateReceiptNumber } from "./password";

describe("Password and Cryptographic Utilities", () => {
  it("should hash and verify passwords correctly", async () => {
    const raw = "SuperSecretP@ss123";
    const hash = await hashPassword(raw);

    expect(hash).toContain(":");
    const isValid = await verifyPassword(raw, hash);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword("WrongPassword", hash);
    expect(isInvalid).toBe(false);
  });

  it("should generate a valid 6-digit numeric OTP", () => {
    const otp = generateOtp();
    expect(otp).toHaveLength(6);
    expect(Number(otp)).toBeGreaterThanOrEqual(100000);
    expect(Number(otp)).toBeLessThanOrEqual(999999);
  });

  it("should generate formatted cryptographic receipt tokens", () => {
    const userId = "test-user-uuid-999";
    const receipt = generateReceiptNumber(userId);
    expect(receipt).toMatch(/^BV-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/);
  });
});
