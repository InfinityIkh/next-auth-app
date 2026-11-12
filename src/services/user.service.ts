import bcrypt from "bcryptjs"
import { Prisma } from "@/generated/prisma/client"
import { UserRepository } from "@/repositories/user.repository"
import type { CreateUserInput, UpdateUserInput, UserType } from "@/types/user.type"
import type { ServiceResponse } from "@/types/service.type"

export class UserService {

    static async getAllUsers(): Promise<ServiceResponse<{ users: UserType[] }>> {
        const users = await UserRepository.getAll()

        return {
            data: {
                success: true,
                message: "Users retrieved successfully",
                data: { users },
            },
            status: 200,
        }
    }

    static async getUserById(userId: string): Promise<ServiceResponse<{ user: UserType }>> {
        const id = Number(userId)
        if (!Number.isSafeInteger(id) || id <= 0) {
            return {
                data: {
                    success: false,
                    message: "Invalid user ID.",
                },
                status: 400,
            }
        }

        const user = await UserRepository.get(id)
        if (!user) {
            return {
                data: {
                    success: false,
                    message: "User not found.",
                },
                status: 404,
            }
        }

        return {
            data: {
                success: true,
                message: "User retrieved successfully.",
                data: { user },
            },
            status: 200,
        }
    }

    static async createUser(data: CreateUserInput): Promise<ServiceResponse<{ user: UserType }>> {
        try {
            const normalizedEmail = data.email.trim().toLowerCase()
            const existingUser = await UserRepository.getByEmail(normalizedEmail)

            if (existingUser) {
                return {
                    data: {
                        success: false,
                        message: "Email is already registered",
                        errors: {
                            email: ["This email is already in use"],
                        },
                    },
                    status: 409,
                }
            }

            const hashedPassword = await bcrypt.hash(data.password, 12)

            const user = await UserRepository.create({
                ...data,
                password: hashedPassword,
                email: normalizedEmail
            })

            return {
                data: {
                    success: true,
                    message: "User created successfully",
                    data: { user },
                },
                status: 201,
            }
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                return {
                    data: {
                        success: false,
                        message: "Email is already registered",
                    },
                    status: 409,
                }
            }

            throw error
        }
    }

    static async updateUser(userId: string, data: UpdateUserInput): Promise<ServiceResponse<{ user: UserType }>> {
        const id = Number(userId)
        if (!Number.isSafeInteger(id) || id <= 0) {
            return {
                data: {
                    success: false,
                    message: "Invalid user ID.",
                },
                status: 400,
            }
        }
        const existingUser = await UserRepository.get(id)

        if (!existingUser) {
            return {
                data: {
                    success: false,
                    message: "User not found",
                },
                status: 404,
            }
        }

        if (data.email && data.email.trim().toLowerCase() !== existingUser.email) {
            const emailExists = await UserRepository.getByEmail(data.email.trim().toLowerCase())

            if (emailExists) {
                return {
                    data: {
                        success: false,
                        message: "Email is already registered",
                        errors: {
                            email: ["This email is already in use"],
                        },
                    },
                    status: 409,
                }
            }
        }

        const user = await UserRepository.update(id, { ...data, email: data.email?.trim().toLocaleLowerCase() })

        if (!user) {
            return {
                data: {
                    success: false,
                    message: "User not found",
                },
                status: 404,
            }
        }

        return {
            data: {
                success: true,
                message: "User updated successfully",
                data: { user },
            },
            status: 200,
        }
    }

    static async deleteUser(userId: string): Promise<ServiceResponse<{ user: UserType }>> {
        const id = Number(userId)
        if (!Number.isSafeInteger(id) || id <= 0) {
            return {
                data: {
                    success: false,
                    message: "Invalid user ID.",
                },
                status: 400,
            }
        }
        const user = await UserRepository.delete(id)

        if (!user) {
            return {
                data: {
                    success: false,
                    message: "User not found",
                },
                status: 404,
            }
        }

        return {
            data: {
                success: true,
                message: "User deleted successfully",
                data: { user },
            },
            status: 200,
        }
    }
}