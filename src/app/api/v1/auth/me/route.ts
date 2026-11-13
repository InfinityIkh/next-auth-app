import { JwtStrategy } from "@/auth/strategies/jwt.strategy";
import { AuthService } from "@/services/auth.service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const authService = new AuthService(new JwtStrategy())
        const user = await authService.authenticated()
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Unauthenticated."
            }, { status: 401 })
        }

        return NextResponse.json({
            success: true,
            message: "User retrieved successfully.",
            user
        }, { status: 200 })

    } catch (error: unknown) {
        console.error("error :", error)

        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred. Please try again later."
        }, { status: 500 })
    }
}