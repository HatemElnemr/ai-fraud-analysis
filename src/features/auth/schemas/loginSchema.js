import { z } from "zod";

export const loginSchema = z.object({
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
});

export const loginSchemaFields = loginSchema.shape;
