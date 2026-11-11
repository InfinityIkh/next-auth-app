import { UserType } from "./user.type"

export type LoginInput = {
    email: string
    password: string
}

export type JwtAuthResponse = {
    user: UserType
    accessToken: string
    refreshToken: string
}