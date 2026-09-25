import { z } from "zod";
import { ROLES } from "./roles";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address.")
  .max(254);

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password too long.");

/** Login for participant/organizer. Judge uses magic link, not this. */
export const loginSchema = z.object({
  role: z.enum(["participant", "organizer"]),
  email: emailSchema,
  password: passwordSchema,
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  role: z.enum(["participant", "organizer"]),
  name: z.string().trim().min(2).max(80),
  email: emailSchema,
  password: passwordSchema,
});
export type SignupInput = z.infer<typeof signupSchema>;

/** Judge requests a magic link for a specific event. */
export const magicRequestSchema = z.object({
  email: emailSchema,
  eventId: z.string().min(1),
});
export type MagicRequestInput = z.infer<typeof magicRequestSchema>;

export const rolesSchema = z.enum(ROLES);