import { z } from "zod";

export const registerSchema = z
  .object({
    displayName: z.string().trim().min(1, "Full Name is required."),
    email: z
      .string()
      .trim()
      .min(1, "Email Address is required.")
      .email("Please enter a valid email address."),
    password: z
      .string()
      .trim()
      .min(1, "Password is required.")
      .min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string().trim().min(1, "Confirm Password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const registerSchemaFields = registerSchema.shape;
