import { z } from "zod";

export const todoSchema = z.object({
  title: z
    .string()
    .min(1, "กรุณากรอกชื่องาน")
    .max(100, "ชื่องานต้องไม่เกิน 100 ตัวอักษร"),
  description: z
    .string()
    .max(500, "คำอธิบายต้องไม่เกิน 500 ตัวอักษร")
    .optional()
    .nullable(),
});

export type TodoFormData = z.infer<typeof todoSchema>;
