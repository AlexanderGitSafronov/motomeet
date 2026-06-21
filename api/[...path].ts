import type { VercelRequest, VercelResponse } from '@vercel/node'
import { route } from './_lib/router'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS (same-origin in prod, but allow local dev clients)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  try {
    const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
    const body = typeof req.body === 'string' ? safeParse(req.body) : req.body
    const result = await route(req.method ?? 'GET', pathname, body, req.headers.authorization)
    res.status(result.status).json(result.body)
  } catch (e) {
    console.error('API error:', e)
    res.status(500).json({ error: 'Внутрішня помилка сервера' })
  }
}

function safeParse(s: string) {
  try {
    return JSON.parse(s)
  } catch {
    return undefined
  }
}
