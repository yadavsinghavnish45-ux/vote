# BIOVOTE

> **"Your Identity. Your Voice. Your Vote."**
> An educational voting interface prototype

![BIOVOTE Prototype](https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Overview & Academic Scope

**BIOVOTE** is a full-stack educational demonstration of registration, party selection, simulated verification, and one demo ballot per account. It is not a real election system.

### 🛡️ Critical Privacy & Ethical Boundaries
- **Educational Prototype Only**: Clearly branded throughout the application.
- **Optional Camera Preview**: Camera access is optional. The interface shows a local live preview and timed prompts; it does not analyze frames, detect faces, or verify identity or liveness.
- **Accessible Alternative**: Users can continue through the simulated flow without camera access. This is not an identity check.
- **Separate Demo Records**: Account participation receipts and aggregate party selections use separate records. This is not independently audited and does not guarantee secret-ballot privacy.
- **Single Vote Constraint**: Enforced at the database transaction layer via unique constraints.

---

## 🚀 Tech Stack

- **Frontend**: Next.js App Router, React 19, TypeScript
- **Styling & UI**: Tailwind CSS, Framer Motion, Lucide Icons
- **Database & ORM**: SQLite via Prisma ORM (designed with PostgreSQL migration parity)
- **Security**: PBKDF2 with SHA-512 password hashing, HttpOnly SameSite session cookies, Zod schema validation
- **Testing**: Vitest unit test suite

---

## 🛠️ Local macOS Quick Start

## Important limitations

BIOVOTE is a college-level demonstration only. It must not be used for a real election or to make identity decisions. Camera prompts are scripted and do not respond to facial movement. The database keeps account participation receipts separate from party vote counts, but the overall application is not a certified or independently audited secret-ballot system. Camera permission is optional; the camera preview does not capture or upload images.

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
- **Ballot Selection (`/vote`):** Interactive party cards with optional camera preview, simulated timed prompts, and a non-camera alternative.

---

## 🧪 Checks

The repository currently does not include Vitest or Playwright in its installed dependencies. Type-check the application and run ESLint with:
```bash
npx tsc --noEmit
npm run lint
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
