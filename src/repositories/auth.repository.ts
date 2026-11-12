import { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { RefereshTokenInput, User } from "@/types/auth.type"

export class AuthRepository {
    static async getByEmail(email: string): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: {
                    email: email
                }
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.message === "P2025") {
                return null
            }
            throw error
        }
    }
    static async createRefreshToken(data: RefereshTokenInput) {
        return await prisma.refreshToken.create({
            data
        })
    }
}