# BIOVOTE

> **"Your Identity. Your Voice. Your Vote."**
> A Futuristic, Secure Face-Detection Voting System (College-Level Educational Demonstration Prototype)

![BIOVOTE Prototype](https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Overview & Academic Scope

**BIOVOTE** is a full-stack, demonstration web application exploring the intersection of client-side camera biometric liveness detection and cryptographic secret-ballot decoupling.

### 🛡️ Critical Privacy & Ethical Boundaries
- **Educational Prototype Only**: Clearly branded throughout the application.
- **Zero Biometric Data Stored**: Camera frames are processed strictly in the browser using HTML5 Canvas. No biometric templates, vectors, or face embeddings are ever recorded or transmitted over the network.
- **Accessible Alternative**: Includes a non-biometric demonstration verification method (PIN) for users without webcams or who decline camera permissions.
- **Decoupled Ballot Box**: Prevents voter coercion and guarantees secret-ballot privacy by strictly segregating voter participation proofs (`DemoBallotReceipt`) from anonymized votes (`DemoBallot`).
- **Single Vote Constraint**: Enforced at the database transaction layer via unique constraints.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript
- **Styling & UI**: Tailwind CSS, Framer Motion, Lucide Icons
- **Database & ORM**: SQLite via Prisma ORM (designed with PostgreSQL migration parity)
- **Security**: PBKDF2 with SHA-512 password hashing, HttpOnly Strict SameSite session cookies, Zod schema validation
- **Testing**: Vitest unit test suite

---

## 🛠️ Local macOS Quick Start

### 1. Requirements
- Node.js 18+ (tested on Node v24)
- npm or pnpm

### 2. Setup & Database Initialization
Open your terminal in `/Users/avnishsinghyadav/face-detection-voting`:

```bash
cd /Users/avnishsinghyadav/face-detection-voting

# Install dependencies (if not already done)
npm install

# Push Prisma schema to local SQLite database (dev.db)
npx prisma db push

# Seed initial demonstration political parties and administrative account
npx tsx prisma/seed.ts
```

### 3. Run Development Server
```bash
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Demonstration Accounts

### 👑 Electoral Administrator
- **Email:** `admin@demovote.org`
- **Password:** `AdminPass123!`
- **Access Route:** `/admin/login` or via the top-right Admin link
- **Capabilities:**
  - Real-time aggregate election returns chart & turnout percentage.
  - Political party CRUD (Add parties, toggle Active/Inactive).
  - Voter registry (search & suspend accounts).
  - Audit trail of administrative actions.

### 🗳️ Voter Portal
- **Registration (`/register`):** Multi-step wizard with personal details, profile picture preview, and 6-digit email OTP (auto-populated in local sandbox mode).
- **Voter Desk (`/dashboard`):** Real-time eligibility card, verification mode status, and cryptographic ballot token lookup.
- **Ballot Selection (`/vote`):** Interactive political party cards with camera HUD liveness simulation & accessible PIN option.

---

## 🧪 Testing

To run the cryptographic security and token test suite:
```bash
npm test
# or: npx vitest run src/lib/auth/password.test.ts
```

To run a production build verification:
```bash
npm run build
```

---

## 🔄 Migrating from SQLite to PostgreSQL

The database schema has been intentionally designed using standard relational types (UUID strings, Datetimes, Booleans, and Ints). To migrate to PostgreSQL:
1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `DATABASE_URL` in `.env`:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/biovote?schema=public"
   ```
3. Run `npx prisma migrate dev --name init_postgres`.
