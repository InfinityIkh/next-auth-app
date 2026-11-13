import { cookies } from "next/headers"
import { NextResponse } from "next/server"

//set cookie
export const setCookie = (response: NextResponse, name: string, value: string, age: number): NextResponse => {
    response.cookies.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60,
        path: "/"
    })

    return response
}

export const setAccessToken = (response: NextResponse, accessToken: string): NextResponse => {
    return setCookie(response, "accessToken", accessToken, 15 * 60)
}

export const setRefreshToken = (response: NextResponse, refreshToken: string): NextResponse => {
    return setCookie(response, "refreshToken", refreshToken, 7 * 24 * 60 * 60)
}

export const setAuthTokens = (response: NextResponse, refreshToken: string, accessToken: string): NextResponse => {
    setAccessToken(response, accessToken)
    setRefreshToken(response, refreshToken)

    return response
}

//get cookie
export const getCookie = async (name: string): Promise<string | null> => {
    const cookiesStore = await cookies()
    const cookie = cookiesStore.get(name)
    if (!cookie) {
        return null
    }
    return cookie.value
}

export const getAccessToken = (): Promise<string | null> => {
    return getCookie("accessToken")
}

export const getRefreshToken = (): Promise<string | null> => {
    return getCookie("refreshToken")
}

//delete cookie
export const deleteCookie = async (name: string): Promise<boolean> => {
    const cookiesStore = await cookies()
    const cookie = cookiesStore.get(name)

    if (!cookie) {
        return false
    }

    cookiesStore.delete(name)
    return true
}

export const deleteAccessToken = (): Promise<boolean> => {
    return deleteCookie("accessToken")
}

export const deleteRefreshToken = (): Promise<boolean> => {
    return deleteCookie("refreshToken")
}