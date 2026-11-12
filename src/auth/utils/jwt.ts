import { JwtPayload } from "@/types/auth.type"
import { jwtPayloadSchema } from "@/validation/auth.validation"
import { jwtVerify, SignJWT } from "jose"

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters")
}

const secret = new TextEncoder().encode(jwtSecret)

export const signJwt = (payload: JwtPayload): Promise<string> => {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer("my-app")
        .setAudience("my-app-client")
        .setExpirationTime("15m")
        .sign(secret)
}

export const verifyJwt = async (token: string): Promise<JwtPayload | null> => {
    try {
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ["HS256"],
            audience: "my-app-client",
            issuer: "my-app"
        })

        const result = jwtPayloadSchema.safeParse(payload)
        if (!result.success) {
            return null
        }

        return result.data
    } catch {
        return null
    }
}