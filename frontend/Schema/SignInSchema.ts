import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email()
    .trim()
    .toLowerCase(),


    password: z
    .string()
    .nonempty({ message: "Password is required" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })   // Check for at least one number
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character"
    })   // Check for at least one special character
    .min(8, {
      message: "Password must be at least 8 characters long"
    })
    .trim(),
});
