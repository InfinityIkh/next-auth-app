import { NextResponse } from "next/server"

export const setAccessToken = (response: NextResponse, accessToken: string): NextResponse => {
    response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60,
        path: "/"
    })

    return response
}

export const setRefreshToken = (response: NextResponse, refreshToken: string): NextResponse => {
    response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/"
    })

    return response
}

export const setAuthTokens = (response: NextResponse ,refreshToken: string ,accessToken: string): NextResponse => {
    setAccessToken(response, accessToken)
    setRefreshToken(response, refreshToken)

    return response
}