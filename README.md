# Todo List System 📝

ระบบจัดการรายการสิ่งที่ต้องทำ (Todo List) แบบครบวงจร สร้างด้วย Next.js และ Supabase

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)

---

## ✨ ฟีเจอร์หลัก

### 🔐 ระบบ Authentication
- สมัครสมาชิก / เข้าสู่ระบบ
- ยืนยันอีเมลอัตโนมัติ (ไม่ต้องรออีเมลยืนยัน)
- จัดการ Session ด้วย Supabase Auth
- Protected Routes ด้วย Middleware

### 📋 จัดการ Todo
- ✅ เพิ่ม Todo ใหม่
- ✏️ แก้ไข Todo
- 🗑️ ลบ Todo (มี Confirmation)
- ✔️ ทำเครื่องหมายว่าเสร็จแล้ว
- 📄 ดูรายละเอียด (ชื่อ, คำอธิบาย, วันที่สร้าง)

### 📊 ฟีเจอร์เพิ่มเติม
- 🔢 **Pagination** - แสดง 10 รายการต่อหน้า
- 👤 **แยกข้อมูลตามผู้ใช้** - แต่ละคนเห็นเฉพาะ Todo ของตัวเอง
- 🎨 **UI/UX สวยงาม** - Glassmorphism Design, Responsive
- ⚡ **Real-time Validation** - ด้วย Zod + React Hook Form
- 🔔 **Toast Notifications** - แจ้งเตือนทุกการกระทำ

---

## 🛠️ Tech Stack

| ส่วน | เทคโนโลยี |
|------|----------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, Radix UI |
| **Backend** | Supabase (PostgreSQL, Auth) |
| **Validation** | Zod, React Hook Form |
| **Notifications** | Sonner |

---

## 🚀 เริ่มต้นใช้งาน

### 1. Clone Project

```bash
git clone <your-repo-url>
cd Todo_List_System
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` และเพิ่มค่าดังนี้:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> **หา API Keys ได้ที่:** Supabase Dashboard → Settings → API

### 4. ตั้งค่า Database

รัน SQL ใน **Supabase SQL Editor**:

```bash
# รันไฟล์สร้างตาราง
supabase-setup.sql
```

หรือคัดลอก SQL จากไฟล์ `supabase-setup.sql` ไปรันใน Supabase Dashboard

### 5. รัน Development Server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

---

## 📁 โครงสร้างโปรเจค

```
Todo_List_System/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── signup/          # API สมัครสมาชิกอัตโนมัติ
│   │           └── route.ts
│   ├── dashboard/               # หน้าจัดการ Todo
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── login/                   # หน้าเข้าสู่ระบบ
│   │   └── page.tsx
│   ├── register/                # หน้าสมัครสมาชิก
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Landing Page
├── components/
│   ├── ui/                      # UI Components (Button, Input, etc.)
│   └── Navbar.tsx
├── lib/
│   ├── supabase/                # Supabase Client
│   │   ├── client.ts
│   │   └── server.ts
│   └── validations/             # Zod Schemas
│       ├── auth.ts
│       └── todo.ts
├── .env.local                   # Environment Variables
├── .env.example                 # ตัวอย่าง Environment Variables
├── seed-data.sql                # ข้อมูลทดสอบ (25 รายการ)
├── supabase-setup.sql           # Database Schema
├── auto-signup.js               # Script สมัครสมาชิกอัตโนมัติ
└── confirm-user.js              # Script ยืนยันอีเมล
```

---

## 📖 การใช้งาน

### สมัครสมาชิก

1. ไปที่ `/register`
2. กรอกอีเมลและรหัสผ่าน
3. กด "สมัครสมาชิก"
4. ✅ เข้าสู่ระบบทันที (ไม่ต้องยืนยันอีเมล)

### เข้าสู่ระบบ

1. ไปที่ `/login`
2. กรอกอีเมลและรหัสผ่าน
3. กด "เข้าสู่ระบบ"

### จัดการ Todo

1. เข้า Dashboard (`/dashboard`)
2. กด "เพิ่มงานใหม่" เพื่อสร้าง Todo
3. แก้ไข/ลบ/ทำเครื่องหมายว่าเสร็จแล้ว ได้ตามต้องการ

---

## 🧪 ข้อมูลทดสอบ

### รัน Script สร้างข้อมูล 25 รายการ

```bash
# วิธีที่ 1: ใช้ SQL (แนะนำ)
# คัดลอกโค้ดจาก seed-data.sql ไปรันใน Supabase SQL Editor

# วิธีที่ 2: ใช้ Node.js Script
node auto-signup.js  # สร้าง user ใหม่ + ยืนยันอัตโนมัติ
```

### ข้อมูล Login สำหรับทดสอบ

หลังรัน `auto-signup.js` จะได้:
```
Email: test177488xxxx@gmail.com
Password: 111111
```

---

## 🔒 Security

### Row Level Security (RLS)

แต่ละผู้ใช้เห็นเฉพาะ Todo ของตัวเอง:

```sql
-- ผู้ใช้สามารถดูเฉพาะ todos ของตัวเอง
CREATE POLICY "Users can view their own todos"
  ON public.todos
  FOR SELECT
  USING (auth.uid() = user_id);
```

### API Keys

| Key | ใช้สำหรับ |
|-----|----------|
| **Anon Key** | Frontend (Client-side) |
| **Service Role Key** | Backend (Server-side only) |

> ⚠️ **ห้าม** expose Service Role Key ใน Client-side code!

---

## 🌐 Deployment

### Deploy บน Vercel

1. Push code ขึ้น GitHub
2. ไปที่ [Vercel](https://vercel.com)
3. Import Project
4. ตั้งค่า Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy! 🚀

### URL หลัง Deploy

```
https://your-project.vercel.app
```

---

## 📝 API Endpoints

### POST `/api/auth/signup`

สมัครสมาชิก + ยืนยันอีเมลอัตโนมัติ

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```
---

## 🎨 UI Components

ใช้ components จาก [shadcn/ui](https://ui.shadcn.com):

- Button
- Input
- Label
- Textarea
- Checkbox
- Card
- Dialog
- Sonner (Toast)
---
## 📚 Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://radix-ui.com)
- [shadcn/ui](https://ui.shadcn.com)
