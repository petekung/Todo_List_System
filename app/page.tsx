import Link from "next/link";
import { CheckSquare, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Logo and Title */}
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl shadow-2xl mb-6">
              <CheckSquare className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold gradient-text">
              Todo List System
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              จัดการงานของคุณอย่างง่ายดาย มีประสิทธิภาพ และสวยงาม
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto py-8">
            <div className="glass-card rounded-2xl p-6 space-y-3 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">ใช้งานง่าย</h3>
              <p className="text-sm text-gray-600">
                อินเทอร์เฟซที่เรียบง่าย สวยงาม ใช้งานได้ง่าย
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-3 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">ปลอดภัย</h3>
              <p className="text-sm text-gray-600">
                ข้อมูลของคุณถูกเก็บอย่างปลอดภัยด้วย Supabase
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-3 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">รวดเร็ว</h3>
              <p className="text-sm text-gray-600">
                ประสิทธิภาพสูง โหลดเร็ว ตอบสนองทันที
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/login">
              <Button className="btn-primary h-14 px-8 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 gap-2">
                เข้าสู่ระบบ
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button className="h-14 px-8 rounded-xl text-lg border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300">
                สมัครสมาชิก
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>สร้างด้วย Next.js และ Supabase</p>
      </footer>
    </div>
  );
}
