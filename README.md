# Study English Application

Real-time video calling application with automatic transcription and vocabulary tracking for language learners.

## 🚀 Features

- **Video Calls** - HD video/audio with Stream SDK
- **Live Transcription** - Automatic speech-to-text during calls for students
- **Vocabulary Tracking** - Auto-generates flashcards from conversation transcripts using AI
- **User Profiles** - Google OAuth with personalized learning stats
- **Review System** - Interactive flashcards for learned vocabulary
- **Room Management** - Create and join study sessions
- **Role-based Access** - Separate experiences for Teachers and Students

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, DaisyUI
- **Video**: Stream Video SDK
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js v5 (Google OAuth)
- **AI**: Groq SDK for flashcard generation
- **Deployment**: Vercel/NGROK for webhooks

## 📦 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials
- Stream API keys
- Groq API key

### Setup

1. **Clone repository**

   ```bash
   git clone https://github.com/gopak-Barvinok/study-english-app.git
   cd study-english-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your API keys:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_SECRET="your-google-client-secret"
   STREAM_API_KEY="your-stream-api-key"
   STREAM_API_SECRET="your-stream-api-secret"
   GROQ_API_KEY="your-groq-api-key"
   ```

4. **Set up database**
   Start PostgreSQL (using Docker Compose):

   ```bash
   docker-compose up -d
   ```

   Run Prisma migrations:

   ```bash
   npx prisma migrate dev
   ```

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Additional Scripts

- `npm run tunnel` - Start ngrok tunnel for webhooks
- `npm run build` - Build for production
- `npm run start` - Start production server
