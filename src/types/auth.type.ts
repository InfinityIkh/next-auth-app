import z from "zod"
import { UserType } from "./user.type"
import { jwtPayloadSchema, loginSchema, registerSchema } from "@/validation/auth.validation"

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

export type UserRole = "USER" | "ADMIN"

export type JwtAuthResponse = {
    user: UserType
    accessToken: string
    refreshToken: string
}

export type JwtPayload = z.infer<typeof jwtPayloadSchema>

export type User = UserType & {password : string}

export type RefereshTokenInput = {
    token : string,
    userId : number,
    expiresAt : Date
}