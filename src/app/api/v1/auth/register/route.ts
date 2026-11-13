import { JwtStrategy } from "@/auth/strategies/jwt.strategy";
import { AuthService } from "@/services/auth.service";
import { registerSchema } from "@/validation/auth.validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const data: unknown = await request.json()
        const result = registerSchema.safeParse(data)
        if (!result.success) {
            return NextResponse.json({
                success: false,
                message: "Validation failed.",
                errors: result.error.flatten().fieldErrors
            }, { status: 422 })
        }
        const authService = new AuthService(new JwtStrategy())
        const response = await authService.register(result.data)

        return NextResponse.json(response.data, {
            status: response.status
        })
    } catch (error: unknown) {
        console.error("error: ", error)

        if (error instanceof SyntaxError) {
            return NextResponse.json({
                success: false,
                message: "Invalid JSON request body.",
            }, { status: 400 })
        }

        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred. Please try again later."
        }, { status: 500 })
    }
}