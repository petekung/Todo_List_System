"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todoSchema, type TodoFormData } from "@/lib/validations/todo";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, Check, X, ChevronLeft, ChevronRight, ClipboardList, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Todo {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

export default function DashboardPage() {
  const supabase = createClient();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
  });

  useEffect(() => {
    fetchTodos();
  }, [currentPage]);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("todos")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      setTodos(data || []);
      setTotalCount(count || 0);
    } catch (error: any) {
      toast.error("ไม่สามารถโหลดข้อมูลได้: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: TodoFormData) => {
    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("ไม่พบผู้ใช้ กรุณาล็อกอินใหม่");
      }

      const { error } = await supabase
        .from("todos")
        .insert([{
          title: data.title,
          description: data.description || null,
          user_id: user.id,
        }]);

      if (error) throw error;

      toast.success("สร้างงานสำเร็จ!");
      reset();
      setIsDialogOpen(false);
      fetchTodos();
    } catch (error: any) {
      toast.error("สร้างงานไม่สำเร็จ: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (data: TodoFormData) => {
    if (!editingTodo) return;

    try {
      const { error } = await supabase
        .from("todos")
        .update({
          title: data.title,
          description: data.description || null,
        })
        .eq("id", editingTodo.id);

      if (error) throw error;

      toast.success("อัปเดตงานสำเร็จ!");
      setEditingTodo(null);
      fetchTodos();
    } catch (error: any) {
      toast.error("อัปเดตไม่สำเร็จ: " + error.message);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ is_completed: !todo.is_completed })
        .eq("id", todo.id);

      if (error) throw error;

      setTodos(todos.map(t =>
        t.id === todo.id ? { ...t, is_completed: !t.is_completed } : t
      ));
      toast.success(todo.is_completed ? "ยกเลิกเสร็จสิ้น" : "ทำเสร็จแล้ว!");
    } catch (error: any) {
      toast.error("ไม่สามารถอัปเดตได้: " + error.message);
    }
  };

  const confirmDelete = (todoId: string) => {
    setTodoToDelete(todoId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!todoToDelete) return;

    try {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", todoToDelete);

      if (error) throw error;

      toast.success("ลบงานสำเร็จ!");
      setDeleteDialogOpen(false);
      setTodoToDelete(null);
      fetchTodos();
    } catch (error: any) {
      toast.error("ลบไม่สำเร็จ: " + error.message);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const completedCount = todos.filter(t => t.is_completed).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text flex items-center gap-3">
              <ClipboardList className="h-10 w-10 text-blue-600" />
              รายการงานของฉัน
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              มีทั้งหมด <span className="font-semibold text-blue-600">{totalCount}</span> งาน
              {totalCount > 0 && (
                <span className="text-sm text-gray-500">
                  • เสร็จแล้ว {completedCount} งาน
                </span>
              )}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary gap-2 h-12 px-6 rounded-xl shadow-lg">
                <Plus className="h-5 w-5" />
                เพิ่มงานใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg rounded-2xl">
              <form onSubmit={handleSubmit(handleCreate)}>
                <DialogHeader>
                  <DialogTitle className="text-2xl gradient-text">เพิ่มงานใหม่</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    สร้างงานใหม่เพื่อจัดการสิ่งที่ต้องทำของคุณ
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-5 py-5">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-medium text-gray-700">ชื่องาน *</Label>
                    <Input
                      id="title"
                      placeholder="เช่น ส่งรายงานประจำสัปดาห์"
                      className="input-field h-12 rounded-xl"
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-medium text-gray-700">คำอธิบาย</Label>
                    <Textarea
                      id="description"
                      placeholder="รายละเอียดเพิ่มเติม..."
                      className="input-field rounded-xl resize-none"
                      {...register("description")}
                      rows={4}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-xl"
                  >
                    ยกเลิก
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isCreating}
                    className="btn-primary rounded-xl"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        กำลังสร้าง...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        สร้างงาน
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Todo List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-blue-200 animate-pulse" />
          </div>
        </div>
      ) : todos.length === 0 ? (
        <Card className="glass-card rounded-2xl border-0">
          <CardContent className="py-16 text-center">
            <ClipboardList className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500 font-medium">ยังไม่มีงานใดๆ</p>
            <p className="mt-2 text-gray-400">คลิก &quot;เพิ่มงานใหม่&quot; เพื่อเริ่มจัดการงานของคุณ</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {todos.map((todo, index) => (
            <Card
              key={todo.id}
              className={`todo-item glass-card rounded-2xl border-0 ${
                todo.is_completed ? "bg-gray-50/80" : "bg-white/90"
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="py-5">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={todo.is_completed}
                    onCheckedChange={() => handleToggleComplete(todo)}
                    className="mt-1 h-5 w-5 rounded-lg data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-cyan-500"
                  />
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-lg ${
                        todo.is_completed ? "line-through text-gray-400" : "text-gray-800"
                      }`}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {todo.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      สร้างเมื่อ {new Date(todo.created_at).toLocaleString("th-TH")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTodo(todo)}
                      className="h-10 w-10 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmDelete(todo.id)}
                      className="h-10 w-10 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-xl px-4 h-10 shadow-sm hover:shadow-md transition-all"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            ย้อนกลับ
          </Button>
          <span className="text-sm font-medium text-gray-600 bg-white/80 px-4 py-2 rounded-xl shadow-sm">
            หน้า {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-xl px-4 h-10 shadow-sm hover:shadow-md transition-all"
          >
            ถัดไป
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      {editingTodo && (
        <EditDialog
          todo={editingTodo}
          open={!!editingTodo}
          onOpenChange={() => setEditingTodo(null)}
          onSave={handleUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-red-600 flex items-center gap-2">
              <Trash2 className="h-6 w-6" />
              ยืนยันการลบ
            </DialogTitle>
            <DialogDescription className="text-gray-600 pt-2">
              คุณแน่ใจหรือไม่ที่ต้องการลบงานนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-xl"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleDelete}
              className="btn-primary rounded-xl"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              ลบงาน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Edit Dialog Component
function EditDialog({
  todo,
  open,
  onOpenChange,
  onSave,
}: {
  todo: Todo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: TodoFormData) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description || "",
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <form onSubmit={handleSubmit(onSave)}>
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text flex items-center gap-2">
              <Edit2 className="h-6 w-6 text-blue-600" />
              แก้ไขงาน
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              แก้ไขรายละเอียดของงาน
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-5">
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="font-medium text-gray-700">ชื่องาน *</Label>
              <Input
                id="edit-title"
                className="input-field h-12 rounded-xl"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <X className="h-3 w-3" />
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="font-medium text-gray-700">คำอธิบาย</Label>
              <Textarea
                id="edit-description"
                className="input-field rounded-xl resize-none"
                {...register("description")}
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <X className="h-3 w-3" />
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              ยกเลิก
            </Button>
            <Button 
              type="submit"
              className="btn-primary rounded-xl"
            >
              <Check className="mr-2 h-4 w-4" />
              บันทึกการแก้ไข
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
