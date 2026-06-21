import { describe, it, expect } from 'vitest'
import {
  formatNumber,
  compact,
  formatKm,
  dateBadge,
  dateTimeLabel,
  fullDateTime,
  duration,
  plural,
} from '@/lib/format'

describe('format helpers', () => {
  it('groups thousands with a space (uk)', () => {
    expect(formatNumber(1240)).toBe('1 240')
    expect(formatNumber(2100)).toBe('2 100')
    expect(formatNumber(47)).toBe('47')
  })

  it('compacts large numbers', () => {
    expect(compact(842)).toBe('842')
    expect(compact(2100)).toBe('2.1 тис')
    expect(compact(2000)).toBe('2 тис')
  })

  it('formats distances with a comma and км', () => {
    expect(formatKm(0.8)).toBe('0,8 км')
    expect(formatKm(2.1)).toBe('2,1 км')
    expect(formatKm(124)).toBe('124 км')
  })

  it('builds a date badge (uk months)', () => {
    expect(dateBadge('2026-06-28T10:00:00')).toEqual({ day: '28', month: 'ЧЕР' })
  })

  it('builds a weekday + time label from the real date', () => {
    // 2026-06-28 — неділя
    expect(dateTimeLabel('2026-06-28T10:00:00')).toBe('нд 10:00')
    expect(dateTimeLabel('2026-07-02T17:30:00')).toBe('чт 17:30')
  })

  it('builds a full date line (uk genitive month)', () => {
    expect(fullDateTime('2026-06-28T10:00:00')).toBe('нд, 28 червня · 10:00')
  })

  it('formats voice durations', () => {
    expect(duration(34)).toBe('0:34')
    expect(duration(42)).toBe('0:42')
    expect(duration(90)).toBe('1:30')
  })

  it('pluralizes Ukrainian nouns', () => {
    const forms: [string, string, string] = ['райдер', 'райдери', 'райдерів']
    expect(plural(1, forms)).toBe('1 райдер')
    expect(plural(3, forms)).toBe('3 райдери')
    expect(plural(5, forms)).toBe('5 райдерів')
    expect(plural(21, forms)).toBe('21 райдер')
  })
})
