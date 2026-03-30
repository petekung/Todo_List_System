"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { toast } from "sonner";
import { Loader2, Mail, Lock, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      toast.success("เข้าสู่ระบบสำเร็จ!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
      </div>
      
      <Card className="w-full max-w-md glass-card rounded-2xl border-0 shadow-2xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4 text-gray-600" />
              </Button>
            </Link>
          </div>
          <CardTitle className="text-3xl font-bold gradient-text flex items-center gap-2">
            <LogIn className="h-7 w-7 text-blue-600" />
            เข้าสู่ระบบ
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            ยินดีต้อนรับกลับ! กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-5 pb-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                อีเมล
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="input-field pl-12 h-12 rounded-xl"
                  {...register("email")}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="text-red-500">●</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium text-gray-700 flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-600" />
                รหัสผ่าน
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-12 h-12 rounded-xl"
                  {...register("password")}
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="text-red-500">●</span>
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button
              type="submit"
              className="w-full h-12 rounded-xl btn-primary shadow-lg text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  เข้าสู่ระบบ
                </>
              )}
            </Button>
            <p className="text-sm text-center text-gray-600">
              ยังไม่มีบัญชี?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                สมัครสมาชิก
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
