import { AuthContract } from "@/auth/contracts/auth-contract"
import { LoginInput, RegisterInput } from "@/types/auth.type"
import { UserType } from "@/types/user.type"
import { UserService } from "./user.service"

export class AuthService<TAuthResponse> {

    constructor(private readonly authStrategy: AuthContract<TAuthResponse>) { }

    async register(data: RegisterInput) {
        const response = await UserService.createUser(data)
        return {
            data: { ...response.data, message: "User registred succesfully" },
            status: response.status
        }
    }

    login(data: LoginInput): Promise<TAuthResponse | null> {
        return this.authStrategy.login(data)
    }

    authenticated(): Promise<UserType | null> {
        return this.authStrategy.getUser()
    }

    logout(): Promise<void> {
        return this.authStrategy.logout()
    }
}