// Collect every Ukrainian source string that needs translating:
//  - keys of the current dict in src/i18n/index.ts (UI strings, with their en)
//  - every t('…') call in the landing files
// Output: /tmp/i18n-source.json  → { ui: {uk: en}, all: [uk, …] }
import { readFileSync, writeFileSync } from 'node:fs'

const root = new URL('..', import.meta.url).pathname

// --- UI dict (uk -> en) from the existing index.ts -------------------------
const idx = readFileSync(root + 'src/i18n/index.ts', 'utf8')
const dictBody = idx.slice(idx.indexOf('const dict'), idx.indexOf('export function translate'))
const ui = {}
// matches:   Карта: { en: 'Map', ...   OR   'Створити подію': { en: 'Create event', ...
const re = /(?:^|\n)\s*(?:'([^']+)'|([A-Za-zА-Яа-яҐґЄєІіЇї’0-9 .,!?+«»()/-]+?)):\s*\{\s*en:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g
let m
while ((m = re.exec(dictBody))) {
  const uk = (m[1] ?? m[2] ?? '').trim()
  const en = (m[3] ?? m[4] ?? '').replace(/\\(['"])/g, '$1')
  if (uk) ui[uk] = en
}

// --- landing strings: every single-quoted literal containing Cyrillic -------
// (covers both t('…') calls and array literals like title:'Жива карта…' that
//  are t()-wrapped at render time)
const landing = ['src/screens/landing/Landing.tsx', 'src/screens/landing/parts.tsx']
  .map((p) => readFileSync(root + p, 'utf8'))
  .join('\n')
const lit = /'((?:[^'\\]|\\.)*)'/g
const cyr = /[А-Яа-яЀ-ӿ]/
const landingKeys = new Set()
while ((m = lit.exec(landing))) {
  const s = m[1].replace(/\\'/g, "'")
  if (cyr.test(s)) landingKeys.add(s)
}

const all = new Set([...Object.keys(ui), ...landingKeys])

writeFileSync('/tmp/i18n-source.json', JSON.stringify({ ui, all: [...all] }, null, 2))
console.log(`UI keys: ${Object.keys(ui).length}, landing t() keys: ${landingKeys.size}, total unique: ${all.size}`)
