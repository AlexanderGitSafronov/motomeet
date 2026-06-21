import { describe, it, expect } from 'vitest'
import { translate } from '@/i18n'

describe('i18n', () => {
  it('returns the source string for Ukrainian', () => {
    expect(translate('Карта', 'uk')).toBe('Карта')
    expect(translate('Налаштування', 'uk')).toBe('Налаштування')
  })

  it('translates to English', () => {
    expect(translate('Карта', 'en')).toBe('Map')
    expect(translate('Події', 'en')).toBe('Events')
    expect(translate('Налаштування', 'en')).toBe('Settings')
    expect(translate('Стежити', 'en')).toBe('Follow')
  })

  it('translates to other supported languages', () => {
    expect(translate('Карта', 'de')).toBe('Karte')
    expect(translate('Карта', 'es')).toBe('Mapa')
    expect(translate('Карта', 'fr')).toBe('Carte')
    expect(translate('Карта', 'zh')).toBe('地图')
  })

  it('falls back to the source for unknown keys', () => {
    expect(translate('Невідомий рядок', 'en')).toBe('Невідомий рядок')
    expect(translate('Карта', 'uk')).toBe('Карта')
  })
})
