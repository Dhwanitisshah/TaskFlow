import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(40, "Name must be 40 characters or less."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(64, "Password must be 64 characters or less.")
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required.")
});

const dueDateSchema = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine((value) => !value || !Number.isNaN(new Date(value).getTime()), "Enter a valid due date.");

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(80, "Title must be 80 characters or less."),
  description: z
    .string()
    .trim()
    .max(250, "Description must be 250 characters or less.")
    .optional()
    .default(""),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: dueDateSchema
});

export function formatZodError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Validation failed.";
}
