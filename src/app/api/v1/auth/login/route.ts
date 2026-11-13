import { JwtStrategy } from "@/auth/strategies/jwt.strategy"
import { setAuthTokens } from "@/auth/utils/cookies"
import { AuthService } from "@/services/auth.service"
import { loginSchema } from "@/validation/auth.validation"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const data: unknown = await request.json()
        const result = loginSchema.safeParse(data)
        if (!result.success) {
            return NextResponse.json({
                success: false,
                message: "Validation failed.",
                errors: result.error.flatten().fieldErrors
            }, { status: 422 })
        }

        const authService = new AuthService(new JwtStrategy())
        const serviceResponse = await authService.login(result.data)
        if (!serviceResponse) {
            return NextResponse.json({
                success: false,
                message: "Invalid email or password.",
                errors: {}
            }, { status: 401 })
        }

        const response = NextResponse.json({
            success: true,
            message: "Login successful.",
            data: serviceResponse.user
        })
        return setAuthTokens(
            response,
            serviceResponse.refreshToken,
            serviceResponse.accessToken
        )
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