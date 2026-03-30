-- ============================================
-- Seed Data - จำลองข้อมูล Todo สำหรับทดสอบ
-- รันใน Supabase SQL Editor
-- ============================================

-- 👤 User ID ของคุณ (แก้ไขตรงนี้)
-- INSERT ข้อมูล 25 รายการ
INSERT INTO public.todos (user_id, title, description, is_completed, created_at)
SELECT 
  'c42e6c87-98fe-4f23-bff6-265da2561175'::uuid,
  'งานที่ ' || i || ': ' || (ARRAY[
    'ส่งรายงานประจำสัปดาห์',
    'ประชุมทีมพัฒนา',
    'ตรวจสอบ Code Review',
    'อัปเดตเอกสารโปรเจค',
    'ทดสอบระบบ Authentication',
    'แก้ไข Bug ที่พบ',
    'เตรียม Demo ให้ลูกค้า',
    'เขียน Unit Tests',
    'Optimize Database Queries',
    'Deploy ระบบ Production',
    'ประชุมวางแผน Sprint ใหม่',
    'ศึกษาเทคโนโลยีใหม่',
    'ทำ Code Refactoring',
    'ตรวจสอบ Security',
    'สร้าง API Documentation',
    'ทดสอบ Performance',
    'แก้ไข UI/UX',
    'เพิ่มฟีเจอร์ใหม่',
    'ตรวจสอบ Logs',
    'Backup ข้อมูล',
    'อัปเดต Dependencies',
    'ทำ Integration Tests',
    'ตรวจสอบ Accessibility',
    'เตรียม Presentation',
    'สรุปผลงานประจำเดือน'
  ])[(i % 25) + 1],
  'คำอธิบายสำหรับงานที่ ' || i || ' - นี่คือรายละเอียดเพิ่มเติมของงานนี้ สามารถใส่ข้อมูลได้เต็มที่',
  (i % 3 = 0),
  NOW() - ((25 - i) * INTERVAL '1 hour')
FROM generate_series(1, 25) AS i;

-- ✅ ตรวจสอบผลลัพธ์
SELECT 
  COUNT(*) as total_todos,
  COUNT(*) FILTER (WHERE is_completed = true) as completed,
  COUNT(*) FILTER (WHERE is_completed = false) as pending
FROM public.todos;
