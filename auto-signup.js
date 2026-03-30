/**
 * Auto Signup Script - สมัคร + ยืนยันอีเมล อัตโนมัติ
 * 
 * วิธีใช้:
 * 1. npm install
 * 2. ใส่ SUPABASE_SERVICE_ROLE_KEY ใน .env.local
 * 3. node auto-signup.js
 */

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ กรุณาใส่ SUPABASE_SERVICE_ROLE_KEY ใน .env.local');
  console.error('   หาได้ที่: Settings → API → Service Role Key');
  process.exit(1);
}

// ข้อมูลที่ต้องการสมัคร
const EMAIL = 'test' + Date.now() + '@gmail.com'; // อีเมลไม่ซ้ำ
const PASSWORD = '111111';

async function autoSignup() {
  console.log(`📝 กำลังสมัคร: ${EMAIL}\n`);

  // 1. สมัครสมาชิก (ใช้ Service Role Key เพื่อ bypass rate limit)
  const signupRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,  // ยืนยันอีเมลทันที!
    }),
  });

  const signupData = await signupRes.json();
  console.log('Signup response:', signupData);

  if (!signupRes.ok) {
    console.error('❌ Signup failed:', signupData);
    return;
  }

  console.log('✅ สมัครสมาชิก + ยืนยันอีเมล สำเร็จ!');
  console.log('User ID:', signupData.user?.id);
  console.log('Email:', signupData.user?.email);
  console.log('Confirmed at:', signupData.user?.confirmed_at);
  console.log('\n🎉 Login ได้เลย!');
  console.log(`\n📌 ข้อมูล Login:`);
  console.log(`   Email: ${EMAIL}`);
  console.log(`   Password: ${PASSWORD}`);
}

autoSignup();
