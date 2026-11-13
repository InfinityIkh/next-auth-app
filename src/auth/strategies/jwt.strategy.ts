import { JwtAuthResponse, LoginInput } from "@/types/auth.type"
import { AuthContract } from "../contracts/auth-contract"
import { UserType } from "@/types/user.type"
import bcrypt from "bcryptjs"
import { AuthRepository } from "@/repositories/auth.repository"
import { signJwt, verifyJwt } from "../utils/jwt"
import { jwtPayloadSchema } from "@/validation/auth.validation"
import { generateRefreshToken, hashRefreshToken } from "../utils/refresh-token"
import { deleteAccessToken, deleteRefreshToken, getAccessToken, getRefreshToken } from "../utils/cookies"

export class JwtStrategy implements AuthContract<JwtAuthResponse> {

    async login(data: LoginInput): Promise<JwtAuthResponse | null> {
        const { email, password } = data
        const user = await AuthRepository.getByEmail(email)
        if (!user) {
            return null
        }
        const verifyPasssowrd = await bcrypt.compare(password, user.password)
        if (!verifyPasssowrd) {
            return null
        }
        const payload = jwtPayloadSchema.parse({
            userId: user.id,
            role: user.role
        })
        const accessToken = await signJwt(payload)
        const refreshToken = generateRefreshToken()
        const hashedRefreshToken = hashRefreshToken(refreshToken)

        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

        await AuthRepository.createRefreshToken({
            token: hashedRefreshToken,
            userId: user.id,
            expiresAt
        })

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
            },
            accessToken,
            refreshToken
        }
    }

    async getUser(): Promise<UserType | null> {
        const accessToken = await getAccessToken()
        if (!accessToken) {
            return null
        }

        const payload = await verifyJwt(accessToken)
        if (!payload) {
            return null
        }

        const user = await AuthRepository.getUser(payload.userId)

        return user
    }

    async logout(): Promise<void> {
        try {
            const refreshToken = await getRefreshToken()
            if (refreshToken) {
                const hashedRefreshToken = hashRefreshToken(refreshToken)
                await AuthRepository.updateRefreshToken(hashedRefreshToken)
            }
        } finally {
            await Promise.all([
                deleteAccessToken(),
                deleteRefreshToken()
            ])
        }
    }
}