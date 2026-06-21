import { useAppStore, type Lang } from '@/store/useAppStore'
import en from './locales/en'
import es from './locales/es'
import pt from './locales/pt'
import de from './locales/de'
import fr from './locales/fr'
import it from './locales/it'
import pl from './locales/pl'
import zh from './locales/zh'
import ja from './locales/ja'

export type { Lang }

/** Languages offered in the switcher. Ukrainian is the source/default. */
export const LANGUAGES: { value: Lang; label: string; flag: string }[] = [
  { value: 'uk', label: 'Українська', flag: '🇺🇦' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'pt', label: 'Português', flag: '🇧🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'it', label: 'Italiano', flag: '🇮🇹' },
  { value: 'pl', label: 'Polski', flag: '🇵🇱' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
]

/**
 * Per-language tables keyed by the Ukrainian source string. `translate()`
 * returns the source as-is for `uk`, the mapped value otherwise, and falls
 * back to the source when an entry is missing.
 */
const tables: Record<Exclude<Lang, 'uk'>, Record<string, string>> = {
  en,
  es,
  pt,
  de,
  fr,
  it,
  pl,
  zh,
  ja,
}

const INTL_LOCALE: Record<Lang, string> = {
  uk: 'uk-UA',
  en: 'en-US',
  es: 'es-ES',
  pt: 'pt-BR',
  de: 'de-DE',
  fr: 'fr-FR',
  it: 'it-IT',
  pl: 'pl-PL',
  zh: 'zh-CN',
  ja: 'ja-JP',
}

/** BCP-47 locale for `Intl` / `toLocaleString` number & date formatting. */
export function localeOf(lang: Lang): string {
  return INTL_LOCALE[lang] ?? 'en-US'
}

export function translate(uk: string, lang: Lang): string {
  if (lang === 'uk') return uk
  return tables[lang]?.[uk] ?? uk
}

/** Hook returning a `t(uk)` function bound to the current language. */
export function useT() {
  const lang = useAppStore((s) => s.lang)
  return (uk: string) => translate(uk, lang)
}
