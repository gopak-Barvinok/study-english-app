# Study English App

Real-time video calling platform for language learners with automatic transcription, AI-generated flashcards, and a teacher booking system.

## What Changed in the Latest Rebuild

**Commit `f12cfc0` — rebuild study-app** is a major overhaul that touches almost every layer of the project:

### New API Routes
| Route | Description |
|---|---|
| `GET /api/get-countries` | Returns a list of countries for the location picker |
| `POST /api/rate-lessons` | Submits a rating after a completed lesson |
| `GET /api/user-rooms` | Returns all rooms belonging to the current user |

### Updated API Routes
- **`/api/book-lesson`** — reworked booking logic; now validates schedule slot conflicts
- **`/api/get-timezone`** — switched to the `countries-and-timezones` library for accurate tz resolution
- **`/api/room`** — room creation now stores the associated schedule slot (`slot` field)
- **`/api/stream-webhook`** — overhauled webhook handler for Stream call events

### UI & Components
- **`HeaderWrapper`** — navigation and auth state rework
- **`LendingComponent`** — landing page redesign
- **`BookTeacherInModal`** — full rework of the booking modal flow
- **`ScheduleTable`** — teacher schedule now uses `react-big-calendar`
- **`SetLocationComponent`** / **`SetLanguageComponent`** / **`SetAgeComponent`** — onboarding steps updated
- **`AfterCallLayout`** — post-call review screen updated
- **Profile / Settings / Teacher Mode pages** — significant refactoring of the settings flow

### Server-side Scripts
- `scripts/server.ts` added (replaces the removed `scripts/hooks.ts`)
- `scripts/client.ts` updated

### Test Suite — Fully Added
A complete Vitest-based test suite was introduced from scratch:

```
tests/
├── api/          # 16 API route tests
├── components/   # 16 component tests (React Testing Library)
├── unit/
│   ├── auth.test.ts
│   ├── lib/      # database, classNames, groq
│   ├── scripts/  # client, server
│   ├── store/    # userStore (Zustand)
│   └── utils/
└── setup.ts
```

Coverage thresholds enforced: **95% lines / functions / statements**, **90% branches**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4, DaisyUI |
| Video | Stream Video React SDK |
| Chat | Stream Chat React SDK |
| Database | PostgreSQL, Prisma ORM v7, `@prisma/adapter-pg` |
| Auth | NextAuth.js v5 (Google OAuth) |
| AI | Groq SDK (flashcard generation) |
| Media | Cloudinary (certificate uploads) |
| State | Zustand |
| Testing | Vitest, React Testing Library, jsdom |
| Dev tools | ngrok (webhook tunnel) |

---

## Prerequisites

- Node.js 18+
- Docker (for local PostgreSQL) or a remote PostgreSQL instance
- Google OAuth app credentials
- [Stream](https://getstream.io/) account (Video + Chat)
- [Groq](https://console.groq.com/) API key
- [Cloudinary](https://cloudinary.com/) account

---

## Installation

```bash
git clone https://github.com/gopak-Barvinok/study-english-app.git
cd study-english-app
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in every value:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"
STREAM_API_KEY="your-stream-api-key"
STREAM_SECRET="your-stream-secret"
GROQ_API_KEY="your-groq-api-key"
NODE_ENV="development"
```

### Database

Start PostgreSQL with Docker Compose:

```bash
docker-compose up -d
```

Apply migrations and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

### Dev Server

```bash
npm run dev          # starts Next.js on http://localhost:3000
npm run tunnel       # exposes port 3000 via ngrok for Stream webhooks
```

Configure your Stream webhook URL in the Stream Dashboard to point at:
`https://<your-ngrok-id>.ngrok.io/api/stream-webhook`

---

## Testing

All tests use **Vitest** and run entirely in isolation — no database or external service required.

### Run All Tests

```bash
npm test
```

### Watch Mode (re-runs on file save)

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

The HTML coverage report is written to `coverage/index.html`. Open it in a browser to inspect per-file results.

Coverage must pass these thresholds or the run fails:

| Metric | Threshold |
|---|---|
| Lines | 95% |
| Functions | 95% |
| Statements | 95% |
| Branches | 90% |

### Test Structure and What Each Group Covers

**`tests/api/`** — unit tests for every API route handler. Each test file mocks Prisma, Stream SDK, Cloudinary, and NextAuth so routes can be called directly without a running server.

```bash
npx vitest run tests/api/book-lesson.test.ts   # booking logic + slot conflict
npx vitest run tests/api/rate-lessons.test.ts  # rating submission
npx vitest run tests/api/user-rooms.test.ts    # room listing per user
npx vitest run tests/api/stream-webhook.test.ts # call event handling
```

**`tests/components/`** — React Testing Library tests that render components in jsdom and assert on DOM output and user interactions.

```bash
npx vitest run tests/components/ScheduleTable.test.tsx
npx vitest run tests/components/BookTeacherInModal.test.tsx
npx vitest run tests/components/AfterCallLayout.test.tsx
```

**`tests/unit/`** — pure unit tests for library functions, Zustand store, auth helpers, and scripts.

```bash
npx vitest run tests/unit/lib/database.test.ts
npx vitest run tests/unit/store/userStore.test.ts
npx vitest run tests/unit/auth.test.ts
```

### Running a Single Test File

```bash
npx vitest run tests/api/get-countries.test.ts
```

### Troubleshooting Tests

| Problem | Fix |
|---|---|
| `Cannot find module '@/...'` | Check `vitest.config.ts` alias — `@` maps to the project root |
| `crypto.randomUUID is not a function` | Already polyfilled in `tests/setup.ts`; make sure setup file is loaded |
| Component test fails on CSS module import | `types/css.d.ts` declares `*.css` as a module — confirm it is included in `tsconfig.json` |

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests and generate coverage report |
| `npm run tunnel` | Start ngrok tunnel for webhook testing |

---

## Data Model (Prisma)

```
User ──< Language
User ──  Teacher ──< Certificate
User ──< ScheduleSlot
User >──< Room ──< GeneratedCard
User >──< Chat ──< Message
```

Key entities:
- **User** — learner or teacher, authenticated via Google OAuth
- **Teacher** — extends User with rating, price, experience, certificates
- **Room** — a video session; stores transcription and generated flashcards
- **GeneratedCard** — AI-generated vocabulary card (front/back/example/translation)
- **ScheduleSlot** — teacher availability slots used by the booking system
- **Chat / Message** — persistent chat between users (Stream Chat)
