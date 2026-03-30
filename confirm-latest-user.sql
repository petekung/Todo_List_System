-- ============================================
-- Confirm Latest User - ยืนยัน user ล่าสุด
-- รันใน Supabase SQL Editor
-- ============================================

-- ยืนยัน user ที่สร้างล่าสุด
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- หา user ล่าสุดที่ยังไม่ยืนยัน
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE confirmed_at IS NULL
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF target_user_id IS NOT NULL THEN
    -- ใช้ auth.admin.update_user_status (ถ้ามี)
    -- หรือ update โดยตรงผ่าน function
    RAISE NOTICE 'พบ user ที่ต้องยืนยัน: %', target_user_id;
    
    -- ลองใช้วิธี update meta data
    UPDATE auth.users
    SET raw_user_meta_data = raw_user_meta_data || '{"email_verified": true}'::jsonb
    WHERE id = target_user_id;
    
    RAISE NOTICE 'อัปเดต meta data สำเร็จ!';
  ELSE
    RAISE NOTICE 'ไม่พบ user ที่ต้องยืนยัน';
  END IF;
END $$;

-- ตรวจสอบผลลัพธ์
SELECT id, email, confirmed_at, raw_user_meta_data->>'email_verified' as email_verified
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
