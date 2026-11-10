import { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { CreateUserInput, UpdateUserInput, UserType } from "@/types/user.type"

export class UserRepository {
    static async getAll(): Promise<UserType[]> {
        return await prisma.user.findMany({
            orderBy: {
                created_at: "desc"
            },
            select: {
                id: true,
                username: true,
                email: true,
                created_at: true,
                role: true
            }
        })
    }

    static async create(data: CreateUserInput): Promise<UserType> {
        return await prisma.user.create({
            data: data,
            select: {
                id: true,
                username: true,
                email: true,
                created_at: true,
                role: true
            }
        })
    }

    static async get(id: number): Promise<UserType | null> {
        try {
            return await prisma.user.findUnique({
                where: {
                    id: id
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    created_at: true,
                    role: true
                }
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.message === "P2025") {
                return null
            }
            throw error
        }
    }

    static async getByEmail(email: string): Promise<UserType | null> {
        try {
            return await prisma.user.findUnique({
                where: {
                    email: email
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    created_at: true,
                    role: true
                }
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.message === "P2025") {
                return null
            }
            throw error
        }
    }

    static async update(id: number, data: UpdateUserInput): Promise<UserType | null> {
        try {
            return await prisma.user.update({
                where: {
                    id: id
                },
                data: data,
                select: {
                    id: true,
                    username: true,
                    email: true,
                    created_at: true,
                    role: true
                }
            })
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                return null
            }
            throw error
        }
    }

    static async delete(id: number): Promise<UserType | null> {
        try {
            return await prisma.user.delete({
                where: {
                    id: id
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    created_at: true,
                    role: true
                }
            })
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                return null
            }
            throw error
        }
    }
}