import { createHash, randomBytes, timingSafeEqual } from "crypto"

const REFRESH_TOKEN_BYTES = 64

export function generateRefreshToken(): string {
    return randomBytes(REFRESH_TOKEN_BYTES).toString("hex")
}

export function hashRefreshToken(token: string): string {
    return createHash("sha256")
        .update(token)
        .digest("hex")
}

export function verifyRefreshToken(token: string ,storedHash: string): boolean {
    const tokenHash = hashRefreshToken(token)

    const tokenBuffer = Buffer.from(tokenHash, "hex")
    const storedBuffer = Buffer.from(storedHash, "hex")

    if (tokenBuffer.length !== storedBuffer.length) {
        return false
    }

    return timingSafeEqual(tokenBuffer, storedBuffer)
}