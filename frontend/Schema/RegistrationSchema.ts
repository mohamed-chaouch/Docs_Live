import { z } from "zod";

export const RegistrationSchema = z.object({
  firstName: z
    .string()
    .nonempty({ message: "First Name is required" })
    .min(2,{
      message : "First Name must be at least 2 characters"
    })
    .trim(),

    lastName: z
    .string()
    .nonempty({ message: "Last Name is required" })
    .min(2,{
      message : "Last Name must be at least 2 characters"
    })
    .trim(),

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
