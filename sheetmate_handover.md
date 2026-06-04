# SheetMate: Complete Platform Handover & Knowledge Base 📚

This document serves as a comprehensive system overview and detailed technical specification of **SheetMate**, an AI-powered school worksheet generator for the Indian education curriculum (LKG – Class 8). Use this document to prime another AI agent's memory to seamlessly continue development, bug fixing, or feature expansion.

---

## 1. System Overview & Architecture

SheetMate is built using a modern, type-safe web stack optimized for rapid local iteration and seamless serverless hosting on Vercel.

### Core Tech Stack
*   **Framework**: Next.js 16 (App Router with Turbopack).
*   **Database**: Supabase PostgreSQL (Production) / SQLite via `dev.db` (Local Dev).
*   **ORM**: Prisma 7 (using the new centralized configuration standard and Postgres driver adapters).
*   **Styling**: Premium custom Vanilla CSS (dark glassmorphism, responsive variables, custom styling tokens).
*   **3D Visuals**: Three.js + React Three Fiber (used for an animated background starfield).
*   **AI Models**: OpenRouter API gateway (primary model: `google/gemma-4-26b-a4b-it:free`, fallback: `openrouter/free`).
*   **PDF Parsing**: `pdf-parse` (used server-side to extract text from student solution PDFs).

### Project Directory Structure
```text
sheetmate_project/
├── prisma/
│   ├── schema.prisma        # Database models (PostgreSQL provider, no hardcoded URLs)
│   └── migrations/          # DB migration logs
├── src/
│   ├── app/
│   │   ├── page.tsx                        # Landing Page (includes ChatAgent, Features, Upgrade)
│   │   ├── dashboard/page.tsx              # Student/Parent Dashboard (PIN lock, profile config, grader)
│   │   ├── worksheets/[id]/page.tsx        # Worksheet Viewer (split printable PDF, grader trigger)
│   │   ├── cbse/[grade]/[subject]/[chapter]/page.tsx # SEO NCERT landing pages
│   │   └── api/                            # API Route Handlers
│   ├── components/
│   │   ├── ChatAgent.tsx        # Floating AI conversational widget (intent extraction)
│   │   ├── GeneratorWizard.tsx  # 4-step worksheet parameters builder
│   │   ├── PreviewPaper.tsx     # Structured worksheet paper container
│   │   └── ThreeBackground.tsx  # Interactive R3F starfield animation
│   └── lib/
│       ├── db.ts            # Prisma client singleton (utilizes @prisma/adapter-pg and pg Pool)
│       ├── curriculumData.ts# Static CBSE grade, subject, and NCERT chapter mappings
│       └── openrouter.ts    # AI orchestrator with key rotation & fallback mocks
├── prisma.config.ts         # Prisma 7 configuration file (handles DATABASE_URL loading)
├── package.json             # Build script & dependency configurations
└── .env                     # Local environment variables
```

---

## 2. Database Schema (Prisma 7)

The database schema consists of **5 primary models** representing users, student profiles, generated worksheets, weak concept logs, and cached guest worksheets.

```prisma
model User {
  id           String           @id @default(uuid())
  email        String           @unique
  passwordHash String
  createdAt    DateTime         @default(now())
  profiles     StudentProfile[]
}

model StudentProfile {
  id          String               @id @default(uuid())
  userId      String
  user        User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String
  grade       String               // "LKG" through "Class 8"
  board       String               // e.g., "CBSE" (MVP focus)
  parentPin   String               @default("0000")
  parentEmail String?
  parentPhone String?
  worksheets  GeneratedWorksheet[]
  weaknesses  WeaknessLog[]
  createdAt   DateTime             @default(now())
}

model GeneratedWorksheet {
  id               String          @id @default(uuid())
  studentProfileId String?         // Nullable for Guest mode
  clientIp         String?         // Tracked for guest rate limits
  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id], onDelete: SetNull)
  subject          String          // "MATH", "SCIENCE", "ENGLISH", "EVS"
  topic            String          // NCERT chapter or custom topic
  difficulty       String          // "EASY", "MEDIUM", "HARD"
  contentJson      String          // Serialized worksheet content JSON
  score            Int?            // Last parent score (null if uncompleted)
  totalMarks       Int             // Default 10 or 20
  attemptsJson     String?         // Serialized history array: [{ score, date }]
  createdAt        DateTime        @default(now())
}

model WeaknessLog {
  id               String         @id @default(uuid())
  studentProfileId String
  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id], onDelete: Cascade)
  subject          String
  topic            String
  subtopic         String          // Particular weak concept tag (e.g., "Fractions addition")
  errorCount       Int            @default(0)
  successCount     Int            @default(0)
  lastTestedAt     DateTime       @default(now())
}

model WorksheetCache {
  id          String   @id @default(uuid())
  cacheKey    String   @unique // Format: "board-grade-subject-topic-difficulty"
  contentJson String
  createdAt   DateTime @default(now())
}
```

---

## 3. Deep Dive into Key Platform Features

### A. Model Fallback & Key Rotation Loop (`src/lib/openrouter.ts`)
To prevent rate-limit crashes (HTTP 429) on OpenRouter's free tiers, we built a nested failover loop:
1.  **Key Rotation**: The system reads both `OPENROUTER_API_KEY` (primary) and `BACKUP_OPENROUTER_API_KEY` (secondary) from `.env`.
2.  **Model Rotation**: It cycles through the models array: `["google/gemma-4-26b-a4b-it:free", "openrouter/free"]`.
3.  **Local Mock Fallback**: If both keys fail across all models, the function falls back to a helper that returns structured local mock curriculum questions based on the grade, subject, and topic so that the generator wizard never crashes.

*Flow Diagram:*
```text
[Request]
   │
   ├──> Try Key 1 with Gemma 4 ──(OK)──> Return JSON
   │     │ (429 / Fail)
   │     └──> Try Key 2 with Gemma 4 ──(OK)──> Return JSON
   │           │ (429 / Fail)
   │           └──> Try Key 1 with openrouter/free ──(OK)──> Return JSON
   │                 │ (429 / Fail)
   │                 └──> Try Key 2 with openrouter/free ──(OK)──> Return JSON
   │                       │ (All Fail)
   │                       └──> Generate Local Mock JSON
```

### B. Parent Security & Simulated OTP Flows (`src/app/dashboard/page.tsx`)
All administrative functions (updating parent settings, deleting worksheets, viewing scores, or performing manual grading) are protected by a **Parent PIN Modal** with 3 modes:
1.  **`enter`**: Input 4-digit PIN (default `"0000"`).
2.  **`otp_verify`**: Triggered during a "Forgot PIN" recovery or when changing parent contact details (Email/Phone) in profile settings.
3.  **`set_new`**: Input a new 4-digit PIN.

*OTP Simulation*: Since this is in beta, OTPs are simulated. When an OTP is triggered (e.g., changing email or resetting PIN), the API generates a 4-digit code (e.g., `2472`) and returns a notification payload. The frontend displays a premium popup banner simulating an incoming SMS/Email notification:
`📨 [Simulated Notification] Sent verification code 2472 to parent@email.com`
The parent must enter this code inside the modal to complete the security operation.

### C. Separated PDF Downloads (`src/app/worksheets/[id]/page.tsx`)
SheetMate segregates access to worksheets and solutions:
*   **Worksheet PDF**: Always **100% free and unlocked** for all users, including Guests. 
    *   *Mechanism*: Clicking "Download Worksheet" triggers browser printing (`window.print()`). We inject custom `@media print` CSS variables that dynamically hide elements matching `.answer-key` or `.explanations`, ensuring the printed page contains only questions.
*   **Solutions PDF**: Locked behind a **Upgrade to Pro** registration wall for Guest users. Toggling the "Include Answer Key" switch in `GeneratorWizard.tsx` is also locked for guests and displays a `🔒 Pro` badge. If a logged-in user clicks "Download Solutions", the printing stylesheet renders all question answers and step-by-step explanations.

### D. Adaptive Learning Engine (`src/app/api/worksheets/[id]/grade/route.ts`)
Personalization is achieved using the `WeaknessLog` model:
1.  **Logging**: When a parent grades a worksheet (manually clicking Correct/Incorrect checkmarks on-screen), or when the student uploads a completed PDF for AI grading, the API checks each graded question.
2.  **Updates**: Incorrect answers increment `errorCount` for that question's specific `subtopic` in the database. Correct answers increment `successCount`.
3.  **Prompt Customization**: When generating a new worksheet for a registered student profile, `/api/worksheets/generate` fetches the student's top 3 weak subtopics for the current subject and passes them to the OpenRouter system prompt:
    `"The student is struggling with: [subtopic1, subtopic2]. Dedicate 40% of the worksheet questions specifically to these subtopics to help them improve."`

### E. Conversational Chat Agent (`src/components/ChatAgent.tsx`)
A floating chat bubble allows natural language worksheet configuration:
1.  The chat agent API (`/api/chat/extract`) processes user prompts.
2.  It uses structural LLM JSON extraction to fill a parameters object: `{ board, grade, subject, topic, difficulty }`.
3.  If any parameters are missing (e.g., the user says "Give me a Class 5 Science sheet" but forgets the topic), the AI replies with a conversational question to extract the missing parameter.
4.  Once all 5 parameters are successfully resolved, the widget automatically fires the generation API call and opens the worksheet creator wizard.

### F. AI PDF Grader (`src/app/api/worksheets/[id]/review/route.ts`)
Instead of manual grading, students can upload a PDF of their completed worksheet:
1.  The API parses the PDF content using the `pdf-parse` package.
2.  It extracts the raw text and sends it to the AI gateway along with the original worksheet answer key and grading schema.
3.  The model parses the handwritten or typed text, assigns marks per question, and yields a detailed JSON summary showing which questions are correct/incorrect, the total score, and concept feedback.
4.  The system automatically updates the profile's `WeaknessLog` based on the results.

---

## 4. API Interface Contracts

### 1. `/api/student/dashboard?id=[profileId]` (`GET`)
*   **Purpose**: Gathers dashboard data, history, and weaknesses for a single profile.
*   **Response**:
    ```json
    {
      "profile": {
        "id": "uuid",
        "name": "Arjun",
        "grade": "Class 5",
        "board": "CBSE",
        "parentPin": "1234",
        "parentEmail": "parent@gmail.com",
        "parentPhone": "9876543210"
      },
      "worksheets": [ { "id": "uuid", "subject": "MATH", "topic": "Fractions", "score": 8, "totalMarks": 10 } ],
      "weaknesses": [ { "subtopic": "Mixed Fraction Addition", "errorCount": 3 } ]
    }
    ```

### 2. `/api/student/profile` (`POST`)
*   **Payload**: `{ userId, name, grade, board, parentPin, parentEmail, parentPhone }`
*   **Action**: Creates a new student profile linked to the defaults.

### 3. `/api/student/profile` (`PUT`)
*   **Payload**: `{ id, name, grade, board, parentPin, parentEmail, parentPhone }`
*   **Action**: Updates the database fields for a profile (validates changes with security PIN authorization).

### 4. `/api/worksheets/generate` (`POST`)
*   **Payload**:
    ```json
    {
      "studentProfileId": "uuid-or-null",
      "board": "CBSE",
      "grade": "Class 6",
      "subject": "SCIENCE",
      "topic": "Getting to Know Plants",
      "difficulty": "MEDIUM"
    }
    ```
*   **Action**: Evaluates if the query is a Guest (checks `WorksheetCache` by cacheKey string) or Profile. Pulls weaknesses, invokes OpenRouter models, and creates the worksheet record.

---

## 5. Prisma 7 Configurations & Deploy-Ready Fixes

Prisma 7 has a restructured system model that separates schema definitions from database credentials:

### Centralized Config (`prisma.config.ts`)
Environment variable connection strings are kept outside the schema. They are handled by `defineConfig` in the root configuration file:
```typescript
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL
  }
});
```

### PostgreSQL Driver Adapter (`src/lib/db.ts`)
To satisfy Prisma 7's Rust-free WASM query compiler requirements in Next.js Serverless environments, the Prisma Client is instantiated with the official Postgres driver adapter (`@prisma/adapter-pg`) backed by the standard Node `pg` Pool:
```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = (() => {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }
  
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
  });
  
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
})();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

### Production Build Script
The build configuration in `package.json` enforces client generation before packaging, preventing typical bundler type errors on Vercel:
```json
"scripts": {
  "build": "prisma generate && next build"
}
```

---

## 6. How to Run local testing

### Initial setup
1. Clone the project repository and run `npm install`.
2. Configure `.env` variables (`OPENROUTER_API_KEY`, `BACKUP_OPENROUTER_API_KEY`, `DATABASE_URL`).
3. Push schema to Supabase:
   `$env:DATABASE_URL="[DIRECT_CONNECTION_URL_PORT_5432]"; npx prisma db push`
4. Regenerate Client types:
   `npx prisma generate`
5. Run the dev server:
   `npm run dev`

---

## 7. Development Chronicle & Updates after Mentor Reviews

During development, the platform went through several cycles of feedback, testing, and alignment based on mentor reviews and user experience feedback. Below is the historical summary of those iterations and how they were resolved in the codebase:

### Iteration 1: Schema Updates & Turbopack Cache Resolving
*   **Mentor Feedback**: The initial user schema lacked parent email/phone contact details. We needed to associate profiles with parent contacts to enable recovery alerts.
*   **Action Taken**: Added `parentEmail` and `parentPhone` to the `StudentProfile` model in `schema.prisma`.
*   **Gotcha Encountered**: When we pushed the changes using `npx prisma db push`, Next.js's Turbopack dev server kept serving cached Prisma Client types, raising compile-time validation errors on routes.
*   **Resolution**: Deleted the cached `.next/` directory (`Remove-Item -Recurse -Force .next`) and restarted the dev server. This forced Next.js to load the updated `@prisma/client` symbols.

### Iteration 2: Intercepting Updates with Simulated OTP Verification
*   **Mentor Feedback**: Parents shouldn't be able to change security pins or email/phone contact numbers without verification.
*   **Action Taken**: Implemented simulated OTP verification.
    *   Any update request to contact fields or security PINs triggers an API response returning a simulated OTP payload containing a 4-digit code.
    *   The frontend interceptor stops the submit flow and renders an alert banner simulating a phone/email inbox message (e.g., `📨 [Simulated Notification] Sent verification code 4391`).
    *   The parent must input this verification code into the parent view settings or Forgot PIN modal to unlock DB changes.

### Iteration 3: Separated Downloads & Frictionless Beta Plan
*   **Mentor Feedback**:
    1.  Why are we asking for credit cards during a free beta?
    2.  Guests should not get free answers/solutions, but they should be able to generate and print the blank practice worksheets freely.
*   **Action Taken**:
    *   **Payment Flow**: We removed the payment card entry fields from the settings/checkout panels entirely. Instead, we added an informative billing notice stating that during the public beta, SheetMate Pro is completely free, showing a mockup of production payment options (Cards, UPI, RuPay).
    *   **Separated Worksheet & Solutions PDF**: We split the downloads:
        *   *Worksheet Download*: Free and accessible to all users (Guests and Pro). Implemented custom CSS media queries (`@media print`) that automatically hide the answer key and solutions container when printed.
        *   *Solutions Key Download*: Enabled only for Pro/Registered users. For guest users, the option is locked and triggers an upgrade modal.

### Iteration 4: API Resilience (Backup API Key Rotation & Failovers)
*   **Mentor Feedback**: OpenRouter free-tier models (Gemma) frequently throw upstream 429 (rate-limit) errors, causing worksheet generations to fail.
*   **Action Taken**: Built a multi-tier fallback orchestrator in `src/lib/openrouter.ts`:
    *   **Primary/Backup Keys**: Added support for `BACKUP_OPENROUTER_API_KEY` to instantly retry rate-limited calls with a secondary account key.
    *   **Model Fallback**: If Gemma fails on all keys, the system falls back to `openrouter/free` (automatic routing).
    *   **Mock Curriculum Fallback**: If both keys fail for all models, rather than crashing, the code automatically serves pre-structured mock worksheets tailored to the requested grade/subject/topic.

### Iteration 5: Vercel Deployments & Prisma 7 Transition
*   **Mentor Feedback**: Ensure the app is fully ready for deployment on Vercel.
*   **Action Taken**:
    *   **SQLite Serverless limitation**: SQLite write operations get wiped on Vercel's ephemeral instances. We moved to Supabase PostgreSQL.
    *   **Prisma 7 WASM Engine compatibility**: Prisma 7's default engine is Rust-free WASM (`engineType = "client"`), which fails to run in serverless Next.js API routes without an explicit driver adapter. We updated `package.json` to install `@prisma/adapter-pg` and `pg`, and updated `src/lib/db.ts` to hook up the Postgres client pool adapter.
    *   **Vercel Build Command**: Added `prisma generate` to the `build` script in `package.json` to guarantee the engine types are compiled before Next.js builds the static pages.

