/**
 * Local API server for development — mounts the same router used by the Vercel
 * serverless function. Run with: `npx tsx scripts/serve.ts` (port 4000).
 */
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { route } from '../api/_lib/router'

// load .env
try {
  const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
  for (const line of txt.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
} catch {
  /* ignore */
}

const PORT = Number(process.env.API_PORT || 4000)

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    res.writeHead(204).end()
    return
  }

  const chunks: Buffer[] = []
  for await (const c of req) chunks.push(c as Buffer)
  const raw = Buffer.concat(chunks).toString()
  let body: unknown
  try {
    body = raw ? JSON.parse(raw) : undefined
  } catch {
    body = undefined
  }

  try {
    const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
    const result = await route(req.method ?? 'GET', pathname, body, req.headers.authorization)
    res.writeHead(result.status, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result.body))
  } catch (e) {
    console.error('API error:', e)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Внутрішня помилка сервера' }))
  }
})

server.listen(PORT, () => console.log(`API on http://localhost:${PORT}`))
