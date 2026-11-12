import z from "zod"

export const credentialsSchema = z.object({
    email: z
        .email("Please enter a valid email address"),

    password: z
        .string("Password cannot be empty")
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password must not exceed 64 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})

export const registerSchema = credentialsSchema.extend({
    username: z
        .string("Username cannot be empty")
        .min(4, "Username must be at least 4 characters long")
        .max(18, "Username must not exceed 18 characters"),
})

export const loginSchema = credentialsSchema

export const jwtPayloadSchema = z.object({
    userId: z.number().int().positive(),
    role: z.enum(["USER", "ADMIN"]),
})