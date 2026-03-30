-- ============================================
-- Todo List System - Supabase Database Setup
-- รันไฟล์นี้ครั้งเดียวใน Supabase SQL Editor
-- ============================================

-- 1. สร้างตาราง todos
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. เปิดใช้งาน Row Level Security (RLS)
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 3. ลบ policy เก่า (ถ้ามี) เพื่อป้องกันซ้ำ
DROP POLICY IF EXISTS "Users can view their own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can insert their own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can update their own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can delete their own todos" ON public.todos;

-- 4. สร้าง RLS Policies ใหม่
-- ผู้ใช้สามารถดูเฉพาะ todos ของตัวเอง
CREATE POLICY "Users can view their own todos"
  ON public.todos
  FOR SELECT
  USING (auth.uid() = user_id);

-- ผู้ใช้สามารถสร้าง todos ของตัวเอง
CREATE POLICY "Users can insert their own todos"
  ON public.todos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ผู้ใช้สามารถแก้ไขเฉพาะ todos ของตัวเอง
CREATE POLICY "Users can update their own todos"
  ON public.todos
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ผู้ใช้สามารถลบเฉพาะ todos ของตัวเอง
CREATE POLICY "Users can delete their own todos"
  ON public.todos
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5. สร้าง Index เพื่อเพิ่มประสิทธิภาพ
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON public.todos(user_id);
CREATE INDEX IF NOT EXISTS todos_created_at_idx ON public.todos(created_at DESC);

-- 6. สร้าง Trigger เพื่อตั้ง created_at อัตโนมัติ (ถ้าต้องการ)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

