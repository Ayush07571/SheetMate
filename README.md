# SheetMate 📚

An AI-powered adaptive worksheet generator for Indian school students (LKG – Class 8). Parents and teachers can generate custom practice sheets, grade them manually or via AI PDF upload, and track a student's weak concepts over time.

**Live domain:** [sheetmate.in](https://sheetmate.in) *(MVP v1.0.0)*

---

## ✨ Features

- **AI Worksheet Generator** — Generates structured worksheets for MATH, SCIENCE, ENGLISH, and EVS aligned with CBSE syllabus (ICSE and State Boards coming soon), tailored by grade and difficulty.
- **Early Learner Mode** — Special activity formats (Matching, Fill in the Blanks, Odd One Out) for LKG, UKG, Class 1, and Class 2.
- **Student Profiles** — Create child profiles with grade, board (fixed to CBSE for MVP), and parent contact details (parent email and mobile number).
- **Parent PIN Lock & OTP Verification** — Secure parent-only view unlock using a 4-digit PIN. Supports automatic setup verification and "Forgot PIN" recovery via simulated SMS/Email OTP (One-Time Password) notifications.
- **Contact Details Verification** — Changing parent contact details in settings intercepts the update and requires simulated OTP verification before updating the profile in the database.
- **Frictionless Pro Beta Registration** — Access to the Pro Lifetime Beta is 100% free during the public beta. Integrates a payment gateway notice for production launch (RuPay, UPI, Cards) but allows instant activation without requiring card details.
- **Separated Worksheet & Solutions Downloads**:
  - **Download Worksheet PDF** — Free and unlocked for all users (including Guests). Automatically strips answer keys before printing.
  - **Download Solutions PDF** — Enabled for registered/pro profiles. Locked with a Pro upgrade prompt for Guest users.
- **Model & API Key Fallback** — Failover mechanism that tries multiple models and retries queries using a secondary backup API key before falling back to local mocks.
- **Interactive Parent Grader** — PIN-locked grading panel where parents mark each question correct/incorrect on-screen inside the dashboard.
- **AI PDF Reviewer** — Student uploads a handwritten/typed solution as a PDF. AI extracts the text, compares it to the answer key, and returns a score with per-question feedback.
- **Adaptive Engine** — Incorrect answers update a `WeaknessLog`. The next worksheet for that student emphasises those weak subtopics.
- **AI Chat Agent** — A floating chatbot on the landing page and dashboard that extracts worksheet parameters from natural conversation and triggers generation automatically.
- **Delete Worksheets** — Parents (PIN-unlocked) can permanently remove worksheets from a student's history.
- **Guest Mode** — One-off worksheet generation without a profile, with server-side caching so repeated requests for the same topic are instant. Locked options for answer keys and solutions.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| UI | React 19, Vanilla CSS |
| 3D Background | Three.js + React Three Fiber |
| Animations | GSAP |
| Database | SQLite (via `better-sqlite3`) |
| ORM | Prisma 7 |
| AI Gateway | OpenRouter API (Google Gemma, free-tier fallback, and backup key retry) |
| PDF Parsing | `pdf-parse` (dynamically required) |

---

## 🗄️ Database Schema (5 Models)

```
User                  → login credentials (reserved for future auth)
StudentProfile        → child's name, grade, board, parent PIN, email, and phone
GeneratedWorksheet    → full worksheet JSON, score, attempts history
WeaknessLog           → per-subtopic error counter for adaptive focus
WorksheetCache        → cached AI output for guest mode (by topic key)
```

---

## 📡 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/student/profiles` | List all student profiles |
| `GET` | `/api/student/dashboard?id=` | Profile + worksheet history + weaknesses |
| `POST` | `/api/student/profile` | Create a new student profile |
| `PUT` | `/api/student/profile` | Update profile (name, grade, board, PIN, email, phone) |
| `POST` | `/api/worksheets/generate` | Generate a new AI worksheet |
| `GET` | `/api/worksheets/[id]` | Fetch full worksheet content |
| `DELETE` | `/api/worksheets/[id]` | Delete a worksheet |
| `POST` | `/api/worksheets/[id]/grade` | Submit manual parent grade |
| `POST` | `/api/worksheets/[id]/review` | AI review of uploaded PDF solution |
| `POST` | `/api/chat/extract` | Extract worksheet params from chat conversation |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- One or more [OpenRouter](https://openrouter.ai) API keys (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/Ayush07571/SheetMate.git
cd sheetmate_project

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your OPENROUTER_API_KEY to .env

# Push Prisma schema to the database (or run migrations)
npx prisma db push

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```env
OPENROUTER_API_KEY=sk-or-v1-your-primary-key-here
BACKUP_OPENROUTER_API_KEY=sk-or-v1-your-backup-key-here
```

---

## 📁 Project Structure

```
sheetmate_project/
├── prisma/
│   ├── schema.prisma        # Database models
│   ├── dev.db               # SQLite database file
│   └── migrations/          # SQL migration history
│
├── src/
│   ├── app/
│   │   ├── page.tsx                        # Landing page
│   │   ├── dashboard/page.tsx              # Student dashboard
│   │   ├── worksheets/[id]/page.tsx        # Worksheet viewer
│   │   └── api/                            # All API route handlers
│   │
│   ├── components/
│   │   ├── ChatAgent.tsx        # Floating AI chatbot widget
│   │   ├── GeneratorWizard.tsx  # Step-by-step worksheet generator form
│   │   ├── PreviewPaper.tsx     # Rendered worksheet display
│   │   └── ThreeBackground.tsx  # Animated 3D starfield
│   │
│   └── lib/
│       ├── db.ts            # Prisma client singleton
│       └── openrouter.ts    # AI API wrapper with model fallback & key retries
│
├── .env                     # Secrets (not committed to Git)
│── .env.example             # Example configuration
└── package.json
```

---

## 🧠 How the AI Works

### Worksheet Generation
The AI receives a detailed system prompt specifying the CBSE grade, subject, topic, difficulty, and (for registered users) the student's top 3 weak subtopics. It returns a structured JSON with sections, questions, answer keys, and explanations.

### Model & API Key Fallback Loop
```
1. Try Primary Key with google/gemma-4-26b-a4b-it:free
2. Try Backup Key with google/gemma-4-26b-a4b-it:free (if rate-limited/429)
3. Try Primary Key with openrouter/free (if Gemma fails)
4. Try Backup Key with openrouter/free
5. Fallback to Local mock curriculum generator (if all API calls fail)
```

### PDF AI Grader
1. Student uploads their solved worksheet as a PDF
2. `pdf-parse` extracts the raw text
3. The text + original answer key are sent to OpenRouter
4. AI returns a score and per-question feedback
5. Score is saved and WeaknessLogs are updated for wrong answers

### Chat Agent (Intent Extraction)
The chatbot sends the full conversation history to the AI with a prompt to extract 5 parameters: `board`, `grade`, `subject`, `topic`, `difficulty`. If any are missing, the AI asks a clarifying question. Once all 5 are known, it auto-triggers worksheet generation.

---

## 📜 License

Private project — all rights reserved © 2026 SheetMate (sheetmate.in)
