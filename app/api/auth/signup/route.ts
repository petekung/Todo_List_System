import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email และ Password ต้องไม่ว่าง' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: 'SUPABASE_SERVICE_ROLE_KEY ไม่ได้ตั้งค่า' },
        { status: 500 }
      )
    }

    // ใช้ Admin API เพื่อสมัคร + ยืนยันอีเมลทันที (ไม่ติด rate limit)
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,  // ยืนยันอีเมลทันที!
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.msg || 'สมัครสมาชิกไม่สำเร็จ' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
