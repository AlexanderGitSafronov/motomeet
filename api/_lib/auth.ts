import crypto from 'node:crypto'

const SECRET = process.env.JWT_SECRET || 'motomeet_dev_secret'

/** Password hashing with Node's built-in scrypt (no external deps). Stored as "salt:hash". */
export function hashPassword(pw: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex')
    crypto.scrypt(pw, salt, 32, (err, dk) => (err ? reject(err) : resolve(`${salt}:${dk.toString('hex')}`)))
  })
}

export function verifyPassword(pw: string, stored: string): Promise<boolean> {
  return new Promise((resolve) => {
    const [salt, key] = (stored || '').split(':')
    if (!salt || !key) return resolve(false)
    crypto.scrypt(pw, salt, 32, (err, dk) => {
      if (err) return resolve(false)
      const a = Buffer.from(key, 'hex')
      resolve(a.length === dk.length && crypto.timingSafeEqual(a, dk))
    })
  })
}

/** Stateless HMAC-signed token: base64url(payload).signature (no JWT lib). */
export function signToken(userId: string): string {
  const payload = Buffer.from(JSON.stringify({ sub: userId, exp: Date.now() + 30 * 86400000 })).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function userIdFromAuth(authHeader: string | undefined): string | null {
  if (!authHeader) return null
  const token = authHeader.replace(/^Bearer\s+/i, '')
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { sub?: string; exp?: number }
    if (data.exp && Date.now() > data.exp) return null
    return data.sub ?? null
  } catch {
    return null
  }
}
