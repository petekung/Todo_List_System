"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { LogOut, User, CheckSquare, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email ?? null);
      setIsLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("ออกจากระบบไม่สำเร็จ");
      return;
    }
    toast.success("ออกจากระบบแล้ว");
    router.push("/");
    router.refresh();
  };

  if (isLoading) {
    return (
      <nav className="border-b bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl gradient-text">Todo List</span>
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-7 w-7 text-blue-600" />
            <span className="font-bold text-xl hidden sm:inline-block gradient-text">
              Todo List System
            </span>
            <span className="font-bold text-xl sm:hidden gradient-text">Todo List</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/50 px-3 py-2 rounded-xl">
              <User className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>ออกจากระบบ</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t mt-3 animate-fade-in">
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/50 px-3 py-3 rounded-xl">
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="gap-2 rounded-xl justify-start hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>ออกจากระบบ</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
