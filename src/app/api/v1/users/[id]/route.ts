import { UserService } from "@/services/user.service";
import { UserIdParams } from "@/types/user.type";
import { updateUserSchema } from "@/validation/user.validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, { params }: UserIdParams) {
    try {
        const { id } = await params
        const response = await UserService.getUserById(id)

        return NextResponse.json(response.data, { status: response.status })

    } catch (error: unknown) {
        console.error("Error:", error)

        return NextResponse.json(
            {
                success: false,
                message: "An unexpected error occurred.",
            },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest, { params }: UserIdParams) {
    try {
        const { id } = await params
        const data: unknown = await request.json()

        const result = updateUserSchema.safeParse(data)
        if (!result.success) {
            return NextResponse.json({
                success: false,
                message: "Validation failed.",
                errors: result.error.flatten().fieldErrors
            })
        }

        const response = await UserService.updateUser(id, result.data)
        return NextResponse.json(response.data, { status: response.status })
    } catch (error: unknown) {
        console.error("Error:", error)

        return NextResponse.json(
            {
                success: false,
                message: "An unexpected error occurred.",
            },
            { status: 500 }
        )
    }
}

export async function DELETE(_request: NextRequest, { params }: UserIdParams) {
    try {
        const { id } = await params

        const response = await UserService.deleteUser(id)
        return NextResponse.json(response.data, { status: response.status })
    } catch (error: unknown) {
        console.error("Error:", error)

        return NextResponse.json(
            {
                success: false,
                message: "An unexpected error occurred.",
            },
            { status: 500 }
        )
    }
}