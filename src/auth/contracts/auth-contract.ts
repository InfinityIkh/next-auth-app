import type { LoginInput } from "@/types/auth.type"
import type { UserType } from "@/types/user.type"

export interface AuthContract<TAuthResponse> {
    login(data: LoginInput): Promise<TAuthResponse | null>
    getUser(): Promise<UserType | null>
    logout(): Promise<void>
}