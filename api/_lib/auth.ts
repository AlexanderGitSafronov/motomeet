import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'motomeet_dev_secret'

export function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10)
}

export function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash)
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: '30d' })
}

/** Returns the user id from an Authorization: Bearer <token> header, or null. */
export function userIdFromAuth(authHeader: string | undefined): string | null {
  if (!authHeader) return null
  const token = authHeader.replace(/^Bearer\s+/i, '')
  try {
    const payload = jwt.verify(token, SECRET) as { sub?: string }
    return payload.sub ?? null
  } catch {
    return null
  }
}
