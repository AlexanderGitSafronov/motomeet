/** Українські форматувальники, що використовуються в застосунку. */

const UK_WEEKDAYS_SHORT = ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'] // getDay(): 0 = неділя
const UK_MONTHS_SHORT = ['СІЧ', 'ЛЮТ', 'БЕР', 'КВІ', 'ТРА', 'ЧЕР', 'ЛИП', 'СЕР', 'ВЕР', 'ЖОВ', 'ЛИС', 'ГРУ']
const UK_MONTHS_GEN = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
]

/** 1240 -> "1 240" (українська група розрядів — нерозривний пробіл як звичайний) */
export function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/** 2100 -> "2.1 тис" — компактний підпис для статистики */
export function compact(n: number): string {
  if (n < 1000) return String(n)
  const k = n / 1000
  return `${k % 1 === 0 ? k : k.toFixed(1)} тис`
}

/** відстань у км -> "0,8 км" / "2,1 км" / "12 км" */
export function formatKm(km: number): string {
  const v = km < 10 ? km.toFixed(1) : String(Math.round(km))
  return `${v.replace('.', ',')} км`
}

/** "2026-06-28T10:00:00" -> { day: "28", month: "ЧЕР" } для бейджів дати */
export function dateBadge(iso: string): { day: string; month: string } {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  return { day, month: UK_MONTHS_SHORT[d.getMonth()] }
}

/** "2026-06-28T10:00:00" -> "нд, 28 червня · 10:00" (повний рядок для деталей) */
export function fullDateTime(iso: string): string {
  const d = new Date(iso)
  const wd = UK_WEEKDAYS_SHORT[d.getDay()]
  const time = d.toLocaleString('uk-UA', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${wd}, ${d.getDate()} ${UK_MONTHS_GEN[d.getMonth()]} · ${time}`
}

/** "2026-06-28T10:00:00" -> "нд 10:00" */
export function dateTimeLabel(iso: string): string {
  const d = new Date(iso)
  const wd = UK_WEEKDAYS_SHORT[d.getDay()]
  const time = d.toLocaleString('uk-UA', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${wd} ${time}`
}

/** секунди -> "0:34" для голосових повідомлень */
export function duration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/** допоміжний плюралізатор для українських іменників */
export function plural(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  let form: string
  if (mod10 === 1 && mod100 !== 11) form = forms[0]
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) form = forms[1]
  else form = forms[2]
  return `${n} ${form}`
}
