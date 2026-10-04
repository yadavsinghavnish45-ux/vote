import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

const ITERATIONS = 100000;
const KEYLEN = 64;
const DIGEST = "sha512";

async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.pbkdf2(password, salt, ITERATIONS, KEYLEN, DIGEST, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

async function main() {
  console.log("🌱 Seeding BIOVOTE database...");

  // Seed Admin Account
  const adminEmail = process.env.ADMIN_EMAIL || "admin@demovote.org";
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";
  const adminHash = await hashPassword(adminPassword);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "ADMIN",
      emailVerified: true,
    },
    create: {
      name: "System Administrator",
      username: "admin",
      email: adminEmail,
      passwordHash: adminHash,
      role: "ADMIN",
      emailVerified: true,
    },
  });
  console.log(`✓ Admin user configured: ${admin.email}`);

  // Seed Default Political Parties for Demonstration
  const parties = [
    {
      name: "Quantum Innovation Party",
      code: "QIP",
      description: "Dedicated to advancing scientific research, AI ethics, digital sovereignty, and high-tech infrastructure for modern governance.",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
      color: "#3b82f6",
    },
    {
      name: "Eco-Future Coalition",
      code: "EFC",
      description: "Fostering sustainable regenerative ecosystems, zero-carbon clean energy, and environmental resilience through smart tech.",
      logoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80",
      color: "#10b981",
    },
    {
      name: "Civic Liberty Alliance",
      code: "CLA",
      description: "Championing civil liberties, open democracy, transparent public oversight, and personal privacy in the digital era.",
      logoUrl: "https://images.unsplash.com/photo-1533749047139-189de3cf06d3?auto=format&fit=crop&w=300&q=80",
      color: "#8b5cf6",
    },
    {
      name: "United Prosperity Vanguard",
      code: "UPV",
      description: "Empowering decentralized economic opportunity, accessible education, and equitable global technological cooperation.",
      logoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80",
      color: "#f59e0b",
    },
  ];

  for (const party of parties) {
    await prisma.party.upsert({
      where: { code: party.code },
      update: party,
      create: party,
    });
  }
  console.log(`✓ Seeded ${parties.length} demonstration political parties.`);

  // Create an initial audit log entry
  await prisma.adminAuditLog.create({
    data: {
      adminId: admin.id,
      adminName: admin.name,
      action: "INITIAL_SEED",
      details: "System initialized with default political parties and superadmin account.",
    },
  });

  console.log("🚀 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
