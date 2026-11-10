import { UserService } from "@/services/user.service"
import { userSchema } from "@/validation/user.validation"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
    try {
        const response = await UserService.getAllUsers()

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

export async function POST(request: NextRequest) {
    try {
        const data: unknown = await request.json()
        const result = userSchema.safeParse(data)
        if (!result.success) {
            return NextResponse.json({
                success: false,
                message: "Validation failed.",
                errors: result.error.flatten().fieldErrors
            }, { status: 422 })
        }

        const response = await UserService.createUser(result.data)

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