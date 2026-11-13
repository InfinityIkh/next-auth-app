import { JwtStrategy } from "@/auth/strategies/jwt.strategy"
import { AuthService } from "@/services/auth.service"
import { NextResponse } from "next/server"

export async function POST() {
    try {
        const authService = new AuthService(new JwtStrategy())
        await authService.logout()

        return NextResponse.json({
            success: true,
            message: "Logged out successfully."
        }, { status: 200 })

    } catch (error: unknown) {
        console.error("error :", error)

        return NextResponse.json({
            success: false,
            message: "Unable to complete logout. Please try again later."
        }, { status: 500 })
    }
}