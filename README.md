# Todo List System - Interview Assignment

A full-stack todo list application built with Next.js 14, Supabase, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components:** shadcn/ui
- **Form & Validation:** React Hook Form + Zod
- **Backend/Database/Auth:** Supabase
- **Deployment:** Vercel

---

## Phase 1: Setup & Database Configuration

### Step 1: Install Dependencies

All dependencies have been installed. Run:

```bash
npm install
```

### Step 2: Set Up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Paste and run the following SQL:

```sql
-- Create the todos table
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only see their own todos
CREATE POLICY "Users can view their own todos"
  ON todos
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create their own todos
CREATE POLICY "Users can insert their own todos"
  ON todos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own todos
CREATE POLICY "Users can update their own todos"
  ON todos
  FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: Users can only delete their own todos
CREATE POLICY "Users can delete their own todos"
  ON todos
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON todos(user_id);
CREATE INDEX IF NOT EXISTS todos_created_at_idx ON todos(created_at DESC);
```

### Step 3: Configure Environment Variables

1. Go to your Supabase project dashboard
2. Click **Settings** (gear icon) → **API**
3. Copy your credentials

Then update `.env.local` with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## Project Structure

```
Todo_List _System/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Browser Supabase client
│   │   └── server.ts      # Server Supabase client
│   └── utils.ts           # Utility functions
├── middleware.ts          # Supabase auth middleware
├── .env.local             # Environment variables
├── tailwind.config.js     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

---

## Next Phases

- **Phase 2:** Authentication (Login/Register pages, Navbar, Logout)
- **Phase 3:** Todo CRUD operations with pagination
- **Deployment:** Vercel deployment guide

---

## Security Notes

- Row Level Security (RLS) ensures users can only access their own todos
- All database operations are performed with the user's authenticated session
- Environment variables are properly secured (not committed to git)
